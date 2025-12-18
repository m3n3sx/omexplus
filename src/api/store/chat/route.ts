/**
 * Customer Chat API with Gemini AI Integration
 * POST /store/chat - AI assistant for customers
 * GET /store/chat/escalate - Request human support
 */

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { GeminiService } from "../../../services/gemini.service"
import AdvancedSearchService from "../../../modules/omex-search/advanced-search.service"

interface ChatMessage {
  role: 'user' | 'model'
  content: string
}

interface ChatRequest {
  message: string
  history?: ChatMessage[]
  sessionId?: string
  customerId?: string
  language?: string
  searchContext?: {
    machineType?: string
    manufacturer?: string
    model?: string
    category?: string
  }
}

// POST /store/chat - Main chat endpoint
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { 
      message, 
      history = [], 
      sessionId,
      customerId,
      language = 'pl',
      searchContext 
    } = req.body as ChatRequest

    if (!message) {
      return res.status(400).json({ error: "Message is required" })
    }

    const gemini = new GeminiService()
    const searchService = new AdvancedSearchService(req.scope)

    // Analyze intent
    const intent = await analyzeIntent(message, language)
    
    // Build context for AI
    let productContext = ''
    let searchResults: any = null
    let actions: any[] = []
    let quickReplies: string[] = []

    // Handle different intents
    switch (intent.type) {
      case 'search_part':
        // Search for parts based on user query
        searchResults = await searchService.searchByText({
          query: message,
          language: language as 'pl' | 'en' | 'de' | 'uk',
          fuzzy: true
        })
        
        if (searchResults.products?.length > 0) {
          productContext = formatProductsForAI(searchResults.products.slice(0, 5))
          actions.push({
            type: 'show_products',
            data: { products: searchResults.products.slice(0, 6) }
          })
        }
        break

      case 'search_by_machine':
        // Extract machine info and search
        const machineData = extractMachineData(message, searchContext)
        if (machineData.brand || machineData.model) {
          searchResults = await searchService.searchByMachine({
            brand: machineData.brand,
            machineType: machineData.type,
            model: machineData.model
          })
          
          if (searchResults.products?.length > 0) {
            productContext = formatProductsForAI(searchResults.products.slice(0, 5))
            actions.push({
              type: 'launch_search',
              data: machineData
            })
          }
        }
        break

      case 'part_number':
        // Search by part number
        const partNumber = extractPartNumber(message)
        if (partNumber) {
          const partResult = await searchService.searchByPartNumber({
            partNumber,
            includeAlternatives: true
          })
          
          if (partResult.exact || partResult.alternatives?.length > 0) {
            productContext = formatProductsForAI(
              partResult.exact ? [partResult.exact, ...partResult.alternatives.slice(0, 4)] : partResult.alternatives.slice(0, 5)
            )
            actions.push({
              type: 'show_products',
              data: { 
                products: partResult.exact ? [partResult.exact, ...partResult.alternatives] : partResult.alternatives,
                partNumber 
              }
            })
          }
        }
        break

      case 'escalate':
        // User wants human support
        actions.push({
          type: 'escalate_to_human',
          data: { reason: message, sessionId, customerId }
        })
        break

      case 'compatibility':
        // Check compatibility
        actions.push({
          type: 'validate_compatibility',
          data: extractMachineData(message, searchContext)
        })
        break
    }

    // Build system prompt for Gemini
    const systemPrompt = buildSystemPrompt(language, productContext, intent)

    // Get AI response
    const aiResponse = await gemini.chat(message, history, systemPrompt)

    // Determine if we should escalate
    const shouldEscalate = checkIfShouldEscalate(aiResponse, intent, history.length)
    
    if (shouldEscalate && intent.type !== 'escalate') {
      actions.push({
        type: 'offer_escalation',
        data: { reason: 'complex_query' }
      })
    }

    // Generate quick replies based on context and AI response
    quickReplies = generateQuickReplies(intent, searchResults, language, aiResponse)

    res.json({
      success: true,
      response: aiResponse,
      intent,
      actions,
      quickReplies,
      searchResults: searchResults?.products?.slice(0, 6) || null,
      sessionId: sessionId || `session_${Date.now()}`
    })

  } catch (error: any) {
    console.error("Chat error:", error)
    res.status(500).json({ 
      success: false,
      error: error.message || "Chat error",
      fallbackMessage: "Przepraszam, wystąpił błąd. Czy mogę połączyć Cię z naszym konsultantem?"
    })
  }
}

