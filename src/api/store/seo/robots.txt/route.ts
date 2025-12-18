import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import SEOService from "../../../../modules/omex-seo/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const seoService = req.scope.resolve("seoService") as SEOService

  try {
    const robotsTxt = seoService.generateRobotsTxt()

    res.setHeader("Content-Type", "text/plain")
    return res.send(robotsTxt)
  } catch (error) {
    console.error("Robots.txt generation error:", error)
    return res.status(500).json({
      error: "Failed to generate robots.txt",
      message: error.message,
    })
  }
}
