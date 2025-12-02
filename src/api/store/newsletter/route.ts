import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { email } = req.body
  
  // Subskrypcja newslettera
  console.log(`Newsletter subscription: ${email}`)
  
  res.json({ 
    success: true,
    message: "Dziękujemy za subskrypcję!" 
  })
}
