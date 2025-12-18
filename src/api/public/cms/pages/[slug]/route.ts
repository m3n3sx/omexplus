import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Client } from "pg"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const { slug } = req.params
  
  try {
    const client = new Client({
      connectionString: process.env.DATABASE_URL
    })
    
    await client.connect()
    const result = await client.query(`
      SELECT 
        id, slug, title, meta_description, meta_keywords,
        content, template, status, locale, published_at, 
        seo_title, seo_image, metadata,
        created_at, updated_at
      FROM cms_page
      WHERE slug = $1 AND status = 'published'
    `, [slug])
    await client.end()
    
    if (result.rows.length === 0) {
      res.status(404).json({ message: "Page not found" })
      return
    }
    
    const page = {
      ...result.rows[0],
      is_published: result.rows[0].status === 'published'
    }
    
    res.json({ page })
  } catch (error: any) {
    console.error("Error fetching CMS page by slug:", error)
    res.status(500).json({ 
      message: "Internal server error", 
      error: error?.message || String(error) 
    })
  }
}
