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
        description,
        handle,
        parent_category_id,
        rank,
        is_active
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
    
    // Get all subcategories recursively (all levels)
    const getAllSubcategories = async (parentId: string): Promise<any[]> => {
      const query = `
        SELECT 
          pc.id,
          pc.name,
          pc.description,
          pc.handle,
          pc.parent_category_id,
          pc.rank,
          COUNT(DISTINCT pcp.product_id) as product_count
        FROM product_category pc
        LEFT JOIN product_category_product pcp ON pc.id = pcp.product_category_id
        WHERE pc.parent_category_id = $1
          AND pc.deleted_at IS NULL
          AND pc.is_active = true
        GROUP BY pc.id, pc.name, pc.description, pc.handle, pc.parent_category_id, pc.rank
        ORDER BY pc.rank ASC, pc.name ASC
      `
      
      const result = await pool.query(query, [parentId])
      const categories = result.rows
      
      // Recursively get subcategories for each category
      for (const cat of categories) {
        const children = await getAllSubcategories(cat.id)
        if (children.length > 0) {
          cat.subcategories = children
        }
      }
      
      return categories
    }
    
    const allSubcategories = await getAllSubcategories(category.id)
    
    // Flatten all subcategories for easy access
    const flattenSubcategories = (cats: any[]): any[] => {
      let result: any[] = []
      for (const cat of cats) {
        result.push(cat)
        if (cat.subcategories) {
          result = result.concat(flattenSubcategories(cat.subcategories))
        }
      }
      return result
    }
    
    const flatSubcategories = flattenSubcategories(allSubcategories)
    
    // Get breadcrumb path
    const breadcrumb = []
    let currentId = category.parent_category_id
    
    while (currentId) {
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
    
    // Get product count for this category
    const productCountQuery = `
      SELECT COUNT(*) as count
      FROM product_category_product
      WHERE product_category_id = $1
    `
    const productCountResult = await pool.query(productCountQuery, [category.id])
    const productCount = parseInt(productCountResult.rows[0]?.count || '0')
    
    // Find root category (top-level parent) for sidebar navigation
    let rootCategoryId = category.id
    let rootCategory = category
    
    if (category.parent_category_id) {
      // Walk up the tree to find root
      let currentParentId = category.parent_category_id
      while (currentParentId) {
        const parentQuery = `
          SELECT id, name, handle, description, parent_category_id, rank
          FROM product_category
          WHERE id = $1 AND deleted_at IS NULL AND is_active = true
        `
        const parentResult = await pool.query(parentQuery, [currentParentId])
        if (parentResult.rows.length > 0) {
          rootCategory = parentResult.rows[0]
          rootCategoryId = rootCategory.id
          currentParentId = rootCategory.parent_category_id
        } else {
          break
        }
      }
    }
    
    // Get all subcategories from root category for complete sidebar
    const rootSubcategories = await getAllSubcategories(rootCategoryId)
    const flatRootSubcategories = flattenSubcategories(rootSubcategories)
    
    return NextResponse.json({
      category: {
        id: category.id,
        name: category.name,
        slug: category.handle,
        description: category.description || '',
        priority: category.rank || 0,
        productCount,
        parent_category_id: category.parent_category_id
      },
      // Root category info for sidebar
      rootCategory: {
        id: rootCategory.id,
        name: rootCategory.name,
        slug: rootCategory.handle,
        description: rootCategory.description || '',
        priority: rootCategory.rank || 0
      },
      subcategories: allSubcategories,
      allSubcategories: flatSubcategories.map((sub: any) => ({
        id: sub.id,
        name: sub.name,
        slug: sub.handle,
        description: sub.description || '',
        priority: sub.rank || 0,
        parent_category_id: sub.parent_category_id,
        product_count: parseInt(sub.product_count || '0')
      })),
      // All subcategories from root for complete sidebar navigation
      rootSubcategories: flatRootSubcategories.map((sub: any) => ({
        id: sub.id,
        name: sub.name,
        slug: sub.handle,
        description: sub.description || '',
        priority: sub.rank || 0,
        parent_category_id: sub.parent_category_id,
        product_count: parseInt(sub.product_count || '0')
      })),
      breadcrumb,
      subcategoryCount: flatSubcategories.length
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    )
  }
}
