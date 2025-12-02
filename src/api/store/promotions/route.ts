import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  // Pobieranie aktywnych promocji
  const promotions = {
    active: [],
    upcoming: [],
  }
  
  res.json({ promotions })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { code } = req.body
  
  // Walidacja kodu promocyjnego
  const discount = {
    valid: true,
    code,
    amount: 0,
  }
  
  res.json({ discount })
}
