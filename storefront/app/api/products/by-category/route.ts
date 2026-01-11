import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'medusa_db',
  user: 'medusa_user',
  password: 'medusa_password',
})

// Helper function to get all subcategory IDs recursively
async function getAllSubcategoryIds(categoryId: string): Promise<string[]> {
  const result: string[] = [categoryId]
  
  const query = `
    SELECT id FROM product_category 
    WHERE parent_category_id = $1 
      AND deleted_at IS NULL 
      AND is_active = true
  `
  const children = await pool.query(query, [categoryId])
  
  for (const child of children.rows) {
    const childIds = await getAllSubcategoryIds(child.id)
    result.push(...childIds)
  }
  
  return result
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = parseInt(searchParams.get('offset') || '0')
  const sortBy = searchParams.get('sort') || 'popular' // Default to popular for better conversion
  const search = searchParams.get('search') || ''
  const includeSubcategories = searchParams.get('include_subcategories') !== 'false' // Default true
  
  // Support both single category_id and multiple category_id[] parameters
  let categoryIds = searchParams.getAll('category_id').filter(Boolean)
  
  if (categoryIds.length === 0) {
    return NextResponse.json(
      { error: 'At least one category_id is required' },
      { status: 400 }
    )
  }

  try {
    // If includeSubcategories is true, expand category IDs to include all subcategories
    if (includeSubcategories) {
      const expandedIds = new Set<string>()
      for (const catId of categoryIds) {
        const allIds = await getAllSubcategoryIds(catId)
        allIds.forEach(id => expandedIds.add(id))
      }
      categoryIds = Array.from(expandedIds)
    }
    
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
    
    // Build ORDER BY clause - default to popularity for better conversion
    let orderBy = 'COALESCE((p.metadata->>\'sales_count\')::int, 0) DESC, p.created_at DESC'
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
      case 'popular':
      case 'best-selling':
        orderBy = 'COALESCE((p.metadata->>\'sales_count\')::int, 0) DESC, p.created_at DESC'
        break
      case 'price-asc':
        orderBy = 'min_price ASC NULLS LAST'
        break
      case 'price-desc':
        orderBy = 'min_price DESC NULLS LAST'
        break
    }
    
    const whereClause = additionalConditions.length > 0 
      ? `AND ${additionalConditions.join(' AND ')}`
      : ''
    
    // Get products for these categories with price info
    const query = `
      WITH product_prices AS (
        SELECT 
          pv.product_id,
          MIN(pp.amount) as min_price
        FROM product_variant pv
        LEFT JOIN product_variant_price_set pvps ON pv.id = pvps.variant_id
        LEFT JOIN price_set ps ON pvps.price_set_id = ps.id
        LEFT JOIN price pp ON ps.id = pp.price_set_id
        WHERE pv.deleted_at IS NULL
        GROUP BY pv.product_id
      )
      SELECT 
        p.id,
        p.title,
        p.description,
        p.handle,
        p.thumbnail,
        p.status,
        p.created_at,
        p.metadata,
        pv.id as variant_id,
        pv.title as variant_title,
        pv.sku,
        COALESCE(ppr.min_price, 0) as min_price
      FROM product p
      INNER JOIN product_category_product pcp ON p.id = pcp.product_id
      LEFT JOIN product_variant pv ON p.id = pv.product_id AND pv.deleted_at IS NULL
      LEFT JOIN product_prices ppr ON p.id = ppr.product_id
      WHERE pcp.product_category_id IN (${categoryPlaceholders})
        AND p.deleted_at IS NULL
        AND p.status = 'published'
        ${whereClause}
      ORDER BY ${orderBy}
    `
    
    const result = await pool.query(query, [...categoryIds, ...additionalParams])
    
    // Group products by id and apply pagination after grouping
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
          metadata: row.metadata,
          min_price: row.min_price,
          variants: []
        })
      }
      
      const product = productsMap.get(row.id)
      
      // Only add variant if it exists and not already added
      if (row.variant_id && !product.variants.find((v: any) => v.id === row.variant_id)) {
        product.variants.push({
          id: row.variant_id,
          title: row.variant_title,
          sku: row.sku,
          inventory_quantity: 10,
          prices: [
            {
              amount: row.min_price || 50000,
              currency_code: 'pln'
            }
          ]
        })
      }
    }
    
    // Convert to array and ensure default variant exists
    let products = Array.from(productsMap.values()).map(product => {
      if (product.variants.length === 0) {
        product.variants.push({
          id: `${product.id}_default`,
          title: 'Standard',
          sku: product.id,
          inventory_quantity: 10,
          prices: [
            {
              amount: product.min_price || 50000,
              currency_code: 'pln'
            }
          ]
        })
      }
      return product
    })
    
    const totalCount = products.length
    
    // Apply pagination
    products = products.slice(offset, offset + limit)
    
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
