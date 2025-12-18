import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

/**
 * GET /store/featured-products
 * 
 * Fetches featured products for display in the mega menu.
 * Products are marked as featured via metadata.isFeatured = true
 * and sorted by metadata.priority (higher first), then by created_at (newest first).
 * 
 * Query Parameters:
 * - limit: number (default: 6) - Maximum number of products to return
 * - locale: string (default: 'pl') - Locale for translations (future use)
 * 
 * Response:
 * {
 *   products: Array<{
 *     id: string,
 *     name: string,
 *     slug: string,
 *     category: string,
 *     description: string
 *   }>,
 *   count: number
 * }
 * 
 * Requirements: 3.1
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { limit = 6 } = req.query

  try {
    const query = req.scope.resolve("query")
    const limitNum = parseInt(limit as string)
    
    // Fetch products from database using same pattern as categories-direct
    const result = await query.graph({
      entity: "product",
      fields: [
        "id",
        "title",
        "handle",
        "description",
        "thumbnail",
        "metadata",
        "created_at",
        "status"
      ],
      filters: {
        status: ["published"],
        deleted_at: null
      }
    })

    const products = result.data || []
    
    // Filter for featured products (metadata.isFeatured or metadata.is_featured)
    const featuredProducts = products.filter((product: any) => {
      const metadata = product.metadata || {}
      return metadata.isFeatured === true || 
             metadata.is_featured === true ||
             metadata.featured === true
    })

    // Sort by priority (higher first), then by created_at (newest first)
    featuredProducts.sort((a: any, b: any) => {
      const aPriority = Number(a.metadata?.priority || a.metadata?.featured_priority || 0)
      const bPriority = Number(b.metadata?.priority || b.metadata?.featured_priority || 0)
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority
      }
      
      const aDate = new Date(a.created_at || 0).getTime()
      const bDate = new Date(b.created_at || 0).getTime()
      return bDate - aDate
    })

    // Limit results
    const limitedProducts = featuredProducts.slice(0, limitNum)

    // Format response
    const formattedProducts = limitedProducts.map((product: any) => ({
      id: product.id,
      name: product.title,
      slug: product.handle,
      category: product.metadata?.category || product.metadata?.machine_type || "",
      description: product.description || "",
      thumbnail: product.thumbnail || ""
    }))

    res.setHeader("Cache-Control", "public, max-age=1800")
    res.json({
      products: formattedProducts,
      count: formattedProducts.length,
    })
  } catch (error: any) {
    console.error("Error fetching featured products:", error)
    res.status(500).json({
      error: {
        code: "FEATURED_PRODUCTS_ERROR",
        message: error.message
      }
    })
  }
}
