import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const query = req.scope.resolve("query")
  
  try {
    const { data: pages } = await query.graph({
      entity: "cms_page",
      fields: ["*"]
    })
    
    res.json({ pages: pages || [] })
  } catch (error) {
    console.error("Error fetching CMS pages:", error)
    res.json({ pages: [] })
  }
}
