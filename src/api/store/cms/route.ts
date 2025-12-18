import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// GET /store/cms - Publiczny endpoint dla frontendu
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const manager = req.scope.resolve("manager")
    const { key, type, locale = 'pl' } = req.query
    
    let query = `SELECT * FROM cms_content WHERE is_active = true AND locale = $1`
    const params: any[] = [locale]
    
    if (key) {
      params.push(key)
      query += ` AND key = $${params.length}`
    }
    
    if (type) {
      params.push(type)
      query += ` AND type = $${params.length}`
    }
    
    query += ` ORDER BY sort_order, name`
    
    const result = await manager.query(query, params)
    
    // Jeśli szukamy po key, zwróć pojedynczy element
    if (key && result.rows.length > 0) {
      return res.json({ content: result.rows[0] })
    }
    
    res.json({ contents: result.rows })
  } catch (error) {
    console.error('CMS Store API Error:', error)
    res.status(500).json({ error: 'Failed to fetch CMS content' })
  }
}
