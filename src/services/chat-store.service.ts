/**
 * Chat Store Service
 * In-memory storage for chat conversations
 * In production, replace with database storage
 */

export interface ChatMessage {
  id: string
  sender_type: 'customer' | 'bot' | 'agent'
  content: string
  created_at: string
  attachment_url?: string
  attachment_name?: string
}

export interface Conversation {
  id: string
  customer_email: string
  customer_name: string
  status: 'bot' | 'agent'
  created_at: string
  messages: ChatMessage[]
  history: Array<{ role: 'user' | 'model'; content: string }>
}

class ChatStoreService {
  private conversations = new Map<string, Conversation>()

  createConversation(data: {
    customer_email?: string
    customer_name?: string
  }): Conversation {
    const id = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const conversation: Conversation = {
      id,
      customer_email: data.customer_email || `guest_${Date.now()}@temp.com`,
      customer_name: data.customer_name || 'Gość',
      status: 'bot',
      created_at: new Date().toISOString(),
      messages: [],
      history: []
    }

    // Welcome message
    const welcomeMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender_type: 'bot',
      content: 'Cześć! 👋 Jestem asystentem OMEX. Mogę pomóc Ci znaleźć części do maszyn budowlanych. Powiedz mi, czego szukasz lub opisz swoją maszynę.',
      created_at: new Date().toISOString()
    }

    conversation.messages.push(welcomeMessage)
    this.conversations.set(id, conversation)

    return conversation
  }

  getConversation(id: string): Conversation | undefined {
    return this.conversations.get(id)
  }

  addMessage(conversationId: string, message: ChatMessage): void {
    const conversation = this.conversations.get(conversationId)
    if (conversation) {
      conversation.messages.push(message)
    }
  }

  addToHistory(conversationId: string, entry: { role: 'user' | 'model'; content: string }): void {
    const conversation = this.conversations.get(conversationId)
    if (conversation) {
      conversation.history.push(entry)
    }
  }

  setStatus(conversationId: string, status: 'bot' | 'agent'): void {
    const conversation = this.conversations.get(conversationId)
    if (conversation) {
      conversation.status = status
    }
  }

  deleteConversation(id: string): void {
    this.conversations.delete(id)
  }
}

// Singleton instance
export const chatStore = new ChatStoreService()
