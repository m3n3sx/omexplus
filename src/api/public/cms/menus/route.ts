import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getDbConnection } from "../../../../lib/db"

// GET /public/cms/menus - Publiczne menu CMS
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const client = await getDbConnection()
    const { key, position, locale = 'pl' } = req.query
    
    let query = `SELECT * FROM cms_menu WHERE is_active = true AND locale = $1`
    const params: any[] = [locale]
    let paramIndex = 2
    
    if (key) {
      params.push(key)
      query += ` AND key = $${paramIndex++}`
    }
    
    if (position) {
      params.push(position)
      query += ` AND position = $${paramIndex++}`
    }
    
    const result = await client.query(query, params)
    
    // Pobierz items dla każdego menu
    for (const menu of result.rows) {
      const items = await client.query(
        `SELECT * FROM cms_menu_item 
         WHERE menu_id = $1 AND is_active = true 
         ORDER BY sort_order, label`,
        [menu.id]
      )
      
      // Zbuduj hierarchię (parent-child)
      const itemsMap = new Map()
      const rootItems: any[] = []
      
      items.rows.forEach((item: any) => {
        itemsMap.set(item.id, { ...item, children: [] })
      })
      
      items.rows.forEach((item: any) => {
        const menuItem = itemsMap.get(item.id)
        if (item.parent_id) {
          const parent = itemsMap.get(item.parent_id)
          if (parent) {
            parent.children.push(menuItem)
          }
        } else {
          rootItems.push(menuItem)
        }
      })
      
      menu.items = rootItems
    }
    
    client.release()
    
    // Jeśli szukamy po key, zwróć pojedyncze menu
    if (key && result.rows.length > 0) {
      return res.json({ menu: result.rows[0] })
    }
    
    res.json({ menus: result.rows })
  } catch (error) {
    console.error("Error fetching CMS menus:", error)
    res.json({ menus: [] })
  }
}
