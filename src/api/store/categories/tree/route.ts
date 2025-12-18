import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { OMEX_CATEGORY_MODULE } from "../../../../modules/omex-category"

/**
 * GET /api/categories/tree
 * Returns the complete category hierarchy as a nested tree structure
 * 
 * Requirements: 5.4
 * Property 17: API Tree Endpoint Returns Nested Structure
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const categoryService = req.scope.resolve(OMEX_CATEGORY_MODULE)

  try {
    // Get complete category tree
    const tree = await categoryService.getCategoryTree()

    // Validate tree structure - ensure no missing relationships
    const isValid = validateTreeStructure(tree)
    if (!isValid) {
      return res.status(500).json({
        error: {
          code: "INVALID_TREE_STRUCTURE",
          message: "Category tree structure is invalid - missing relationships detected",
        },
      })
    }

    // Set caching headers
    res.setHeader("Cache-Control", "public, max-age=3600") // 1 hour cache
    res.setHeader("ETag", `"category-tree-${Date.now()}"`)

    // Return tree structure
    res.json({
      tree: tree,
      count: countTreeNodes(tree),
    })
  } catch (error: any) {
    console.error("Error fetching category tree:", error)

    res.status(500).json({
      error: {
        code: "TREE_FETCH_ERROR",
        message: error.message || "Failed to fetch category tree",
      },
    })
  }
}

/**
 * Validate tree structure to ensure no missing relationships
 * Checks that all parent-child relationships are properly established
 */
function validateTreeStructure(tree: any[]): boolean {
  if (!Array.isArray(tree)) {
    return false
  }

  for (const node of tree) {
    // Check required fields
    if (!node.id || !node.name || !node.slug) {
      return false
    }

    // Recursively validate children if present
    if (node.children) {
      if (!Array.isArray(node.children)) {
        return false
      }

      if (!validateTreeStructure(node.children)) {
        return false
      }
    }
  }

  return true
}

/**
 * Count total nodes in tree structure
 */
function countTreeNodes(tree: any[]): number {
  let count = 0

  for (const node of tree) {
    count += 1

    if (node.children && Array.isArray(node.children)) {
      count += countTreeNodes(node.children)
    }
  }

  return count
}
