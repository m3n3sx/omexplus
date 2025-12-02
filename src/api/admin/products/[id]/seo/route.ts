import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

/**
 * POST /admin/products/:id/seo
 * Set SEO fields for a product
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const seoData = req.body

  if (!id) {
    return res.status(400).json({
      error: "Product ID is required",
    })
  }

  try {
    const seoService = req.scope.resolve("omexSeo")

    const result = await seoService.updateProductSEO(id, seoData)

    return res.json(result)
  } catch (error: any) {
    return res.status(500).json({
      error: error.message || "Failed to update SEO",
    })
  }
}

/**
 * PUT /admin/products/:id/seo
 * Update SEO fields for a product
 */
export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const seoData = req.body

  if (!id) {
    return res.status(400).json({
      error: "Product ID is required",
    })
  }

  try {
    const seoService = req.scope.resolve("omexSeo")

    const result = await seoService.updateProductSEO(id, seoData)

    return res.json(result)
  } catch (error: any) {
    return res.status(500).json({
      error: error.message || "Failed to update SEO",
    })
  }
}

/**
 * GET /admin/products/:id/seo
 * Get SEO fields for a product
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params

  if (!id) {
    return res.status(400).json({
      error: "Product ID is required",
    })
  }

  try {
    // In real implementation, fetch product with SEO fields
    return res.json({
      product_id: id,
      seo: {},
    })
  } catch (error: any) {
    return res.status(500).json({
      error: error.message || "Failed to get SEO",
    })
  }
}
