import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import B2BService from "../../../../modules/omex-b2b/service"

// GET /admin/b2b/quotes - List all quotes
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const b2bService = req.scope.resolve("b2bService") as B2BService

  try {
    const { status, customer_id, page = 1, limit = 20 } = req.query

    const quotes = await b2bService.listQuotes({
      status: status as string,
      customer_id: customer_id as string,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
    })

    return res.json(quotes)
  } catch (error) {
    console.error("List quotes error:", error)
    return res.status(500).json({
      error: "Failed to list quotes",
      message: error.message,
    })
  }
}

// POST /admin/b2b/quotes - Create quote
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const b2bService = req.scope.resolve("b2bService") as B2BService

  try {
    const quote = await b2bService.createQuote(req.body)

    return res.status(201).json({ quote })
  } catch (error) {
    console.error("Create quote error:", error)
    return res.status(500).json({
      error: "Failed to create quote",
      message: error.message,
    })
  }
}
