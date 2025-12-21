/**
 * Chat Messages API
 * POST /store/chat/:conversationId/messages - Send message
 */

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { GeminiService } from "../../../../../services/gemini.service"
import AdvancedSearchService from "../../../../../modules/omex-search/advanced-search.service"
import { CHAT_MODULE } from "../../../../../modules/chat"
import { ChatOrchestratorService } from "../../../../../services/chat-orchestrator"

interface MessageRequest {
  content: string
  sender_type?: 'customer' | 'agent'
  attachment_url?: string
  attachment_name?: string
}

// Initialize Matrix bridge (singleton)
let orchestrator: ChatOrchestratorService | null = null

async function getOrchestrator(chatModule: any): Promise<ChatOrchestratorService> {
  if (!orchestrator) {
    orchestrator = new ChatOrchestratorService(chatModule)
    
    // Initialize Matrix if configured
    if (process.env.MATRIX_HOMESERVER_URL && process.env.MATRIX_ACCESS_TOKEN && process.env.MATRIX_USER_ID) {
      try {
        await orchestrator.initializeMatrix({
          homeserverUrl: process.env.MATRIX_HOMESERVER_URL,
          accessToken: process.env.MATRIX_ACCESS_TOKEN,
          userId: process.env.MATRIX_USER_ID
        })
        console.log('[Chat Messages] Matrix bridge initialized')
      } catch (err) {
        console.error('[Chat Messages] Failed to initialize Matrix:', err)
      }
    }
  }
  return orchestrator
}

// POST /store/chat/:conversationId/messages - Send message
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const conversationId = req.params.conversationId
    const { content, sender_type = 'customer', attachment_url, attachment_name } = req.body as MessageRequest

    const chatModule = req.scope.resolve(CHAT_MODULE)

    // Get conversation
    let conversation
    try {
      conversation = await chatModule.retrieveConversation(conversationId)
    } catch {
      return res.status(404).json({ error: "Conversation not found" })
    }

    // Get orchestrator for Matrix integration
    const orch = await getOrchestrator(chatModule)

    // Add message
    const userMessage = await chatModule.createMessages({
      conversation_id: conversationId,
      sender_type: sender_type,
      content,
      metadata: attachment_url ? { attachment_url, attachment_name } : null
    })

    // Send to Matrix if it's a customer message
    if (sender_type === 'customer') {
      try {
        await orch.sendCustomerMessageToMatrix(
          conversationId,
          content,
          conversation.customer_name,
          conversation.customer_email
        )
      } catch (matrixErr) {
        console.error('[Chat Messages] Matrix send error:', matrixErr)
      }
    } else if (sender_type === 'agent') {
      // Agent message from admin panel - send to Matrix
      try {
        await orch.sendAgentMessageToMatrix(conversationId, content, 'Agent (Web)')
      } catch (matrixErr) {
        console.error('[Chat Messages] Matrix agent send error:', matrixErr)
      }
      
      // Return early for agent messages - no bot response needed
      return res.json({
        message: userMessage,
        bot_message: null
      })
    }

    // Get conversation history for AI context
    const history = await chatModule.listMessages({
      conversation_id: conversationId
    }, {
      order: { created_at: 'ASC' },
      take: 20
    })

    // Build history for Gemini
    const chatHistory = history.map((m: any) => ({
      role: m.sender_type === 'customer' ? 'user' as const : 'model' as const,
      content: m.content
    }))

    // Generate bot response using Gemini
    let botResponse = ''
    let searchResults: any = null

    if (conversation.status === 'bot') {
      try {
        const gemini = new GeminiService()
        const searchService = new AdvancedSearchService(req.scope)

        // Search for products if query seems like a search
        const searchKeywords = ['szukam', 'potrzebuję', 'części', 'pompa', 'filtr', 'cat', 'komatsu', 'koparka', 'ładowarka', 'hydraul']
        const isSearchQuery = searchKeywords.some(k => content.toLowerCase().includes(k))

        if (isSearchQuery) {
          searchResults = await searchService.searchByText({
            query: content,
            language: 'pl',
            fuzzy: true
          })
        }

        // Build context for AI
        let productContext = ''
        if (searchResults?.products?.length > 0) {
          productContext = `\n\nZNALEZIONE PRODUKTY W BAZIE:\n${searchResults.products.slice(0, 5).map((p: any, i: number) => 
            `${i + 1}. ${p.title} (SKU: ${p.variants?.[0]?.sku || 'N/A'})`
          ).join('\n')}\n\nPolecaj produkty z tej listy gdy pasują do zapytania klienta.`
        }

        const systemPrompt = `Jesteś asystentem sklepu OMEX z częściami do maszyn budowlanych.

ZASADY FORMATOWANIA:
- Odpowiadaj zwięźle (2-3 zdania)
- Gdy pytasz o wybór (np. typ filtra), ZAWSZE wymieniaj opcje jako listę numerowaną:
  1. Filtr oleju
  2. Filtr paliwa
  3. Filtr powietrza
  4. Filtr hydrauliczny
- Gdy polecasz produkty, podawaj ich nazwy w nawiasach kwadratowych: [Nazwa produktu]
- Gdy podajesz SKU, używaj formatu: (SKU: XXXXX)

ZASADY ROZMOWY:
- Bądź pomocny, konkretny i profesjonalny
- Jeśli nie możesz pomóc, zaproponuj połączenie z konsultantem
- Zawsze pytaj o szczegóły maszyny (marka, model) jeśli klient ich nie podał
${productContext}`

        botResponse = await gemini.chat(content, chatHistory.slice(-10), systemPrompt)

      } catch (error) {
        console.error('Gemini error:', error)
        botResponse = 'Przepraszam, mam chwilowe problemy. Czy mogę połączyć Cię z konsultantem?'
      }
    } else {
      // Agent mode - no auto response
      botResponse = ''
    }

    // Add bot message if we have a response
    let botMessage: any = null
    if (botResponse) {
      botMessage = await chatModule.createMessages({
        conversation_id: conversationId,
        sender_type: 'bot',
        content: botResponse
      })
      
      // Send bot response to Matrix so agents can see it
      try {
        await orch.sendBotMessageToMatrix(conversationId, botResponse)
      } catch (matrixErr) {
        console.error('[Chat Messages] Matrix bot send error:', matrixErr)
      }
    }

    // Check if should escalate
    const escalateKeywords = ['konsultant', 'człowiek', 'agent', 'pomoc', 'nie rozumiem', 'zadzwonić']
    if (escalateKeywords.some(k => content.toLowerCase().includes(k))) {
      await chatModule.updateConversations({
        id: conversationId,
        status: 'agent'
      })
      
      const escalateMsg = await chatModule.createMessages({
        conversation_id: conversationId,
        sender_type: 'bot',
        content: '🔄 Przekazuję rozmowę do konsultanta. Proszę chwilę poczekać...'
      })
      
      // Return escalation message as bot_message
      botMessage = escalateMsg
    }

    // Extract quick replies from bot response
    const quickReplies = botResponse ? extractQuickReplies(botResponse, searchResults) : []

    // Extract search context from message
    const searchContext = extractSearchContext(content)

    res.json({
      message: userMessage,
      bot_message: botMessage,
      search_results: searchResults?.products?.slice(0, 5) || null,
      quick_replies: quickReplies,
      search_context: searchContext
    })

  } catch (error: any) {
    console.error("Send message error:", error)
    res.status(500).json({ error: error.message })
  }
}


