import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getDbConnection } from "../../../../lib/db"

// GET /public/cms/pages - Publiczny endpoint dla stron CMS
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const client = await getDbConnection()
    const { slug, locale = 'pl' } = req.query
    
    if (slug) {
      // Pobierz pojedynczą stronę po slug
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
      return
    }
    
    // Pobierz wszystkie opublikowane strony
    const result = await client.query(
      `SELECT id, slug, title, meta_description, template, locale, published_at 
       FROM cms_page 
       WHERE status = 'published' AND locale = $1
       ORDER BY title`,
      [locale]
    )
    client.release()
    
    res.json({ pages: result.rows })
  } catch (error) {
    console.error("Error fetching CMS pages:", error)
    res.json({ pages: [], page: null })
  }
}
