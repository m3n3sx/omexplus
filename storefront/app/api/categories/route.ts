import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'medusa-my-medusa-store',
  user: 'postgres',
  password: 'supersecret',
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '8')
  
  try {
    const query = `
      SELECT 
        id,
        name,
        description,
        handle,
        parent_category_id
      FROM product_category
      WHERE deleted_at IS NULL
        AND is_active = true
      ORDER BY rank ASC, name ASC
      LIMIT $1
    `
    
    const result = await pool.query(query, [limit])
    
    return NextResponse.json({
      categories: result.rows,
      count: result.rows.length
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}
