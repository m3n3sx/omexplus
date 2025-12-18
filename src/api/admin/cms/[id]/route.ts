import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// GET /admin/cms/:id - Pobierz pojedynczy element
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const { id } = req.params
    const manager = req.scope.resolve("manager")
    
    const result = await manager.query(
      `SELECT * FROM cms_content WHERE id = $1`,
      [id]
    )
    
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
    const updates = req.body
    const manager = req.scope.resolve("manager")
    
    // Build update query dynamically
    const fields = Object.keys(updates)
    const values = Object.values(updates).map(v => 
      typeof v === 'object' ? JSON.stringify(v) : v
    )
    
    const setClause = fields.map((field, i) => `${field} = $${i + 2}`).join(', ')
    
    const result = await manager.query(
      `UPDATE cms_content SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id, ...values]
    )
    
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
    const manager = req.scope.resolve("manager")
    
    const result = await manager.query(
      `DELETE FROM cms_content WHERE id = $1 RETURNING id`,
      [id]
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Content not found" })
    }
    
    res.json({ success: true, id })
  } catch (error) {
    console.error('CMS Delete Error:', error)
    res.status(500).json({ error: 'Failed to delete content' })
  }
}
