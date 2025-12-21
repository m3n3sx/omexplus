import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const { email, password, first_name, last_name, phone } = req.body

  try {
    if (!email || !password) {
      res.status(400).json({
        message: "Email and password are required",
      })
      return
    }

    const knex = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION)

    // Check if customer already exists
    const existingCustomer = await knex("customer")
      .where({ email })
      .first()

    if (existingCustomer) {
      res.status(400).json({
        message: "Klient z tym adresem email już istnieje",
      })
      return
    }

    // Store password hash (in production, use bcrypt)
    const crypto = require('crypto')
    const passwordHash = crypto
      .createHash('sha256')
      .update(password)
      .digest('hex')

    // Create customer with password stored in metadata
    const customerId = `cus_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
    
    const [customer] = await knex("customer")
      .insert({
        id: customerId,
        email,
        first_name: first_name || "",
        last_name: last_name || "",
        phone: phone || null,
        has_account: true,
        metadata: JSON.stringify({
          password_hash: passwordHash,
        }),
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning("*")

    // Generate token
    const token = Buffer.from(
      JSON.stringify({
        sub: customerId,
        email: customer.email,
        iat: Math.floor(Date.now() / 1000),
      })
    ).toString('base64')

    res.status(201).json({
      customer: {
        id: customer.id,
        email: customer.email,
        first_name: customer.first_name,
        last_name: customer.last_name,
        phone: customer.phone,
      },
      token,
    })
  } catch (error: any) {
    console.error('Registration error:', error)
    res.status(400).json({
      message: error.message || "Registration failed",
    })
  }
}
