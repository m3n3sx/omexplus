import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ChatOrchestratorService } from "../../../../../../services/chat-orchestrator"

// POST - Wyślij wiadomość w konwersacji
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params
  const { content, sender_type = "customer" } = req.body

  console.log(`[Chat API] POST /messages - id: ${id}, sender_type: ${sender_type}`)

  if (!content) {
    return res.status(400).json({ error: "content is required" })
  }
  
  if (!id) {
    return res.status(400).json({ error: "conversation id is required" })
  }

  try {
    const chatModule = req.scope.resolve("chat")
  
  // Zapisz wiadomość
  const customerMessage = await chatModule.createMessages({
    conversation_id: id,
    sender_type,
    content,
    metadata: { timestamp: new Date().toISOString() }
  })

  // Pobierz konwersację
  const conversation = await chatModule.retrieveConversation(id)
  
  if (!conversation) {
    return res.status(404).json({ error: "Conversation not found" })
  }
  
  // Jeśli agent wysyła wiadomość
  if (sender_type === "agent") {
    // Zmień status na "agent" jeśli jeszcze nie jest
    if (conversation.status !== "agent") {
      const conversationId = conversation.id
      console.log(`[Chat API] Changing conversation ${conversationId} status from "${conversation.status}" to "agent"`)
      try {
        const updated = await chatModule.updateConversations([{
          id: conversationId,
          status: "agent"
        }])
        console.log(`[Chat API] Changed conversation ${conversationId} status to "agent"`)
      } catch (updateError: any) {
        console.error(`[Chat API] Error updating conversation status:`, updateError.message)
      }
    }
    
    // Wyślij wiadomość agenta do Matrix (żeby inni agenci widzieli)
    if (process.env.MATRIX_HOMESERVER_URL && process.env.MATRIX_ACCESS_TOKEN) {
      try {
        const orchestrator = new ChatOrchestratorService(chatModule)
        await orchestrator.initializeMatrix({
          homeserverUrl: process.env.MATRIX_HOMESERVER_URL,
          accessToken: process.env.MATRIX_ACCESS_TOKEN,
          userId: process.env.MATRIX_USER_ID || "@chatbot:matrix.org",
        })
        
        // Wyślij wiadomość agenta do Matrix
        await orchestrator.sendAgentMessageToMatrix(id, content, "web-admin")
        console.log(`[Chat API] Sent agent message to Matrix`)
      } catch (matrixError) {
        console.warn("[Chat API] Failed to send agent message to Matrix:", matrixError)
      }
    }
  }
  
  // Użyj orchestratora do obsługi wiadomości
  let botMessage = null
  if (sender_type === "customer") {
    console.log(`[Chat API] Processing customer message, conversation status: ${conversation.status}`)
    const orchestrator = new ChatOrchestratorService(chatModule)
    
    // Inicjalizuj Matrix jeśli skonfigurowany (opcjonalnie)
    if (process.env.MATRIX_HOMESERVER_URL && process.env.MATRIX_ACCESS_TOKEN) {
      try {
        await orchestrator.initializeMatrix({
          homeserverUrl: process.env.MATRIX_HOMESERVER_URL,
          accessToken: process.env.MATRIX_ACCESS_TOKEN,
          userId: process.env.MATRIX_USER_ID || "@chatbot:matrix.org",
        })
      } catch (error) {
        console.warn("[Chat API] Matrix initialization failed, continuing without it:", error)
      }
    }
    
    const response = await orchestrator.onCustomerMessage(id, content, conversation)
    console.log(`[Chat API] Orchestrator response:`, response)
    
    if (response) {
      botMessage = await chatModule.createMessages({
        conversation_id: id,
        sender_type: response.type === "bot" ? "bot" : "agent",
        content: response.message,
        metadata: { 
          timestamp: new Date().toISOString(),
          escalated: response.type === "escalation"
        }
      })
    }
  }

    res.json({ 
      message: customerMessage,
      bot_message: botMessage
    })
  } catch (error: any) {
    console.error("[Chat API] Error sending message:", error)
    res.status(500).json({ 
      error: "Failed to send message",
      details: error.message 
    })
  }
}
