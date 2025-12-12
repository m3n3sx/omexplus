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
        handle
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
    
    // Get subcategories
    const subcategoriesQuery = `
      SELECT 
        pc.id,
        pc.name,
        pc.handle as slug,
        pc.description,
        pc.rank as priority,
        COUNT(pcp.product_id) as product_count,
        COUNT(DISTINCT sub.id) as subcategory_count
      FROM product_category pc
      LEFT JOIN product_category_product pcp ON pc.id = pcp.product_category_id
      LEFT JOIN product_category sub ON sub.parent_category_id = pc.id AND sub.deleted_at IS NULL
      WHERE pc.parent_category_id = $1
        AND pc.deleted_at IS NULL
        AND pc.is_active = true
      GROUP BY pc.id, pc.name, pc.handle, pc.description, pc.rank
      ORDER BY pc.rank ASC, pc.name ASC
    `
    
    const subcategoriesResult = await pool.query(subcategoriesQuery, [category.id])
    
    const subcategories = subcategoriesResult.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description || '',
      priority: row.priority || 0,
      productCount: parseInt(row.product_count || '0'),
      subcategoryCount: parseInt(row.subcategory_count || '0')
    }))
    
    return NextResponse.json({
      subcategories,
      count: subcategories.length
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subcategories' },
      { status: 500 }
    )
  }
}
