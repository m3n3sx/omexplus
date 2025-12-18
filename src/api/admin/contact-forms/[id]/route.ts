import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// PATCH - Aktualizuj status zgłoszenia
export const PATCH = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params
  const { status } = req.body

  const chatModule = req.scope.resolve("chat")
  
  const contactForm = await chatModule.updateContactForms(id, { status })

  res.json({ contact_form: contactForm })
}
