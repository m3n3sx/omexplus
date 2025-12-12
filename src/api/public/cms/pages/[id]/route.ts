import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const { id } = req.params
  const query = req.scope.resolve("query")
  
  try {
    const { data: pages } = await query.graph({
      entity: "cms_page",
      fields: ["*"],
      filters: { id }
    })
    
    if (!pages || pages.length === 0) {
      res.status(404).json({ message: "Page not found" })
      return
    }
    
    res.json({ page: pages[0] })
  } catch (error) {
    console.error("Error fetching CMS page:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}
