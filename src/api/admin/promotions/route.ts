import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  // Lista wszystkich promocji
  const promotions = []
  
  res.json({ promotions })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { code, type, value, startDate, endDate } = req.body
  
  // Tworzenie nowej promocji
  const promotion = {
    id: `promo_${Date.now()}`,
    code,
    type,
    value,
    startDate,
    endDate,
    active: true,
  }
  
  res.json({ promotion })
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.body
  
  // Usuwanie promocji
  res.json({ success: true, id })
}