// GET /store/chat - Get chat context/suggestions
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const language = (req.query.language as string) || 'pl'
  
  const suggestions = language === 'pl' ? [
    "Szukam części do koparki CAT 320",
    "Pompa hydrauliczna do Komatsu PC200",
    "Sprawdź numer części 320-8134",
    "Filtry do ładowarki JCB",
    "Porozmawiaj z ekspertem"
  ] : [
    "Looking for parts for CAT 320 excavator",
    "Hydraulic pump for Komatsu PC200",
    "Check part number 320-8134",
    "Filters for JCB loader",
    "Talk to an expert"
  ]

  res.json({ suggestions })
}

// Helper functions
function analyzeIntent(message: string, language: string): { type: string; confidence: number; entities: any } {
  const lowerMessage = message.toLowerCase()
  
  // Check for escalation keywords
  const escalateKeywords = language === 'pl' 
    ? ['człowiek', 'konsultant', 'ekspert', 'pomoc', 'nie rozumiem', 'zadzwonić', 'telefon']
    : ['human', 'agent', 'expert', 'help', 'don\'t understand', 'call', 'phone']
  
  if (escalateKeywords.some(k => lowerMessage.includes(k))) {
    return { type: 'escalate', confidence: 0.9, entities: {} }
  }

  // Check for part number pattern
  const partNumberPattern = /\b(\d{2,4}[-_]?\d{3,5})\b/
  if (partNumberPattern.test(message)) {
    return { type: 'part_number', confidence: 0.95, entities: { partNumber: message.match(partNumberPattern)?.[1] } }
  }

  // Check for machine-related search
  const machineKeywords = ['cat', 'komatsu', 'hitachi', 'volvo', 'jcb', 'koparka', 'ładowarka', 'excavator', 'loader']
  if (machineKeywords.some(k => lowerMessage.includes(k))) {
    return { type: 'search_by_machine', confidence: 0.85, entities: {} }
  }

  // Check for compatibility check
  const compatKeywords = language === 'pl'
    ? ['pasuje', 'kompatybilny', 'czy będzie', 'dopasować']
    : ['fit', 'compatible', 'will it work', 'match']
  
  if (compatKeywords.some(k => lowerMessage.includes(k))) {
    return { type: 'compatibility', confidence: 0.8, entities: {} }
  }

  // Default to general search
  return { type: 'search_part', confidence: 0.7, entities: {} }
}

function extractMachineData(message: string, context?: any) {
  const lowerMessage = message.toLowerCase()
  
  const brands: Record<string, string> = {
    'cat': 'CAT', 'caterpillar': 'CAT',
    'komatsu': 'Komatsu',
    'hitachi': 'Hitachi',
    'volvo': 'Volvo',
    'jcb': 'JCB',
    'kobelco': 'Kobelco',
    'hyundai': 'Hyundai'
  }

  let brand = context?.manufacturer
  let model = context?.model
  let type = context?.machineType

  // Extract brand
  for (const [key, value] of Object.entries(brands)) {
    if (lowerMessage.includes(key)) {
      brand = value
      break
    }
  }

  // Extract model (e.g., 320D, PC200, ZX210)
  const modelPattern = /\b([a-z]{0,3}\d{2,4}[a-z]?)\b/gi
  const modelMatch = message.match(modelPattern)
  if (modelMatch) {
    model = modelMatch[0].toUpperCase()
  }

  // Extract type
  const types: Record<string, string> = {
    'koparka': 'excavator', 'excavator': 'excavator',
    'ładowarka': 'loader', 'loader': 'loader',
    'spychacz': 'dozer', 'dozer': 'dozer', 'bulldozer': 'dozer'
  }

  for (const [key, value] of Object.entries(types)) {
    if (lowerMessage.includes(key)) {
      type = value
      break
    }
  }

  return { brand, model, type }
}

