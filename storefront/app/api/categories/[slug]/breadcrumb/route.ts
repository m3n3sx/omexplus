import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'medusa_db',
  user: 'medusa_user',
  password: 'medusa_password',
})

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params

  try {
    // Get category by slug
    const categoryQuery = `
      SELECT 
        id,
        name,
        handle,
        parent_category_id
      FROM product_category
      WHERE handle = $1
        AND deleted_at IS NULL
        AND is_active = true
    `
    
    const categoryResult = await pool.query(categoryQuery, [slug])
    
    if (categoryResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }
    
    const category = categoryResult.rows[0]
    
    // Build breadcrumb path by traversing up the tree
    const breadcrumb = []
    let currentId = category.parent_category_id
    
    // Traverse up to root (max 10 levels to prevent infinite loop)
    for (let i = 0; i < 10; i++) {
      if (!currentId) break
      
      const parentQuery = `
        SELECT id, name, handle, parent_category_id
        FROM product_category
        WHERE id = $1 AND deleted_at IS NULL
      `
      const parentResult = await pool.query(parentQuery, [currentId])
      
      if (parentResult.rows.length > 0) {
        breadcrumb.unshift({
          id: parentResult.rows[0].id,
          name: parentResult.rows[0].name,
          slug: parentResult.rows[0].handle
        })
        currentId = parentResult.rows[0].parent_category_id
      } else {
        break
      }
    }
    
    // Add current category to breadcrumb
    breadcrumb.push({
      id: category.id,
      name: category.name,
      slug: category.handle
    })
    
    return NextResponse.json({
      breadcrumb
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch breadcrumb' },
      { status: 500 }
    )
  }
}
