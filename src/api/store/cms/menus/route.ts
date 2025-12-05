import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// GET /store/cms/menus - Publiczne menu dla frontendu
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const manager = req.scope.resolve("manager")
    const { key, position, locale = 'pl' } = req.query
    
    let query = `SELECT * FROM cms_menu WHERE is_active = true AND locale = $1`
    const params: any[] = [locale]
    
    if (key) {
      params.push(key)
      query += ` AND key = $${params.length}`
    }
    
    if (position) {
      params.push(position)
      query += ` AND position = $${params.length}`
    }
    
    const result = await manager.query(query, params)
    
    // Pobierz items dla każdego menu
    for (const menu of result.rows) {
      const items = await manager.query(
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
    
    // Jeśli szukamy po key, zwróć pojedyncze menu
    if (key && result.rows.length > 0) {
      return res.json({ menu: result.rows[0] })
    }
    
    res.json({ menus: result.rows })
  } catch (error) {
    console.error('CMS Menus Error:', error)
    res.status(500).json({ error: 'Failed to fetch menus' })
  }
}
