import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getDbConnection } from "../../../../../lib/db"

// GET /admin/cms/pages/:id - Pobierz pojedynczą stronę
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const { id } = req.params
    const client = await getDbConnection()
    
    // Try to find by ID or slug
    const result = await client.query(
      `SELECT * FROM cms_page WHERE id = $1 OR slug = $1`,
      [id]
    )
    
    client.release()
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Page not found" })
    }
    
    const page = {
      ...result.rows[0],
      is_published: result.rows[0].status === 'published'
    }
    
    res.json({ page })
  } catch (error) {
    console.error('CMS Page Get Error:', error)
    res.status(500).json({ error: 'Failed to fetch page' })
  }
}

// POST /admin/cms/pages/:id - Aktualizuj stronę (używamy POST zamiast PUT dla kompatybilności)
export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const { id } = req.params
    const { 
      slug, title, meta_description, meta_keywords, content, 
      template, status, locale, seo_title, seo_image, metadata 
    } = req.body as any
    const client = await getDbConnection()
    
    // Check if status changed to published
    const currentPage = await client.query(`SELECT status FROM cms_page WHERE id = $1 OR slug = $1`, [id])
    const wasPublished = currentPage.rows[0]?.status === 'published'
    const isNowPublished = status === 'published'
    
    const result = await client.query(
      `UPDATE cms_page SET 
        slug = COALESCE($2, slug),
        title = COALESCE($3, title),
        meta_description = COALESCE($4, meta_description),
        meta_keywords = COALESCE($5, meta_keywords),
        content = COALESCE($6, content),
        template = COALESCE($7, template),
        status = COALESCE($8, status),
        locale = COALESCE($9, locale),
        seo_title = COALESCE($10, seo_title),
        seo_image = COALESCE($11, seo_image),
        metadata = COALESCE($12, metadata),
        published_at = CASE WHEN $8 = 'published' AND status != 'published' THEN NOW() ELSE published_at END,
        updated_at = NOW()
       WHERE id = $1 OR slug = $1
       RETURNING *`,
      [
        id,
        slug,
        title,
        meta_description,
        meta_keywords,
        content ? JSON.stringify(content) : null,
        template,
        status,
        locale,
        seo_title,
        seo_image,
        metadata ? JSON.stringify(metadata) : null
      ]
    )
    
    client.release()
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Page not found" })
    }
    
    res.json({ page: result.rows[0] })
  } catch (error) {
    console.error('CMS Page Update Error:', error)
    res.status(500).json({ error: 'Failed to update page' })
  }
}

// DELETE /admin/cms/pages/:id - Usuń stronę
export const DELETE = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const { id } = req.params
    const client = await getDbConnection()
    
    const result = await client.query(
      `DELETE FROM cms_page WHERE id = $1 OR slug = $1 RETURNING id`,
      [id]
    )
    
    client.release()
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Page not found" })
    }
    
    res.json({ success: true, id: result.rows[0].id })
  } catch (error) {
    console.error('CMS Page Delete Error:', error)
    res.status(500).json({ error: 'Failed to delete page' })
  }
}
