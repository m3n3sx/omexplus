import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// GET - Lista wszystkich konwersacji (dla admina przez Store API)
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { status } = req.query
  
  try {
    const chatModule = req.scope.resolve("chat")
    
    const filters: any = {}
    if (status) {
      filters.status = status
    }
    
    const conversations = await chatModule.listConversations(filters)

    // Pobierz ostatnią wiadomość dla każdej konwersacji
    const conversationsWithLastMessage = await Promise.all(
      conversations.map(async (conv: any) => {
        const messages = await chatModule.listMessages({
          conversation_id: conv.id
        })
        
        const sortedMessages = messages.sort((a: any, b: any) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        
        return {
          ...conv,
          last_message: sortedMessages[0] || null,
          message_count: messages.length
        }
      })
    )

    res.json({ conversations: conversationsWithLastMessage })
  } catch (error: any) {
    console.error("[Store Chat API] Error loading conversations:", error)
    res.status(500).json({ 
      error: "Failed to load conversations",
      details: error.message 
    })
  }
}
