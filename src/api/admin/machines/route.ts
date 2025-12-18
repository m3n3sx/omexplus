/**
 * Admin Machines API
 * GET /admin/machines - List all machines with filters
 * POST /admin/machines - Create new machine
 */

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getDbConnection } from "../../../lib/db"

// GET /admin/machines
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { 
      manufacturer, 
      search, 
      type,
      limit = '50', 
      offset = '0' 
    } = req.query as Record<string, string>

    const client = await getDbConnection()
    
    let whereClause = 'WHERE 1=1'
    const params: any[] = []
    let paramIndex = 1

    if (manufacturer) {
      whereClause += ` AND manufacturer = $${paramIndex++}`
      params.push(manufacturer)
    }

    if (search) {
      whereClause += ` AND (model_code ILIKE $${paramIndex} OR engine_model ILIKE $${paramIndex})`
      params.push(`%${search}%`)
      paramIndex++
    }

    if (type) {
      whereClause += ` AND notes ILIKE $${paramIndex++}`
      params.push(`%${type}%`)
    }

    // Get total count
    const countResult = await client.query(
      `SELECT COUNT(*) FROM omex.machines ${whereClause}`,
      params
    )
    const total = parseInt(countResult.rows[0].count)

    // Get machines with pagination
    const limitParam = paramIndex++
    const offsetParam = paramIndex
    const result = await client.query(
      `SELECT id, manufacturer, model_code, model_family, 
              serial_range_start, serial_range_end,
              year_from, year_to, engine_manufacturer, engine_model,
              data_source, notes, created_at, updated_at
       FROM omex.machines 
       ${whereClause}
       ORDER BY manufacturer, model_code
       LIMIT $${limitParam} OFFSET $${offsetParam}`,
      [...params, parseInt(limit), parseInt(offset)]
    )

    // Get manufacturers for filter
    const mfgResult = await client.query(
      `SELECT DISTINCT manufacturer, COUNT(*) as count 
       FROM omex.machines 
       GROUP BY manufacturer 
       ORDER BY count DESC`
    )

    client.release()

    res.json({
      machines: result.rows,
      manufacturers: mfgResult.rows,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    })
  } catch (error: any) {
    console.error("Error fetching machines:", error)
    res.status(500).json({ error: error.message })
  }
}


// POST /admin/machines - Create new machine
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const {
      manufacturer,
      model_code,
      model_family,
      serial_range_start,
      serial_range_end,
      year_from,
      year_to,
      engine_manufacturer,
      engine_model,
      notes
    } = req.body as any

    if (!manufacturer || !model_code) {
      return res.status(400).json({ error: "Manufacturer and model_code are required" })
    }

    const client = await getDbConnection()

    const result = await client.query(
      `INSERT INTO omex.machines 
       (manufacturer, model_code, model_family, serial_range_start, serial_range_end,
        year_from, year_to, engine_manufacturer, engine_model, data_source, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'manual', $10)
       RETURNING *`,
      [
        manufacturer.toUpperCase(),
        model_code,
        model_family || '',
        serial_range_start || '',
        serial_range_end || '',
        year_from || null,
        year_to || null,
        engine_manufacturer || '',
        engine_model || '',
        notes || ''
      ]
    )

    client.release()

    res.status(201).json({ machine: result.rows[0] })
  } catch (error: any) {
    console.error("Error creating machine:", error)
    if (error.code === '23505') {
      return res.status(400).json({ error: "Machine with this manufacturer and model already exists" })
    }
    res.status(500).json({ error: error.message })
  }
}
