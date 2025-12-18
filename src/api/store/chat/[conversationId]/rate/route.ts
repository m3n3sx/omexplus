/**
 * Chat Rating API
 * POST /store/chat/:conversationId/rate - Rate conversation
 */

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CHAT_MODULE } from "../../../../../modules/chat"

interface RatingRequest {
  rating: number
}

// POST /store/chat/:conversationId/rate - Rate conversation
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const conversationId = req.params.conversationId
    const { rating } = req.body as RatingRequest

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" })
    }

    const chatModule = req.scope.resolve(CHAT_MODULE)

    // Update conversation with rating and close it
    await chatModule.updateConversations({
      id: conversationId,
      status: 'closed',
      metadata: { rating }
    })

    res.json({
      success: true,
      message: 'Dziękujemy za ocenę!'
    })

  } catch (error: any) {
    console.error("Rate conversation error:", error)
    res.status(500).json({ error: error.message })
  }
}
