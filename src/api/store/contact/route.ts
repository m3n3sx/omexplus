import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { name, email, subject, message } = req.body
  
  // Obsługa formularza kontaktowego
  console.log(`Contact form: ${name} - ${email}`)
  
  res.json({ 
    success: true,
    message: "Wiadomość została wysłana!" 
  })
}
