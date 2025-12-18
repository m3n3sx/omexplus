import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const query = req.scope.resolve("query")
  
  try {
    const { data: banners } = await query.graph({
      entity: "banner",
      fields: ["*"]
    })
    
    res.json({ banners: banners || [] })
  } catch (error) {
    console.error("Error fetching banners:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const data = req.body
  const bannerService = req.scope.resolve("banner")
  
  try {
    const newBanner = await bannerService.create({
      title: data.title,
      image_url: data.image_url,
      link_url: data.link_url,
      position: data.position || "home-hero",
      is_active: data.is_active ?? true,
      priority: data.priority || 0,
    })
    
    res.json({ banner: newBanner, message: "Banner created successfully" })
  } catch (error) {
    console.error("Error creating banner:", error)
    res.status(500).json({ message: "Internal server error", error: error.message })
  }
}
