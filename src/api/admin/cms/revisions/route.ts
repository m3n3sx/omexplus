import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { entityType, entityId } = req.query
  
  // Historia wersji dla danej treści
  const revisions = [
    {
      id: "rev_1",
      entityType,
      entityId,
      changes: {},
      author: "admin@example.com",
      createdAt: new Date(),
    }
  ]
  
  res.json({ revisions })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { revisionId } = req.body
  
  // Przywróć wersję
  res.json({ success: true, revisionId })
}
