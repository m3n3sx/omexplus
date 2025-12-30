import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getDbConnection } from "../../../../lib/db"

// GET /store/cms/pages - Publiczne strony CMS dla frontendu
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const client = await getDbConnection()
    const { slug, locale = 'pl' } = req.query
    
    let query = `SELECT * FROM cms_page WHERE status = 'published' AND locale = $1`
    const params: any[] = [locale]
    let paramIndex = 2
    
    if (slug) {
      params.push(slug)
      query += ` AND slug = $${paramIndex++}`
    }
    
    query += ` ORDER BY updated_at DESC`
    
    const result = await client.query(query, params)
    client.release()
    
    // Jeśli szukamy po slug, zwróć pojedynczą stronę
    if (slug && result.rows.length > 0) {
      return res.json({ page: result.rows[0] })
    }
    
    res.json({ pages: result.rows })
  } catch (error) {
    console.error('CMS Pages Store API Error:', error)
    res.status(500).json({ error: 'Failed to fetch CMS pages' })
  }
}
