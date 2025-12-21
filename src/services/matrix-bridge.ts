/**
 * Matrix Bridge Service
 * 
 * Integracja systemu czatu z protokołem Matrix
 * Umożliwia konsultantom odpowiadanie przez aplikacje Matrix (Element, FluffyChat)
 * 
 * UWAGA: Wymaga zainstalowania matrix-js-sdk: npm install matrix-js-sdk
 */

let sdk: any
try {
  sdk = require("matrix-js-sdk")
} catch (e) {
  console.warn("[Matrix Bridge] matrix-js-sdk nie jest zainstalowany. Integracja Matrix jest wyłączona.")
  console.warn("[Matrix Bridge] Aby włączyć: npm install matrix-js-sdk")
}

interface MatrixConfig {
  homeserverUrl: string
  accessToken: string
  userId: string
  botUsername?: string
}

export class MatrixBridgeService {
  private client: any
  private config: MatrixConfig
  private roomMapping: Map<string, string> = new Map() // conversation_id -> matrix_room_id

  constructor(config: MatrixConfig) {
    this.config = config
  }

  async initialize() {
    if (!sdk) {
      console.warn("[Matrix Bridge] SDK nie jest dostępny - pomijam inicjalizację")
      return false
    }

    try {
      this.client = sdk.createClient({
        baseUrl: this.config.homeserverUrl,
        accessToken: this.config.accessToken,
        userId: this.config.userId,
      })

      // Rozpocznij synchronizację
      await this.client.startClient({ initialSyncLimit: 10 })

      // Nasłuchuj na nowe wiadomości
      this.client.on("Room.timeline", this.handleMatrixMessage.bind(this))

      console.log("[Matrix Bridge] Połączono z serwerem Matrix")
      return true
    } catch (error) {
      console.error("[Matrix Bridge] Błąd inicjalizacji:", error)
      return false
    }
  }

  /**
   * Utwórz pokój Matrix dla konwersacji
   */
  async createRoomForConversation(conversationId: string, customerName: string, customerEmail: string) {
    if (!this.client) {
      console.warn("[Matrix Bridge] Klient nie jest zainicjalizowany")
      return null
    }

    try {
      const room = await this.client.createRoom({
        name: `Chat: ${customerName}`,
        topic: `Konwersacja z ${customerName} (${customerEmail})`,
        preset: "private_chat",
        invite: [], // Możesz dodać ID konsultantów
        initial_state: [
          {
            type: "m.room.guest_access",
            state_key: "",
            content: { guest_access: "forbidden" },
          },
        ],
      })

      const roomId = room.room_id
      this.roomMapping.set(conversationId, roomId)

      // Wyślij wiadomość systemową
      await this.sendSystemMessage(
        roomId,
        `🆕 Nowa konwersacja\n\n` +
        `👤 Klient: ${customerName}\n` +
        `📧 Email: ${customerEmail}\n` +
        `🆔 ID: ${conversationId}\n\n` +
        `Odpowiedz tutaj, a wiadomość trafi do klienta na stronie.`
      )

      console.log(`[Matrix Bridge] Utworzono pokój ${roomId} dla konwersacji ${conversationId}`)
      
      // Automatycznie zaproś domyślnych agentów
      const defaultAgents = process.env.MATRIX_DEFAULT_AGENTS?.split(',') || []
      for (const agentId of defaultAgents) {
        try {
          await this.client.invite(roomId, agentId.trim())
          console.log(`[Matrix Bridge] Zaproszono ${agentId} do pokoju ${roomId}`)
        } catch (inviteError) {
          console.error(`[Matrix Bridge] Błąd zapraszania ${agentId}:`, inviteError)
        }
      }
      
      return roomId
    } catch (error) {
      console.error("[Matrix Bridge] Błąd tworzenia pokoju:", error)
      return null
    }
  }

  /**
   * Wyślij wiadomość klienta do Matrix
   */
  async sendCustomerMessageToMatrix(conversationId: string, message: string, customerName: string, customerEmail?: string) {
    if (!this.client) return false

    try {
      let roomId = this.roomMapping.get(conversationId)

      // Jeśli pokój nie istnieje, utwórz go
      if (!roomId) {
        console.log(`[Matrix Bridge] Pokój nie istnieje, tworzę nowy dla ${conversationId}`)
        roomId = await this.createRoomForConversation(conversationId, customerName, customerEmail || "unknown@email.com")
        if (!roomId) {
          console.error(`[Matrix Bridge] Nie udało się utworzyć pokoju dla ${conversationId}`)
          return false
        }
      }

      await this.client.sendMessage(roomId, {
        msgtype: "m.text",
        body: `${customerName}: ${message}`,
        format: "org.matrix.custom.html",
        formatted_body: `<strong>${customerName}:</strong> ${message}`,
      })

      console.log(`[Matrix Bridge] Wysłano wiadomość klienta do pokoju ${roomId}`)
      return true
    } catch (error) {
      console.error("[Matrix Bridge] Błąd wysyłania wiadomości:", error)
      return false
    }
  }

