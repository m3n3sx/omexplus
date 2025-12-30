import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getDbConnection } from "../../../lib/db"

// GET /public/cms - Publiczny endpoint dla CMS content
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const client = await getDbConnection()
    const { key, type, locale = 'pl' } = req.query
    
    let query = `SELECT * FROM cms_content WHERE is_active = true AND locale = $1`
    const params: any[] = [locale]
    let paramIndex = 2
    
    if (key) {
      params.push(key)
      query += ` AND key = $${paramIndex++}`
    }
    
    if (type) {
      params.push(type)
      query += ` AND type = $${paramIndex++}`
    }
    
    query += ` ORDER BY sort_order, name`
    
    const result = await client.query(query, params)
    client.release()
    
    // Jeśli szukamy po key, zwróć pojedynczy element
    if (key && result.rows.length > 0) {
      return res.json({ content: result.rows[0] })
    }
    
    res.json({ contents: result.rows })
  } catch (error) {
    console.error("Error fetching CMS content:", error)
    res.json({ contents: [] })
  }
}