// Extract search context from user message
function extractSearchContext(message: string): { brand?: string; model?: string; machineType?: string; category?: string } {
  const lowerMessage = message.toLowerCase()
  const context: { brand?: string; model?: string; machineType?: string; category?: string } = {}

  // Extract brand
  const brands: Record<string, string> = {
    'cat': 'CAT', 'caterpillar': 'CAT',
    'komatsu': 'Komatsu',
    'hitachi': 'Hitachi',
    'volvo': 'Volvo',
    'jcb': 'JCB',
    'kobelco': 'Kobelco',
    'hyundai': 'Hyundai',
    'liebherr': 'Liebherr',
    'doosan': 'Doosan',
    'case': 'Case'
  }

  for (const [key, value] of Object.entries(brands)) {
    if (lowerMessage.includes(key)) {
      context.brand = value
      break
    }
  }

  // Extract model (e.g., 320D, PC200, ZX210)
  const modelPattern = /\b([a-z]{0,3}\d{2,4}[a-z]?(?:[-]\d+)?)\b/gi
  const modelMatch = message.match(modelPattern)
  if (modelMatch) {
    context.model = modelMatch[0].toUpperCase()
  }

  // Extract machine type
  const types: Record<string, string> = {
    'koparka': 'excavator', 'excavator': 'excavator', 'koparki': 'excavator',
    'ładowarka': 'loader', 'loader': 'loader', 'ładowarki': 'loader',
    'spychacz': 'dozer', 'dozer': 'dozer', 'bulldozer': 'dozer',
    'walec': 'roller', 'roller': 'roller',
    'dźwig': 'crane', 'crane': 'crane'
  }

  for (const [key, value] of Object.entries(types)) {
    if (lowerMessage.includes(key)) {
      context.machineType = value
      break
    }
  }

  // Extract category
  const categories: Record<string, string> = {
    'filtr': 'filters', 'filtry': 'filters', 'filter': 'filters',
    'pompa': 'pumps', 'pompy': 'pumps', 'pump': 'pumps',
    'uszczelka': 'seals', 'uszczelki': 'seals', 'seal': 'seals',
    'łożysko': 'bearings', 'łożyska': 'bearings', 'bearing': 'bearings',
    'pasek': 'belts', 'paski': 'belts', 'belt': 'belts',
    'hydraul': 'hydraulics'
  }

  for (const [key, value] of Object.entries(categories)) {
    if (lowerMessage.includes(key)) {
      context.category = value
      break
    }
  }

  return context
}

// Extract quick replies from AI response
function extractQuickReplies(response: string, searchResults: any): string[] {
  const options: string[] = []
  const lowerResponse = response.toLowerCase()
  
  // Extract numbered options (1. Filtr oleju, 2. Filtr paliwa)
  const lines = response.split('\n')
  for (const line of lines) {
    const numberedMatch = line.match(/^\s*\d+\.\s*(.+)$/)
    if (numberedMatch) {
      const option = numberedMatch[1].trim()
      if (option.length > 3 && option.length < 50) {
        options.push(option)
      }
    }
  }
  
  // Extract filter types mentioned in text
  const filterKeywords: Record<string, string> = {
    'oleju': 'Filtr oleju',
    'paliwa': 'Filtr paliwa', 
    'powietrza': 'Filtr powietrza',
    'hydrauliczny': 'Filtr hydrauliczny',
    'hydrauliczn': 'Filtr hydrauliczny',
    'kabinowy': 'Filtr kabinowy'
  }
  
  for (const [keyword, label] of Object.entries(filterKeywords)) {
    if (lowerResponse.includes(keyword) && !options.some(o => o.toLowerCase() === label.toLowerCase())) {
      options.push(label)
    }
  }
  
  // Add standard options if we have room
  if (searchResults?.products?.length > 0 && options.length < 4) {
    options.push('🔍 Otwórz wyszukiwarkę')
  }
  if (options.length < 4) {
    options.push('👤 Porozmawiaj z konsultantem')
  }
  
  return [...new Set(options)].slice(0, 4)
}
