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
  const offset = parseInt(searchParams.get('offset') || '0')
  
  try {
    // Get total count of products with variants
    const countQuery = `
      SELECT COUNT(DISTINCT p.id) as total
      FROM product p
      INNER JOIN product_variant pv ON p.id = pv.product_id AND pv.deleted_at IS NULL
      WHERE p.deleted_at IS NULL
    `
    const countResult = await pool.query(countQuery)
    const totalCount = parseInt(countResult.rows[0]?.total || '0')
    
    // Get products with variants, prices, and categories
    const query = `
      SELECT 
        p.id,
        p.title,
        p.description,
        p.handle,
        p.thumbnail,
        p.created_at,
        (
          SELECT json_agg(
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
                  AND pr.deleted_at IS NULL
              )
            )
          )
          FROM product_variant pv
          WHERE pv.product_id = p.id AND pv.deleted_at IS NULL
        ) as variants,
        (
          SELECT json_agg(
            json_build_object(
              'id', pc.id,
              'name', pc.name,
              'handle', pc.handle
            )
          )
          FROM product_category pc
          JOIN product_category_product pcp ON pc.id = pcp.product_category_id
          WHERE pcp.product_id = p.id AND pc.deleted_at IS NULL
        ) as categories
      FROM product p
      WHERE p.deleted_at IS NULL
        AND EXISTS (
          SELECT 1 FROM product_variant pv 
          WHERE pv.product_id = p.id AND pv.deleted_at IS NULL
        )
      ORDER BY p.created_at DESC
      LIMIT $1 OFFSET $2
    `
    
    const result = await pool.query(query, [limit, offset])
    
    return NextResponse.json({
      products: result.rows,
      count: totalCount,
      limit,
      offset
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
