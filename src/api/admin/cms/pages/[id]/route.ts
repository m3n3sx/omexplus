import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Client } from "pg"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const { id } = req.params
  
  try {
    const { Client } = require('pg')
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
      WHERE id = $1
    `, [id])
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
    console.error("Error fetching CMS page:", error)
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
  const { id } = req.params
  const data = req.body
  
  try {
    const { Client } = require('pg')
    const client = new Client({
      connectionString: process.env.DATABASE_URL
    })
    
    await client.connect()
    
    // Check if page exists
    const checkResult = await client.query('SELECT id FROM cms_page WHERE id = $1', [id])
    if (checkResult.rows.length === 0) {
      await client.end()
      res.status(404).json({ message: "Page not found" })
      return
    }
    
    // Build update query
    const updates = []
    const values = []
    let paramIndex = 1
    
    if (data.slug) {
      updates.push(`slug = $${paramIndex++}`)
      values.push(data.slug)
    }
    if (data.title) {
      updates.push(`title = $${paramIndex++}`)
      values.push(data.title)
    }
    if (data.content !== undefined) {
      updates.push(`content = $${paramIndex++}::jsonb`)
      values.push(JSON.stringify(data.content))
    }
    if (data.is_published !== undefined) {
      updates.push(`status = $${paramIndex++}`)
      values.push(data.is_published ? 'published' : 'draft')
      updates.push(`published_at = $${paramIndex++}`)
      values.push(data.is_published ? new Date() : null)
    }
    if (data.locale) {
      updates.push(`locale = $${paramIndex++}`)
      values.push(data.locale)
    }
    if (data.description !== undefined) {
      updates.push(`meta_description = $${paramIndex++}`)
      values.push(data.description)
    }
    
    updates.push(`updated_at = NOW()`)
    values.push(id)
    
    await client.query(
      `UPDATE cms_page SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
      values
    )
    
    // Fetch updated page
    const result = await client.query('SELECT * FROM cms_page WHERE id = $1', [id])
    await client.end()
    
    const page = {
      ...result.rows[0],
      is_published: result.rows[0].status === 'published'
    }
    
    res.json({ page, message: "Page updated successfully" })
  } catch (error: any) {
    console.error("Error updating page:", error)
    res.status(500).json({ 
      message: "Internal server error", 
      error: error?.message || String(error) 
    })
  }
}

export async function DELETE(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const { id } = req.params
  
  try {
    const client = new Client({
      connectionString: process.env.DATABASE_URL
    })
    
    await client.connect()
    await client.query('DELETE FROM cms_page WHERE id = $1', [id])
    await client.end()
    
    res.json({ message: "Page deleted successfully" })
  } catch (error: any) {
    console.error("Error deleting page:", error)
    res.status(500).json({ 
      message: "Internal server error", 
      error: error?.message || String(error) 
    })
  }
}
