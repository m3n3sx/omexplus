import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getDbConnection } from "../../../../../lib/db"

// GET /public/cms/pages/:slug - Pobierz stronę po slug
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const { slug } = req.params
    const locale = (req.query.locale as string) || 'pl'
    const client = await getDbConnection()
    
    // Sprawdź w cms_page
    const result = await client.query(
      `SELECT * FROM cms_page WHERE slug = $1 AND locale = $2 AND status = 'published'`,
      [slug, locale]
    )
    
    client.release()
    
    if (result.rows.length > 0) {
      res.json({ page: result.rows[0] })
      return
    }
    
    res.json({ page: null })
  } catch (error) {
    console.error("Error fetching CMS page:", error)
    res.json({ page: null })
  }
}
