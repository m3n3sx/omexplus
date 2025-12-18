import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const { position } = req.query
  const query = req.scope.resolve("query")
  
  try {
    const filters: any = { is_active: true }
    
    if (position) {
      filters.position = position
    }
    
    const { data: banners } = await query.graph({
      entity: "banner",
      fields: ["*"],
      filters
    })
    
    const sortedBanners = (banners || []).sort((a, b) => a.priority - b.priority)
    
    res.json({ banners: sortedBanners })
  } catch (error) {
    console.error("Error fetching banners:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}
