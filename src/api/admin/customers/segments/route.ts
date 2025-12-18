import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  // Segmentacja klientów
  const segments = {
    vip: [],
    regular: [],
    inactive: [],
  }
  
  res.json({ segments })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { name, criteria } = req.body
  
  // Tworzenie nowego segmentu
  const segment = {
    id: `segment_${Date.now()}`,
    name,
    criteria,
    customerCount: 0,
  }
  
  res.json({ segment })
}
