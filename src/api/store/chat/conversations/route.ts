/**
 * Chat Conversations API
 * GET /store/chat/conversations - List all conversations
 * POST /store/chat/conversations - Create new conversation
 */

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CHAT_MODULE } from "../../../../modules/chat"

interface ConversationRequest {
  customer_email?: string
  customer_name?: string
  customer_id?: string
}

// GET /store/chat/conversations - List all conversations (for admin dashboard)
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { status } = req.query as Record<string, string>
    
    const chatModule = req.scope.resolve(CHAT_MODULE)
    
    const filters: any = {}
    if (status && status !== 'all') {
      filters.status = status
    }
    
    const conversations = await chatModule.listConversations(filters)

    // Get last message and message count for each conversation
    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conv: any) => {
        const messages = await chatModule.listMessages({
          conversation_id: conv.id
        }, {
          order: { created_at: 'DESC' },
          take: 1
        })
        
        const allMessages = await chatModule.listMessages({
          conversation_id: conv.id
        })
        
        return {
          id: conv.id,
          customer_name: conv.customer_name,
          customer_email: conv.customer_email,
          status: conv.status,
          created_at: conv.created_at,
          last_message: messages[0] || null,
          message_count: allMessages.length
        }
      })
    )

    // Sort by last message date (newest first)
    conversationsWithDetails.sort((a, b) => {
      const dateA = a.last_message?.created_at || a.created_at
      const dateB = b.last_message?.created_at || b.created_at
      return new Date(dateB).getTime() - new Date(dateA).getTime()
    })

    res.json({ conversations: conversationsWithDetails })
  } catch (error: any) {
    console.error("List conversations error:", error)
    res.status(500).json({ error: error.message })
  }
}

// POST /store/chat/conversations - Create new conversation
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { customer_email, customer_name, customer_id } = req.body as ConversationRequest
    
    const chatModule = req.scope.resolve(CHAT_MODULE)

    // Create conversation
    const conversation = await chatModule.createConversations({
      customer_id: customer_id || null,
      customer_email: customer_email || `guest_${Date.now()}@temp.com`,
      customer_name: customer_name || 'Gość',
      status: 'bot'
    })

    // Create welcome message
    const welcomeMessage = await chatModule.createMessages({
      conversation_id: conversation.id,
      sender_type: 'bot',
      content: 'Cześć! 👋 Jestem asystentem OMEX. Mogę pomóc Ci znaleźć części do maszyn budowlanych. Powiedz mi, czego szukasz lub opisz swoją maszynę.'
    })

    res.json({
      conversation: {
        id: conversation.id,
        status: conversation.status
      },
      messages: [welcomeMessage]
    })

  } catch (error: any) {
    console.error("Create conversation error:", error)
    res.status(500).json({ error: error.message })
  }
}
