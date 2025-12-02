import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { type, startDate, endDate } = req.query
  
  // Generowanie raportów
  const report = {
    type,
    period: { startDate, endDate },
    data: [],
  }
  
  res.json({ report })
}