function extractPartNumber(message: string): string | null {
  const pattern = /\b(\d{2,4}[-_]?\d{3,5})\b/
  const match = message.match(pattern)
  return match ? match[1] : null
}

function formatProductsForAI(products: any[]): string {
  if (!products || products.length === 0) return ''
  
  return products.map((p, i) => 
    `${i + 1}. ${p.title} (SKU: ${p.variants?.[0]?.sku || 'N/A'})`
  ).join('\n')
}


function buildSystemPrompt(language: string, productContext: string, intent: any): string {
  const basePrompt = language === 'pl' ? `
Jesteś wirtualnym asystentem sklepu OMEX specjalizującego się w częściach do maszyn budowlanych.

TWOJE ZADANIA:
1. Pomagasz klientom znaleźć odpowiednie części do ich maszyn
2. Odpowiadasz na pytania o produkty, dostępność i kompatybilność
3. Sugerujesz alternatywne części gdy oryginalne są niedostępne
4. Prowadzisz klienta przez proces wyszukiwania

ZASADY FORMATOWANIA:
- Odpowiadaj zwięźle (2-3 zdania)
- Gdy pytasz o wybór (np. typ filtra), ZAWSZE wymieniaj opcje jako listę numerowaną:
  1. Filtr oleju
  2. Filtr paliwa
  3. Filtr powietrza
  4. Filtr hydrauliczny
- Gdy polecasz produkty, podawaj ich nazwy w nawiasach kwadratowych: [Nazwa produktu]
- Gdy podajesz SKU, używaj formatu: (SKU: XXXXX)
- NIE używaj długich opisów - bądź konkretny

ZASADY ROZMOWY:
- Bądź pomocny, konkretny i profesjonalny
- Jeśli nie znasz odpowiedzi, zaproponuj połączenie z ekspertem
- Zawsze pytaj o szczegóły maszyny (marka, model) jeśli klient ich nie podał
- Gdy masz wyniki wyszukiwania, polecaj konkretne produkty z listy

PRZYKŁAD DOBREJ ODPOWIEDZI:
"Rozumiem, szukasz filtra do CAT 320. Jaki typ filtra Cię interesuje?
1. Filtr oleju
2. Filtr paliwa
3. Filtr powietrza
4. Filtr hydrauliczny"

${productContext ? `\nZNALEZIONE PRODUKTY W BAZIE:\n${productContext}\n\nPolecaj produkty z tej listy gdy pasują do zapytania klienta.` : ''}
` : `
You are a virtual assistant for OMEX store specializing in construction machinery parts.

YOUR TASKS:
1. Help customers find the right parts for their machines
2. Answer questions about products, availability and compatibility
3. Suggest alternative parts when originals are unavailable
4. Guide customers through the search process

FORMATTING RULES:
- Keep responses concise (2-3 sentences)
- When asking for choices (e.g., filter type), ALWAYS list options as numbered list:
  1. Oil filter
  2. Fuel filter
  3. Air filter
  4. Hydraulic filter
- When recommending products, use square brackets: [Product Name]
- When providing SKU, use format: (SKU: XXXXX)
- DON'T use long descriptions - be specific

CONVERSATION RULES:
- Be helpful, specific and professional
- If you don't know the answer, offer to connect with an expert
- Always ask for machine details (brand, model) if customer didn't provide them
- When you have search results, recommend specific products from the list

EXAMPLE OF GOOD RESPONSE:
"I understand you're looking for a filter for CAT 320. What type of filter do you need?
1. Oil filter
2. Fuel filter
3. Air filter
4. Hydraulic filter"

${productContext ? `\nPRODUCTS FOUND IN DATABASE:\n${productContext}\n\nRecommend products from this list when they match customer's query.` : ''}
`

  return basePrompt
}

function checkIfShouldEscalate(response: string, intent: any, historyLength: number): boolean {
  // Escalate if:
  // 1. Conversation is getting long without resolution
  // 2. AI response indicates uncertainty
  // 3. Complex technical question detected
  
  if (historyLength > 10) return true
  
  const uncertaintyPhrases = [
    'nie jestem pewien', 'nie wiem', 'trudno powiedzieć',
    'not sure', 'don\'t know', 'hard to say',
    'skontaktuj się', 'contact', 'zadzwoń'
  ]
  
  return uncertaintyPhrases.some(phrase => response.toLowerCase().includes(phrase))
}

function extractOptionsFromResponse(response: string): string[] {
  const options: string[] = []
  const lowerResponse = response.toLowerCase()
  
  // Extract numbered options (1. Filtr oleju, 2. Filtr paliwa)
  const lines = response.split('\n')
  for (const line of lines) {
    const numberedMatch = line.match(/^\s*\d+\.\s*(.+)$/)
    if (numberedMatch) {
      const option = numberedMatch[1].trim()
      // Keep short options (filter types, part names)
      if (option.length > 3 && option.length < 50) {
        options.push(option)
      }
    }
  }
  
  // Extract filter types mentioned in text (oleju, paliwa, powietrza, hydrauliczny)
  const filterKeywords: Record<string, string> = {
    'oleju': 'Filtr oleju',
    'paliwa': 'Filtr paliwa', 
    'powietrza': 'Filtr powietrza',
    'hydrauliczny': 'Filtr hydrauliczny',
    'hydrauliczn': 'Filtr hydrauliczny',
    'kabinowy': 'Filtr kabinowy',
    'oil': 'Oil filter',
    'fuel': 'Fuel filter',
    'air': 'Air filter',
    'hydraulic': 'Hydraulic filter',
    'cabin': 'Cabin filter'
  }
  
  for (const [keyword, label] of Object.entries(filterKeywords)) {
    if (lowerResponse.includes(keyword) && !options.some(o => o.toLowerCase() === label.toLowerCase())) {
      options.push(label)
    }
  }
  
  // Extract part types mentioned
  const partKeywords: Record<string, string> = {
    'pompa hydrauliczna': 'Pompa hydrauliczna',
    'pompa paliwa': 'Pompa paliwa',
    'uszczelka': 'Uszczelki',
    'łożysko': 'Łożyska',
    'pasek': 'Paski',
    'alternator': 'Alternator',
    'rozrusznik': 'Rozrusznik',
    'turbosprężarka': 'Turbosprężarka',
    'chłodnica': 'Chłodnica'
  }
  
  for (const [keyword, label] of Object.entries(partKeywords)) {
    if (lowerResponse.includes(keyword) && !options.some(o => o.toLowerCase() === label.toLowerCase())) {
      options.push(label)
    }
  }
  
  return [...new Set(options)].slice(0, 4) // Unique, max 4
}

function generateQuickReplies(intent: any, searchResults: any, language: string, aiResponse?: string): string[] {
  const replies: string[] = []
  
  // First, extract options from AI response if available
  if (aiResponse) {
    const extractedOptions = extractOptionsFromResponse(aiResponse)
    replies.push(...extractedOptions)
  }
  
  // Add standard replies if we have room
  if (language === 'pl') {
    if (searchResults?.products?.length > 0) {
      if (replies.length < 4) replies.push('Pokaż więcej wyników')
      if (replies.length < 4) replies.push('Sprawdź dostępność')
    } else if (replies.length === 0) {
      replies.push('Szukaj po numerze części')
      replies.push('Wybierz maszynę')
    }
    
    if (intent.type !== 'escalate' && replies.length < 4) {
      replies.push('Porozmawiaj z ekspertem')
    }
  } else {
    if (searchResults?.products?.length > 0) {
      if (replies.length < 4) replies.push('Show more results')
      if (replies.length < 4) replies.push('Check availability')
    } else if (replies.length === 0) {
      replies.push('Search by part number')
      replies.push('Select machine')
    }
    
    if (intent.type !== 'escalate') {
      replies.push('Talk to an expert')
    }
  }
  
  return replies.slice(0, 4)
}
