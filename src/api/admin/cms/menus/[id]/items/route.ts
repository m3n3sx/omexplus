import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getDbConnection } from "../../../../../../lib/db"

// GET /admin/cms/menus/:id/items - Pobierz items menu
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const { id } = req.params
    const client = await getDbConnection()
    
    const result = await client.query(
      `SELECT * FROM cms_menu_item WHERE menu_id = $1 ORDER BY sort_order, label`,
      [id]
    )
    
    client.release()
    res.json({ items: result.rows })
  } catch (error) {
    console.error('CMS Menu Items Error:', error)
    res.status(500).json({ error: 'Failed to fetch menu items' })
  }
}

// POST /admin/cms/menus/:id/items - Dodaj item do menu
export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const { id: menu_id } = req.params
    const client = await getDbConnection()
    
    const { 
      parent_id, label, url, link_type, icon, description, 
      open_in_new_tab, sort_order, is_active, css_classes, metadata 
    } = req.body as any
    
    if (!label || !url) {
      client.release()
      return res.status(400).json({ 
        error: "Missing required fields: label, url" 
      })
    }
    
    const result = await client.query(
      `INSERT INTO cms_menu_item 
       (menu_id, parent_id, label, url, link_type, icon, description, 
        open_in_new_tab, sort_order, is_active, css_classes, metadata) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
       RETURNING *`,
      [
        menu_id, parent_id || null, label, url, link_type ?? 'internal', icon || null, description || null,
        open_in_new_tab ?? false, sort_order ?? 0, is_active ?? true, 
        css_classes || null, JSON.stringify(metadata || {})
      ]
    )
    
    client.release()
    res.json({ item: result.rows[0] })
  } catch (error) {
    console.error('CMS Menu Item Create Error:', error)
    res.status(500).json({ error: 'Failed to create menu item' })
  }
}
