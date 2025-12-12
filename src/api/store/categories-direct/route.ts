import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

/**
 * GET /store/categories-direct
 * Direct database query for categories - bypasses service layer
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const query = req.scope.resolve("query")
    
    // Get all categories from database
    const result = await query.graph({
      entity: "product_category",
      fields: ["id", "name", "handle", "description", "rank", "parent_category_id", "is_active"],
      filters: { deleted_at: null }
    })
    
    const categories = result.data.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.handle,
      description: cat.description || "",
      parent_id: cat.parent_category_id,
      priority: cat.rank || 0,
      is_active: cat.is_active !== false
    }))
    
    // Build tree structure
    const tree = buildTree(categories, null)
    
    res.json({
      tree,
      count: categories.length,
      main_categories: tree.length
    })
  } catch (error: any) {
    console.error("Error fetching categories:", error)
    res.status(500).json({
      error: {
        code: "FETCH_ERROR",
        message: error.message
      }
    })
  }
}

function buildTree(categories: any[], parentId: string | null): any[] {
  const tree: any[] = []
  
  for (const cat of categories) {
    if (cat.parent_id === parentId) {
      const children = buildTree(categories, cat.id)
      tree.push({
        ...cat,
        children: children.length > 0 ? children : undefined
      })
    }
  }
  
  // Sort by priority
  tree.sort((a, b) => (a.priority || 0) - (b.priority || 0))
  
  return tree
}
