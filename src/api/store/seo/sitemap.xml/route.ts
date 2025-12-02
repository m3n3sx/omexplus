import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import SEOService from "../../../../modules/omex-seo/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const seoService = req.scope.resolve("seoService") as SEOService

  try {
    const sitemap = await seoService.generateSitemap({
      includeCategories: true,
      includeManufacturers: true,
    })

    res.setHeader("Content-Type", "application/xml")
    return res.send(sitemap)
  } catch (error) {
    console.error("Sitemap generation error:", error)
    return res.status(500).json({
      error: "Failed to generate sitemap",
      message: error.message,
    })
  }
}
