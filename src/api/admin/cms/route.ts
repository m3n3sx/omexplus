import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// GET /admin/cms - Lista wszystkich elementów CMS
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const manager = req.scope.resolve("manager")
    const { type, locale, is_active } = req.query
    
    let query = `SELECT * FROM cms_content WHERE 1=1`
    const params: any[] = []
    
    if (type) {
      params.push(type)
      query += ` AND type = $${params.length}`
    }
    
    if (locale) {
      params.push(locale)
      query += ` AND locale = $${params.length}`
    }
    
    if (is_active !== undefined) {
      params.push(is_active === 'true')
      query += ` AND is_active = $${params.length}`
    }
    
    query += ` ORDER BY sort_order, name`
    
    const result = await manager.query(query, params)
    
    res.json({ contents: result.rows })
  } catch (error) {
    console.error('CMS Admin API Error:', error)
    res.status(500).json({ error: 'Failed to fetch CMS contents' })
  }
}

// POST /admin/cms - Utwórz nowy element CMS
export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const manager = req.scope.resolve("manager")
    const { key, type, name, description, content, is_active, sort_order, locale, metadata } = req.body
    
    if (!key || !type || !name) {
      return res.status(400).json({ 
        error: "Missing required fields: key, type, name" 
      })
    }
    
    const result = await manager.query(
      `INSERT INTO cms_content (key, type, name, description, content, is_active, sort_order, locale, metadata) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING *`,
      [
        key, 
        type, 
        name, 
        description, 
        JSON.stringify(content || {}), 
        is_active ?? true, 
        sort_order ?? 0, 
        locale ?? 'pl', 
        JSON.stringify(metadata || {})
      ]
    )
    
    res.json({ content: result.rows[0] })
  } catch (error) {
    console.error('CMS Create Error:', error)
    res.status(500).json({ error: 'Failed to create CMS content' })
  }
}
