import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'medusa_db',
  user: 'medusa_user',
  password: 'medusa_password',
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '8')
  const mainOnly = searchParams.get('main') === 'true'
  
  try {
    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM product_category
      WHERE deleted_at IS NULL
        AND is_active = true
        ${mainOnly ? 'AND parent_category_id IS NULL' : ''}
    `
    const countResult = await pool.query(countQuery)
    const totalCount = parseInt(countResult.rows[0]?.total || '0')
    
    // Get categories with product count
    const query = `
      SELECT 
        pc.id,
        pc.name,
        pc.description,
        pc.handle,
        pc.parent_category_id,
        COUNT(DISTINCT pcp.product_id) as product_count
      FROM product_category pc
      LEFT JOIN product_category_product pcp ON pc.id = pcp.product_category_id
      WHERE pc.deleted_at IS NULL
        AND pc.is_active = true
        ${mainOnly ? 'AND pc.parent_category_id IS NULL' : ''}
      GROUP BY pc.id, pc.name, pc.description, pc.handle, pc.parent_category_id, pc.rank
      ORDER BY pc.rank ASC, pc.name ASC
      LIMIT $1
    `
    
    const result = await pool.query(query, [limit])
    
    return NextResponse.json({
      categories: result.rows,
      count: totalCount
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}
