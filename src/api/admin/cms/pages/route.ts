import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getDbConnection } from "../../../../lib/db"

// GET /admin/cms/pages - Lista wszystkich stron
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const client = await getDbConnection()
    const { locale, status } = req.query
    
    let query = `SELECT * FROM cms_page WHERE 1=1`
    const params: any[] = []
    let paramIndex = 1
    
    if (locale) {
      params.push(locale)
      query += ` AND locale = $${paramIndex++}`
    }
    
    if (status) {
      params.push(status)
      query += ` AND status = $${paramIndex++}`
    }
    
    query += ` ORDER BY updated_at DESC`
    
    const result = await client.query(query, params)
    client.release()
    
    // Map to expected format
    const pages = result.rows.map(row => ({
      ...row,
      is_published: row.status === 'published'
    }))
    
    res.json({ pages })
  } catch (error) {
    console.error('CMS Pages API Error:', error)
    res.status(500).json({ error: 'Failed to fetch pages' })
  }
}

// POST /admin/cms/pages - Utwórz nową stronę
export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const client = await getDbConnection()
    const { 
      slug, title, meta_description, meta_keywords, content, 
      template, status, locale, seo_title, seo_image, metadata 
    } = req.body as any
    
    if (!slug || !title) {
      client.release()
      return res.status(400).json({ 
        error: "Missing required fields: slug, title" 
      })
    }
    
    const result = await client.query(
      `INSERT INTO cms_page 
       (slug, title, meta_description, meta_keywords, content, template, status, locale, seo_title, seo_image, metadata, published_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
       RETURNING *`,
      [
        slug, 
        title, 
        meta_description || null, 
        meta_keywords || null, 
        JSON.stringify(content || {}), 
        template || 'default', 
        status || 'draft', 
        locale || 'pl',
        seo_title || null,
        seo_image || null,
        JSON.stringify(metadata || {}),
        status === 'published' ? new Date() : null
      ]
    )
    
    client.release()
    res.json({ page: result.rows[0] })
  } catch (error: any) {
    console.error('CMS Page Create Error:', error)
    if (error.code === '23505') {
      res.status(400).json({ error: 'Strona z tym slugiem już istnieje' })
    } else {
      res.status(500).json({ error: 'Failed to create page' })
    }
  }
}