  /**
   * Obsłuż wiadomość z Matrix (od konsultanta)
   */
  private async handleMatrixMessage(event: any, room: any, toStartOfTimeline: boolean) {
    // Ignoruj stare wiadomości
    if (toStartOfTimeline) return

    // Ignoruj wiadomości od bota
    if (event.getSender() === this.config.userId) return

    // Tylko wiadomości tekstowe
    if (event.getType() !== "m.room.message") return

    const content = event.getContent()
    if (content.msgtype !== "m.text") return

    const roomId = room.roomId
    const message = content.body
    const sender = event.getSender()

    // Ignoruj wiadomości z panelu admina (zawierają prefix "Agent (Web):")
    if (message.startsWith("Agent (Web):")) {
      console.log(`[Matrix Bridge] Ignoruję wiadomość z panelu admina`)
      return
    }

    // Znajdź conversation_id dla tego pokoju
    const conversationId = this.getConversationIdByRoomId(roomId)
    if (!conversationId) {
      console.log(`[Matrix Bridge] Nie znaleziono konwersacji dla pokoju ${roomId}`)
      return
    }

    console.log(`[Matrix Bridge] Otrzymano wiadomość od ${sender} w pokoju ${roomId}`)

    // Wywołaj callback (zostanie podpięty przez główny serwis)
    if (this.onAgentMessage) {
      await this.onAgentMessage(conversationId, message, sender)
    }
  }

  /**
   * Wyślij wiadomość systemową
   */
  private async sendSystemMessage(roomId: string, message: string) {
    await this.client.sendMessage(roomId, {
      msgtype: "m.notice",
      body: message,
    })
  }

  /**
   * Znajdź conversation_id po room_id
   */
  private getConversationIdByRoomId(roomId: string): string | null {
    for (const [convId, rId] of this.roomMapping.entries()) {
      if (rId === roomId) return convId
    }
    return null
  }

  /**
   * Wyślij odpowiedź bota (Gemini) do Matrix
   */
  async sendBotMessageToMatrix(conversationId: string, message: string) {
    if (!this.client) return false

    try {
      const roomId = this.roomMapping.get(conversationId)

      if (!roomId) {
        console.log(`[Matrix Bridge] Pokój nie istnieje dla ${conversationId}, pomijam wysyłanie odpowiedzi bota`)
        return false
      }

      await this.client.sendMessage(roomId, {
        msgtype: "m.text",
        body: `🤖 Bot: ${message}`,
        format: "org.matrix.custom.html",
        formatted_body: `<strong style="color: #6366f1;">🤖 Bot:</strong> ${message}`,
      })

      console.log(`[Matrix Bridge] Wysłano odpowiedź bota do pokoju ${roomId}`)
      return true
    } catch (error) {
      console.error("[Matrix Bridge] Błąd wysyłania odpowiedzi bota:", error)
      return false
    }
  }

  /**
   * Wyślij wiadomość agenta z panelu admina do Matrix
   */
  async sendAgentMessageToMatrix(conversationId: string, message: string, agentName: string = "Agent (Web)") {
    if (!this.client) return false

    try {
      let roomId = this.roomMapping.get(conversationId)

      if (!roomId) {
        console.log(`[Matrix Bridge] Pokój nie istnieje dla ${conversationId}, pomijam wysyłanie wiadomości agenta`)
        return false
      }

      await this.client.sendMessage(roomId, {
        msgtype: "m.text",
        body: `${agentName}: ${message}`,
        format: "org.matrix.custom.html",
        formatted_body: `<strong style="color: green;">${agentName}:</strong> ${message}`,
      })

      console.log(`[Matrix Bridge] Wysłano wiadomość agenta z panelu admina do pokoju ${roomId}`)
      return true
    } catch (error) {
      console.error("[Matrix Bridge] Błąd wysyłania wiadomości agenta:", error)
      return false
    }
  }

  /**
   * Callback wywoływany gdy agent wyśle wiadomość
   */
  public onAgentMessage?: (conversationId: string, message: string, agentId: string) => Promise<void>

  /**
   * Wyślij powiadomienie o eskalacji
   */
  async notifyEscalation(conversationId: string, customerName: string) {
    const roomId = this.roomMapping.get(conversationId)
    if (!roomId) return

    await this.sendSystemMessage(
      roomId,
      `⚠️ Klient ${customerName} poprosił o kontakt z konsultantem. Odpowiedz jak najszybciej!`
    )
  }

  /**
   * Zamknij pokój
   */
  async closeRoom(conversationId: string) {
    const roomId = this.roomMapping.get(conversationId)
    if (!roomId) return

    await this.sendSystemMessage(roomId, "✅ Konwersacja została zamknięta.")
    
    // Opcjonalnie: opuść pokój
    // await this.client.leave(roomId)
    
    this.roomMapping.delete(conversationId)
  }

  /**
   * Zaproś konsultanta do pokoju
   */
  async inviteAgent(conversationId: string, agentMatrixId: string) {
    const roomId = this.roomMapping.get(conversationId)
    if (!roomId) return

    try {
      await this.client.invite(roomId, agentMatrixId)
      console.log(`[Matrix Bridge] Zaproszono ${agentMatrixId} do pokoju ${roomId}`)
    } catch (error) {
      console.error("[Matrix Bridge] Błąd zapraszania:", error)
    }
  }

  /**
   * Pobierz status połączenia
   */
  getStatus() {
    return {
      connected: this.client?.clientRunning || false,
      userId: this.config.userId,
      homeserver: this.config.homeserverUrl,
      activeRooms: this.roomMapping.size,
    }
  }
}
