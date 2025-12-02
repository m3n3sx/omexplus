import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  // Upload plików multimedialnych
  const file = req.file
  
  // Zapisz plik i zwróć URL
  const media = {
    id: `media_${Date.now()}`,
    url: `/uploads/${file?.filename}`,
    type: file?.mimetype,
    size: file?.size,
    createdAt: new Date(),
  }
  
  res.json({ media })
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  // Lista wszystkich mediów
  const media = []
  
  res.json({ media })
}
