/**
 * Chat Conversation API
 * GET /store/chat/:conversationId - Get conversation with messages
 */

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CHAT_MODULE } from "../../../../modules/chat"

// GET /store/chat/:conversationId - Get conversation
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const conversationId = req.params.conversationId
    
    const chatModule = req.scope.resolve(CHAT_MODULE)

    const conversation = await chatModule.retrieveConversation(conversationId)
    
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" })
    }

    // Get messages for this conversation
    const messages = await chatModule.listMessages({
      conversation_id: conversationId
    }, {
      order: { created_at: 'ASC' }
    })

    res.json({
      conversation: {
        id: conversation.id,
        status: conversation.status
      },
      messages
    })

  } catch (error: any) {
    console.error("Get conversation error:", error)
    res.status(500).json({ error: error.message })
  }
}
