/**
 * Product Enquiries API
 * POST /store/enquiries - Create new product enquiry
 * GET /store/enquiries - Get enquiries (for admin)
 */

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

interface EnquiryRequest {
  product_id: string
  product_title: string
  product_sku?: string
  customer_name: string
  customer_email: string
  customer_phone?: string
  company_name?: string
  quantity: number
  message?: string
  type: 'product_enquiry' | 'price_request' | 'availability_check' | 'bulk_order'
}

// POST /store/enquiries - Create new enquiry
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const data = req.body as EnquiryRequest

    // Validate required fields
    if (!data.product_id || !data.customer_name || !data.customer_email) {
      res.status(400).json({
        success: false,
        error: "Missing required fields",
        required: ["product_id", "customer_name", "customer_email"]
      })
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.customer_email)) {
      res.status(400).json({
        success: false,
        error: "Invalid email format"
      })
      return
    }

    const knex = req.scope.resolve("__pg_connection__")

    // Create enquiries table if not exists
    await knex.raw(`
      CREATE TABLE IF NOT EXISTS product_enquiry (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        product_id VARCHAR(255) NOT NULL,
        product_title VARCHAR(500),
        product_sku VARCHAR(100),
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(50),
        company_name VARCHAR(255),
        quantity INTEGER DEFAULT 1,
        message TEXT,
        type VARCHAR(50) DEFAULT 'product_enquiry',
        status VARCHAR(50) DEFAULT 'pending',
        assigned_to VARCHAR(255),
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        responded_at TIMESTAMP WITH TIME ZONE
      )
    `)

    // Insert enquiry
    const result = await knex.raw(`
      INSERT INTO product_enquiry (
        product_id, product_title, product_sku,
        customer_name, customer_email, customer_phone, company_name,
        quantity, message, type
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [
      data.product_id,
      data.product_title,
      data.product_sku,
      data.customer_name,
      data.customer_email,
      data.customer_phone,
      data.company_name,
      data.quantity || 1,
      data.message,
      data.type || 'product_enquiry'
    ])

    const enquiry = result.rows[0]

    // TODO: Send notification email to sales team
    // TODO: Send confirmation email to customer

    res.status(201).json({
      success: true,
      enquiry: {
        id: enquiry.id,
        product_title: enquiry.product_title,
        status: enquiry.status,
        created_at: enquiry.created_at
      },
      message: "Zapytanie zostało wysłane. Odpowiemy najszybciej jak to możliwe."
    })

  } catch (error: any) {
    console.error("Enquiry creation error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to create enquiry",
      message: error.message
    })
  }
}

// GET /store/enquiries - Get enquiries (requires auth in production)
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const { status, limit = 50, offset = 0 } = req.query

    const knex = req.scope.resolve("__pg_connection__")

    let sql = `
      SELECT * FROM product_enquiry
      WHERE 1=1
    `
    const params: any[] = []
    let paramIndex = 1

    if (status) {
      sql += ` AND status = $${paramIndex}`
      params.push(status)
      paramIndex++
    }

    sql += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`
    params.push(limit, offset)

    const result = await knex.raw(sql, params)

    // Get total count
    const countResult = await knex.raw(`
      SELECT COUNT(*) as total FROM product_enquiry
      ${status ? 'WHERE status = $1' : ''}
    `, status ? [status] : [])

    res.json({
      success: true,
      enquiries: result.rows,
      total: parseInt(countResult.rows[0].total),
      limit: parseInt(limit as string),
      offset: parseInt(offset as string)
    })

  } catch (error: any) {
    console.error("Enquiry fetch error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to fetch enquiries",
      message: error.message
    })
  }
}
