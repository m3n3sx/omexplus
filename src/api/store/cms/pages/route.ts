import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const { slug } = req.query
  const query = req.scope.resolve("query")
  
  try {
    if (slug) {
      const { data: pages } = await query.graph({
        entity: "cms_page",
        fields: ["*"],
        filters: { slug: slug as string, status: "published" }
      })
      
      if (!pages || pages.length === 0) {
        res.status(404).json({ message: "Page not found" })
        return
      }
      
      res.json({ page: pages[0] })
    } else {
      const { data: pages } = await query.graph({
        entity: "cms_page",
        fields: ["*"],
        filters: { status: "published" }
      })
      
      res.json({ pages: pages || [] })
    }
  } catch (error) {
    console.error("Error fetching pages:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}
