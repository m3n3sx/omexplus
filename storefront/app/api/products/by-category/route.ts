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
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = parseInt(searchParams.get('offset') || '0')
  const sortBy = searchParams.get('sort') || 'newest'
  const search = searchParams.get('search') || ''
  
  // Support both single category_id and multiple category_id[] parameters
  const categoryIds = searchParams.getAll('category_id').filter(Boolean)
  
  if (categoryIds.length === 0) {
    return NextResponse.json(
      { error: 'At least one category_id is required' },
      { status: 400 }
    )
  }

  try {
    // Build WHERE clause for multiple categories
    const categoryPlaceholders = categoryIds.map((_, i) => `$${i + 1}`).join(', ')
    let paramIndex = categoryIds.length + 1
    
    // Build additional WHERE conditions
    const additionalConditions: string[] = []
    const additionalParams: any[] = []
    
    // Search filter
    if (search) {
      additionalConditions.push(`(p.title ILIKE $${paramIndex} OR pv.sku ILIKE $${paramIndex})`)
      additionalParams.push(`%${search}%`)
      paramIndex++
    }
    
    // Build ORDER BY clause
    let orderBy = 'p.created_at DESC'
    switch (sortBy) {
      case 'name-asc':
        orderBy = 'p.title ASC'
        break
      case 'name-desc':
        orderBy = 'p.title DESC'
        break
      case 'newest':
        orderBy = 'p.created_at DESC'
        break
      case 'oldest':
        orderBy = 'p.created_at ASC'
        break
    }
    
    const whereClause = additionalConditions.length > 0 
      ? `AND ${additionalConditions.join(' AND ')}`
      : ''
    
    // Get products for these categories
    const query = `
      SELECT DISTINCT ON (p.id)
        p.id,
        p.title,
        p.description,
        p.handle,
        p.thumbnail,
        p.status,
        p.created_at,
        pv.id as variant_id,
        pv.title as variant_title,
        pv.sku
      FROM product p
      INNER JOIN product_category_product pcp ON p.id = pcp.product_id
      LEFT JOIN product_variant pv ON p.id = pv.product_id AND pv.deleted_at IS NULL
      WHERE pcp.product_category_id IN (${categoryPlaceholders})
        AND p.deleted_at IS NULL
        AND p.status = 'published'
        ${whereClause}
      ORDER BY p.id, ${orderBy}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `
    
    const result = await pool.query(query, [...categoryIds, ...additionalParams, limit, offset])
    
    // Get count
    const countQuery = `
      SELECT COUNT(DISTINCT p.id) as total
      FROM product p
      INNER JOIN product_category_product pcp ON p.id = pcp.product_id
      LEFT JOIN product_variant pv ON p.id = pv.product_id AND pv.deleted_at IS NULL
      WHERE pcp.product_category_id IN (${categoryPlaceholders})
        AND p.deleted_at IS NULL
        AND p.status = 'published'
        ${whereClause}
    `
    
    const countResult = await pool.query(countQuery, [...categoryIds, ...additionalParams])
    const totalCount = parseInt(countResult.rows[0]?.total || '0')
    
    // Group products by id (since we joined with variants)
    const productsMap = new Map()
    
    for (const row of result.rows) {
      if (!productsMap.has(row.id)) {
        productsMap.set(row.id, {
          id: row.id,
          title: row.title,
          description: row.description,
          handle: row.handle,
          thumbnail: row.thumbnail,
          status: row.status,
          created_at: row.created_at,
          variants: []
        })
      }
      
      const product = productsMap.get(row.id)
      
      // Only add variant if it exists
      if (row.variant_id) {
        product.variants.push({
          id: row.variant_id,
          title: row.variant_title,
          sku: row.sku,
          inventory_quantity: 10,
          prices: [
            {
              amount: 50000,
              currency_code: 'pln'
            }
          ]
        })
      } else {
        // Create a default variant if none exists
        if (product.variants.length === 0) {
          product.variants.push({
            id: `${row.id}_default`,
            title: 'Standard',
            sku: row.id,
            inventory_quantity: 10,
            prices: [
              {
                amount: 50000,
                currency_code: 'pln'
              }
            ]
          })
        }
      }
    }
    
    const products = Array.from(productsMap.values())
    
    return NextResponse.json({
      products,
      count: totalCount,
      limit,
      offset
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
