import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getDbConnection } from "../../../../lib/db"

// GET /admin/cms/menus - Lista wszystkich menu
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const client = await getDbConnection()
    const { locale, position } = req.query
    
    let query = `SELECT * FROM cms_menu WHERE 1=1`
    const params: any[] = []
    let paramIndex = 1
    
    if (locale) {
      params.push(locale)
      query += ` AND locale = $${paramIndex++}`
    }
    
    if (position) {
      params.push(position)
      query += ` AND position = $${paramIndex++}`
    }
    
    query += ` ORDER BY name`
    
    const result = await client.query(query, params)
    
    // Pobierz items dla każdego menu
    for (const menu of result.rows) {
      const items = await client.query(
        `SELECT * FROM cms_menu_item WHERE menu_id = $1 ORDER BY sort_order, label`,
        [menu.id]
      )
      menu.items = items.rows
    }
    
    client.release()
    res.json({ menus: result.rows })
  } catch (error) {
    console.error('CMS Menus Admin Error:', error)
    res.status(500).json({ error: 'Failed to fetch menus' })
  }
}

// POST /admin/cms/menus - Utwórz nowe menu
export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const client = await getDbConnection()
    const { key, name, position, is_active, locale } = req.body as any
    
    if (!key || !name || !position) {
      client.release()
      return res.status(400).json({ 
        error: "Missing required fields: key, name, position" 
      })
    }
    
    const result = await client.query(
      `INSERT INTO cms_menu (key, name, position, is_active, locale) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [key, name, position, is_active ?? true, locale ?? 'pl']
    )
    
    client.release()
    res.json({ menu: result.rows[0] })
  } catch (error) {
    console.error('CMS Menu Create Error:', error)
    res.status(500).json({ error: 'Failed to create menu' })
  }
}
