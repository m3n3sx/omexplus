import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// GET - Lista zgłoszeń kontaktowych
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { status } = req.query
  
  const chatModule = req.scope.resolve("chat")
  
  const filters: any = {}
  if (status) {
    filters.status = status
  }
  
  const contactForms = await chatModule.listContactForms(filters)

  res.json({ contact_forms: contactForms })
}
