/**
 * Chat Orchestrator Service
 * 
 * Koordynuje komunikację między:
 * - Klientami (web)
 * - AI Botem
 * - Konsultantami (web + Matrix)
 */

import { MatrixBridgeService } from "./matrix-bridge"
import { AIBotService } from "./ai-bot"

export class ChatOrchestratorService {
  private matrixBridge: MatrixBridgeService | null = null
  private aiBot: AIBotService
  private chatModule: any

  constructor(chatModule: any) {
    this.chatModule = chatModule
    this.aiBot = new AIBotService()
  }

  /**
   * Inicjalizuj integrację z Matrix
   */
  async initializeMatrix(config: {
    homeserverUrl: string
    accessToken: string
    userId: string
  }) {
    try {
      this.matrixBridge = new MatrixBridgeService(config)
      
      // Podepnij callback dla wiadomości od agentów
      this.matrixBridge.onAgentMessage = this.handleAgentMessageFromMatrix.bind(this)
      
      const success = await this.matrixBridge.initialize()
      
      if (success) {
        console.log("[Chat Orchestrator] Matrix bridge zainicjalizowany")
      }
      
      return success
    } catch (error) {
      console.error("[Chat Orchestrator] Błąd inicjalizacji Matrix:", error)
      return false
    }
  }

  /**
   * Nowa konwersacja - utwórz pokój Matrix
   */
  async onConversationCreated(conversation: any) {
    if (!this.matrixBridge) return

    await this.matrixBridge.createRoomForConversation(
      conversation.id,
      conversation.customer_name,
      conversation.customer_email
    )
  }

  /**
   * Nowa wiadomość od klienta
   */
  async onCustomerMessage(conversationId: string, message: string, conversation: any) {
    console.log(`[Chat Orchestrator] Customer message in conversation ${conversationId}, status: ${conversation.status}`)
    
    // 1. Jeśli konwersacja jest obsługiwana przez agenta, nie odpowiadaj botem
    if (conversation.status === "agent") {
      console.log("[Chat Orchestrator] Conversation handled by agent, skipping bot response")
      
      // Tylko wyślij do Matrix (jeśli aktywne)
      if (this.matrixBridge) {
        await this.matrixBridge.sendCustomerMessageToMatrix(
          conversationId,
          message,
          conversation.customer_name,
          conversation.customer_email
        )
      }
      
      return null // Nie generuj odpowiedzi bota
    }

    // 2. Jeśli bot mode, wygeneruj odpowiedź
    if (conversation.status === "bot") {
      const shouldEscalate = await this.aiBot.shouldEscalateToAgent({
        ...conversation,
        messages: [{ content: message }],
      })

      if (shouldEscalate) {
        // Eskaluj do agenta
        await this.chatModule.updateConversations(conversationId, { status: "agent" })
        
        // Powiadom w Matrix
        if (this.matrixBridge) {
          await this.matrixBridge.notifyEscalation(conversationId, conversation.customer_name)
        }

        return {
          type: "escalation",
          message: "Rozumiem, że potrzebujesz pomocy konsultanta. Przekazuję Twoją sprawę do naszego zespołu. Odpowiemy najszybciej jak to możliwe!",
        }
      } else {
        // Odpowiedź bota
        const botResponse = await this.aiBot.generateResponse(message, conversation)
        return {
          type: "bot",
          message: botResponse,
        }
      }
    }

    // 3. Dla innych statusów (open, closed) nie odpowiadaj
    return null
  }

  /**
   * Wiadomość od agenta z Matrix
   */
  private async handleAgentMessageFromMatrix(
    conversationId: string,
    message: string,
    agentId: string
  ) {
    try {
      // Zapisz wiadomość w bazie
      await this.chatModule.createMessages({
        conversation_id: conversationId,
        sender_type: "agent",
        content: message,
        metadata: {
          agent_id: agentId,
          source: "matrix",
          timestamp: new Date().toISOString(),
        },
      })

      console.log(`[Chat Orchestrator] Zapisano wiadomość od agenta ${agentId}`)

      // Opcjonalnie: wyślij powiadomienie push do klienta
      // await this.notifyCustomer(conversationId, message)
    } catch (error) {
      console.error("[Chat Orchestrator] Błąd zapisywania wiadomości agenta:", error)
    }
  }

  /**
   * Zamknij konwersację
   */
  async onConversationClosed(conversationId: string) {
    if (this.matrixBridge) {
      await this.matrixBridge.closeRoom(conversationId)
    }
  }

  /**
   * Zaproś konsultanta do konwersacji
   */
  async inviteAgentToConversation(conversationId: string, agentMatrixId: string) {
    if (this.matrixBridge) {
      await this.matrixBridge.inviteAgent(conversationId, agentMatrixId)
    }
  }

  /**
   * Wyślij wiadomość klienta do Matrix
   */
  async sendCustomerMessageToMatrix(
    conversationId: string, 
    message: string, 
    customerName: string, 
    customerEmail?: string
  ) {
    if (!this.matrixBridge) return false
    
    try {
      await this.matrixBridge.sendCustomerMessageToMatrix(conversationId, message, customerName, customerEmail)
      return true
    } catch (error) {
      console.error("[Chat Orchestrator] Błąd wysyłania wiadomości klienta do Matrix:", error)
      return false
    }
  }

  /**
   * Wyślij wiadomość agenta do Matrix (z panelu admina)
   */
  async sendAgentMessageToMatrix(conversationId: string, message: string, agentName: string = "Agent") {
    if (!this.matrixBridge) return false
    
    try {
      await this.matrixBridge.sendAgentMessageToMatrix(conversationId, message, agentName)
      return true
    } catch (error) {
      console.error("[Chat Orchestrator] Błąd wysyłania wiadomości agenta do Matrix:", error)
      return false
    }
  }

  /**
   * Wyślij odpowiedź bota (Gemini) do Matrix
   */
  async sendBotMessageToMatrix(conversationId: string, message: string) {
    if (!this.matrixBridge) return false
    
    try {
      await this.matrixBridge.sendBotMessageToMatrix(conversationId, message)
      return true
    } catch (error) {
      console.error("[Chat Orchestrator] Błąd wysyłania odpowiedzi bota do Matrix:", error)
      return false
    }
  }

  /**
   * Status integracji
   */
  getStatus() {
    return {
      matrix: this.matrixBridge?.getStatus() || { connected: false },
      aiBot: { enabled: true },
    }
  }
}
