import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// POST - Agent odpowiada klientowi
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params
  const { content } = req.body

  if (!content) {
    return res.status(400).json({ error: "content is required" })
  }

  try {
    const chatModule = req.scope.resolve("chat")
    
    // Dodaj wiadomość od agenta
    const message = await chatModule.createMessages({
      conversation_id: id,
      sender_type: "agent",
      content,
      metadata: { timestamp: new Date().toISOString() }
    })

    // Zmień status konwersacji na "agent"
    await chatModule.updateConversations(id, {
      status: "agent"
    })

    res.json({ message })
  } catch (error: any) {
    console.error("[Admin Chat API] Error sending reply:", error)
    res.status(500).json({ 
      error: "Failed to send reply",
      details: error.message 
    })
  }
}
