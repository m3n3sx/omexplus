import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { AIBotService } from "../../../../services/ai-bot"
import { ChatOrchestratorService } from "../../../../services/chat-orchestrator"

// GET - Pobierz konwersacje klienta
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { customer_email } = req.query

  if (!customer_email) {
    return res.status(400).json({ error: "customer_email is required" })
  }

  const chatModule = req.scope.resolve("chat")
  
  const conversations = await chatModule.listConversations({
    customer_email: customer_email as string
  })

  res.json({ conversations })
}

// POST - Utwórz nową konwersację
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { customer_email, customer_name, customer_id } = req.body

  if (!customer_email || !customer_name) {
    return res.status(400).json({ error: "customer_email and customer_name are required" })
  }

  try {
    const chatModule = req.scope.resolve("chat")
    
    // Utwórz konwersację
    const conversationResult = await chatModule.createConversations({
      customer_email,
      customer_name,
      customer_id,
      status: "bot",
      metadata: { created_at: new Date().toISOString() }
    })

    // MedusaService może zwracać tablicę lub obiekt
    const conversation = Array.isArray(conversationResult) ? conversationResult[0] : conversationResult

    if (!conversation || !conversation.id) {
      console.error("[Chat API] Invalid conversation created:", conversationResult)
      return res.status(500).json({ error: "Failed to create conversation" })
    }

    console.log("[Chat API] Conversation created:", conversation.id)

    // Wyślij wiadomość powitalną od bota
    const botService = new AIBotService()
    const welcomeMessage = await botService.generateResponse("witaj")
    
    await chatModule.createMessages({
      conversation_id: conversation.id,
      sender_type: "bot",
      content: welcomeMessage,
      metadata: { timestamp: new Date().toISOString() }
    })

    console.log("[Chat API] Welcome message sent")

    // Utwórz pokój Matrix jeśli skonfigurowany (opcjonalnie)
    if (process.env.MATRIX_HOMESERVER_URL && process.env.MATRIX_ACCESS_TOKEN) {
      try {
        const orchestrator = new ChatOrchestratorService(chatModule)
        await orchestrator.initializeMatrix({
          homeserverUrl: process.env.MATRIX_HOMESERVER_URL,
          accessToken: process.env.MATRIX_ACCESS_TOKEN,
          userId: process.env.MATRIX_USER_ID || "@chatbot:matrix.org",
        })
        await orchestrator.onConversationCreated(conversation)
      } catch (error) {
        console.warn("[Chat API] Matrix initialization failed, continuing without it:", error)
      }
    }

    res.json({ conversation })
  } catch (error: any) {
    console.error("[Chat API] Error creating conversation:", error)
    res.status(500).json({ 
      error: "Failed to create conversation",
      details: error.message 
    })
  }
}
