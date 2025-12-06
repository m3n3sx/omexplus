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
        p.id,
        p.title,
        p.description,
        p.handle,
        p.thumbnail,
        json_agg(
          json_build_object(
            'id', pv.id,
            'title', pv.title,
            'sku', pv.sku,
            'prices', (
              SELECT json_agg(
                json_build_object(
                  'amount', pr.amount,
                  'currency_code', pr.currency_code
                )
              )
              FROM product_variant_price_set pvps2
              JOIN price pr ON pvps2.price_set_id = pr.price_set_id
              WHERE pvps2.variant_id = pv.id
                AND pr.currency_code IN ('eur', 'pln')
            )
          )
        ) FILTER (WHERE pv.id IS NOT NULL) as variants
      FROM product p
      LEFT JOIN product_variant pv ON p.id = pv.product_id AND pv.deleted_at IS NULL
      WHERE p.deleted_at IS NULL
      GROUP BY p.id, p.title, p.description, p.handle, p.thumbnail
      HAVING COUNT(pv.id) > 0
      ORDER BY p.created_at DESC
      LIMIT $1
    `
    
    const result = await pool.query(query, [limit])
    
    return NextResponse.json({
      products: result.rows,
      count: result.rows.length
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
