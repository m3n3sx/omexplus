import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa"
import { Client } from "pg"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const client = new Client({
      connectionString: process.env.DATABASE_URL
    })
    
    await client.connect()
    const result = await client.query(`
      SELECT 
        id, slug, title, meta_description, content, 
        template, status, locale, published_at, 
        created_at, updated_at
      FROM cms_page
      ORDER BY updated_at DESC
    `)
    await client.end()
    
    // Add is_published flag (content is already parsed by pg)
    const parsedPages = result.rows.map(page => ({
      ...page,
      is_published: page.status === 'published'
    }))
    
    res.json({ pages: parsedPages })
  } catch (error: any) {
    console.error("Error fetching pages:", error)
    res.status(500).json({ 
      message: "Internal server error", 
      error: error?.message || String(error) 
    })
  }
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const data = req.body
  
  try {
    const pageData = {
      id: `page_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      slug: data.slug || data.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      title: data.title,
      content: data.content || {},
      status: data.is_published ? "published" : "draft",
      locale: data.locale || "pl",
      meta_description: data.description || null,
      published_at: data.is_published ? new Date() : null,
      template: "default",
    }
    
    const client = new Client({
      connectionString: process.env.DATABASE_URL
    })
    
    await client.connect()
    await client.query(`
      INSERT INTO cms_page (
        id, slug, title, meta_description, content, 
        template, status, locale, published_at, 
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7, $8, $9, NOW(), NOW())
    `, [
      pageData.id,
      pageData.slug,
      pageData.title,
      pageData.meta_description,
      JSON.stringify(pageData.content),
      pageData.template,
      pageData.status,
      pageData.locale,
      pageData.published_at
    ])
    await client.end()
    
    res.json({ page: pageData, message: "Page created successfully" })
  } catch (error: any) {
    console.error("Error creating page:", error)
    res.status(500).json({ 
      message: "Internal server error", 
      error: error?.message || String(error) 
    })
  }
}
