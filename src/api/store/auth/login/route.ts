import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { email, password } = req.body as { email: string; password: string }

  try {
    if (!email || !password) {
      res.status(400).json({
        message: "Email and password are required",
      })
      return
    }

    const knex = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION)

    // Find customer by email
    const customer = await knex("customer")
      .where({ email })
      .first()

    if (!customer) {
      res.status(401).json({
        message: "Invalid email or password",
      })
      return
    }

    // Verify password - stored in customer metadata
    const crypto = require('crypto')
    const hashedPassword = crypto
      .createHash('sha256')
      .update(password)
      .digest('hex')

    // Get stored password from customer metadata
    let metadata: any = {}
    if (customer.metadata) {
      try {
        metadata = typeof customer.metadata === 'string' 
          ? JSON.parse(customer.metadata) 
          : customer.metadata
      } catch (e) {
        console.error('Failed to parse metadata:', e)
      }
    }

    const storedHash = metadata?.password_hash
    if (!storedHash || storedHash !== hashedPassword) {
      res.status(401).json({
        message: "Invalid email or password",
      })
      return
    }

    // Generate a simple JWT token
    const token = Buffer.from(
      JSON.stringify({
        sub: customer.id,
        email: customer.email,
        iat: Math.floor(Date.now() / 1000),
      })
    ).toString('base64')

    res.json({
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
    console.error('Login error:', error)
    res.status(500).json({
      message: error.message || "Login failed",
    })
  }
}
