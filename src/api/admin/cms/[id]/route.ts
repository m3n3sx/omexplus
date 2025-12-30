import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getDbConnection } from "../../../../lib/db"

// GET /admin/cms/:id - Pobierz pojedynczy element
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const { id } = req.params
    const client = await getDbConnection()
    
    const result = await client.query(
      `SELECT * FROM cms_content WHERE id = $1`,
      [id]
    )
    
    client.release()
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Content not found" })
    }
    
    res.json({ content: result.rows[0] })
  } catch (error) {
    console.error('CMS Get Error:', error)
    res.status(500).json({ error: 'Failed to fetch content' })
  }
}

// PUT /admin/cms/:id - Aktualizuj element
export const PUT = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const { id } = req.params
    const { key, type, name, description, content, is_active, sort_order, locale, metadata } = req.body as any
    const client = await getDbConnection()
    
    const result = await client.query(
      `UPDATE cms_content SET 
        key = COALESCE($2, key),
        type = COALESCE($3, type),
        name = COALESCE($4, name),
        description = COALESCE($5, description),
        content = COALESCE($6, content),
        is_active = COALESCE($7, is_active),
        sort_order = COALESCE($8, sort_order),
        locale = COALESCE($9, locale),
        metadata = COALESCE($10, metadata),
        updated_at = NOW()
       WHERE id = $1 
       RETURNING *`,
      [
        id,
        key,
        type,
        name,
        description,
        content ? JSON.stringify(content) : null,
        is_active,
        sort_order,
        locale,
        metadata ? JSON.stringify(metadata) : null
      ]
    )
    
    client.release()
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Content not found" })
    }
    
    res.json({ content: result.rows[0] })
  } catch (error) {
    console.error('CMS Update Error:', error)
    res.status(500).json({ error: 'Failed to update content' })
  }
}

// DELETE /admin/cms/:id - Usuń element
export const DELETE = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const { id } = req.params
    const client = await getDbConnection()
    
    const result = await client.query(
      `DELETE FROM cms_content WHERE id = $1 RETURNING id`,
      [id]
    )
    
    client.release()
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Content not found" })
    }
    
    res.json({ success: true, id })
  } catch (error) {
    console.error('CMS Delete Error:', error)
    res.status(500).json({ error: 'Failed to delete content' })
  }
}
