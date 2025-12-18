import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const { id } = req.params
  const data = req.body
  const bannerService = req.scope.resolve("banner")
  
  try {
    const updatedBanner = await bannerService.update(id, {
      title: data.title,
      image_url: data.image_url,
      link_url: data.link_url,
      position: data.position,
      is_active: data.is_active,
      priority: data.priority,
    })
    
    res.json({ banner: updatedBanner, message: "Banner updated successfully" })
  } catch (error) {
    console.error("Error updating banner:", error)
    res.status(500).json({ message: "Internal server error", error: error.message })
  }
}

export async function DELETE(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const { id } = req.params
  const bannerService = req.scope.resolve("banner")
  
  try {
    await bannerService.delete(id)
    res.json({ message: "Banner deleted successfully" })
  } catch (error) {
    console.error("Error deleting banner:", error)
    res.status(500).json({ message: "Internal server error", error: error.message })
  }
}
