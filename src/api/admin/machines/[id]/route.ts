/**
 * Admin Machine by ID API
 * GET /admin/machines/:id - Get single machine
 * PUT /admin/machines/:id - Update machine
 * DELETE /admin/machines/:id - Delete machine
 */

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getDbConnection } from "../../../../lib/db"

// GET /admin/machines/:id
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { id } = req.params

    const client = await getDbConnection()
    
    const result = await client.query(
      `SELECT * FROM omex.machines WHERE id = $1`,
      [id]
    )

    client.release()

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Machine not found" })
    }

    res.json({ machine: result.rows[0] })
  } catch (error: any) {
    console.error("Error fetching machine:", error)
    res.status(500).json({ error: error.message })
  }
}

// PUT /admin/machines/:id
export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { id } = req.params
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

    const client = await getDbConnection()

    const result = await client.query(
      `UPDATE omex.machines SET
        manufacturer = COALESCE($1, manufacturer),
        model_code = COALESCE($2, model_code),
        model_family = COALESCE($3, model_family),
        serial_range_start = COALESCE($4, serial_range_start),
        serial_range_end = COALESCE($5, serial_range_end),
        year_from = $6,
        year_to = $7,
        engine_manufacturer = COALESCE($8, engine_manufacturer),
        engine_model = COALESCE($9, engine_model),
        notes = COALESCE($10, notes),
        updated_at = NOW()
       WHERE id = $11
       RETURNING *`,
      [
        manufacturer?.toUpperCase(),
        model_code,
        model_family,
        serial_range_start,
        serial_range_end,
        year_from || null,
        year_to || null,
        engine_manufacturer,
        engine_model,
        notes,
        id
      ]
    )

    client.release()

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Machine not found" })
    }

    res.json({ machine: result.rows[0] })
  } catch (error: any) {
    console.error("Error updating machine:", error)
    res.status(500).json({ error: error.message })
  }
}

// DELETE /admin/machines/:id
export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { id } = req.params

    const client = await getDbConnection()
    
    const result = await client.query(
      `DELETE FROM omex.machines WHERE id = $1 RETURNING id`,
      [id]
    )

    client.release()

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Machine not found" })
    }

    res.json({ success: true, deleted_id: id })
  } catch (error: any) {
    console.error("Error deleting machine:", error)
    res.status(500).json({ error: error.message })
  }
}
