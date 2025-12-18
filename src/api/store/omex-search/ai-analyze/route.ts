/**
 * AI-Powered Search Analysis Endpoint
 * POST /store/omex-search/ai-analyze - Analyze search query with Gemini
 * 
 * Uses Gemini to:
 * 1. Parse natural language queries
 * 2. Extract machine brand, model, part type
 * 3. Suggest search refinements
 * 4. Provide intelligent autocomplete
 */

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { GeminiService } from "../../../../services/gemini.service"

interface AIAnalyzeRequest {
  query: string
  language?: string
  context?: {
    previousSearches?: string[]
    selectedBrand?: string
    selectedModel?: string
  }
}

interface ParsedSearchQuery {
  brand?: string
  model?: string
  machineType?: string
  partType?: string
  partNumber?: string
  keywords: string[]
  intent: 'search_part' | 'search_machine' | 'part_number' | 'general'
  confidence: number
  suggestions: string[]
  refinedQuery: string
}

// POST /store/omex-search/ai-analyze
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { query, language = 'pl', context } = req.body as AIAnalyzeRequest

    if (!query || query.trim().length < 2) {
      return res.status(400).json({ error: "Query must be at least 2 characters" })
    }

    const gemini = new GeminiService()

    // Build prompt for Gemini
    const systemPrompt = `Jesteś ekspertem od części do maszyn budowlanych. Analizujesz zapytania wyszukiwania użytkowników.

TWOJE ZADANIE:
Przeanalizuj zapytanie użytkownika i wyodrębnij strukturalne informacje.

ODPOWIEDZ W FORMACIE JSON (bez markdown, tylko czysty JSON):
{
  "brand": "marka maszyny lub null",
  "model": "model maszyny lub null", 
  "machineType": "typ maszyny (excavator/loader/dozer) lub null",
  "partType": "typ części (filter/pump/cylinder/track) lub null",
  "partNumber": "numer katalogowy jeśli wykryty lub null",
  "keywords": ["lista", "słów", "kluczowych"],
  "intent": "search_part lub search_machine lub part_number lub general",
  "confidence": 0.0-1.0,
  "suggestions": ["sugestia 1", "sugestia 2", "sugestia 3"],
  "refinedQuery": "zoptymalizowane zapytanie do wyszukiwania"
}

ZNANE MARKI: CAT, Caterpillar, Komatsu, Hitachi, Volvo, JCB, Kobelco, Hyundai, Doosan, Liebherr, Case, Bobcat
TYPY MASZYN: koparka (excavator), ładowarka (loader), spychacz (dozer), walec (roller)
TYPY CZĘŚCI: filtr (filter), pompa (pump), cylinder (cylinder), gąsienica (track), uszczelka (seal), łożysko (bearing)

PRZYKŁADY:
Zapytanie: "filtr oleju cat 320"
Odpowiedź: {"brand":"CAT","model":"320","machineType":"excavator","partType":"filter","partNumber":null,"keywords":["filtr","oleju","cat","320"],"intent":"search_part","confidence":0.95,"suggestions":["Filtr oleju silnikowego CAT 320","Filtr oleju hydraulicznego CAT 320","Filtr oleju skrzyni CAT 320"],"refinedQuery":"filtr oleju CAT 320 koparka"}

Zapytanie: "320-8134"
Odpowiedź: {"brand":"CAT","model":null,"machineType":null,"partType":"filter","partNumber":"320-8134","keywords":["320-8134"],"intent":"part_number","confidence":0.98,"suggestions":["Filtr CAT 320-8134","Zamiennik 320-8134","Alternatywy dla 320-8134"],"refinedQuery":"320-8134 CAT filtr"}

${context?.selectedBrand ? `Kontekst: Użytkownik wcześniej wybrał markę ${context.selectedBrand}` : ''}
${context?.selectedModel ? `Kontekst: Użytkownik wcześniej wybrał model ${context.selectedModel}` : ''}`

    const userMessage = `Przeanalizuj zapytanie: "${query}"`

    // Get AI analysis
    const aiResponse = await gemini.chat(userMessage, [], systemPrompt)

    // Parse JSON response
    let parsed: ParsedSearchQuery
    try {
      // Clean response - remove markdown code blocks if present
      let cleanResponse = aiResponse.trim()
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse.slice(7)
      }
      if (cleanResponse.startsWith('```')) {
        cleanResponse = cleanResponse.slice(3)
      }
      if (cleanResponse.endsWith('```')) {
        cleanResponse = cleanResponse.slice(0, -3)
      }
      cleanResponse = cleanResponse.trim()

      parsed = JSON.parse(cleanResponse)
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse)
      // Fallback to basic parsing
      parsed = basicQueryParsing(query)
    }

    // Validate and enhance parsed data
    parsed = validateAndEnhance(parsed, query)

    res.json({
      success: true,
      query,
      analysis: parsed,
      searchParams: buildSearchParams(parsed)
    })

  } catch (error: any) {
    console.error("AI analyze error:", error)
    
    // Fallback to basic parsing on error
    const query = (req.body as AIAnalyzeRequest)?.query || ''
    const fallback = basicQueryParsing(query)
    
    res.json({
      success: true,
      query,
      analysis: fallback,
      searchParams: buildSearchParams(fallback),
      fallback: true
    })
  }
}

// Basic query parsing without AI
function basicQueryParsing(query: string): ParsedSearchQuery {
  const lowerQuery = query.toLowerCase()
  
  // Detect brand
  const brands: Record<string, string> = {
    'cat': 'CAT', 'caterpillar': 'CAT',
    'komatsu': 'Komatsu',
    'hitachi': 'Hitachi',
    'volvo': 'Volvo',
    'jcb': 'JCB',
    'kobelco': 'Kobelco',
    'hyundai': 'Hyundai',
    'doosan': 'Doosan',
    'liebherr': 'Liebherr',
    'case': 'Case',
    'bobcat': 'Bobcat'
  }

  let brand: string | undefined
  for (const [key, value] of Object.entries(brands)) {
    if (lowerQuery.includes(key)) {
      brand = value
      break
    }
  }

  // Detect model
  const modelPattern = /\b([a-z]{0,3}\d{2,4}[a-z]?(?:[-]\d+)?)\b/gi
  const modelMatch = query.match(modelPattern)
  const model = modelMatch ? modelMatch[0].toUpperCase() : undefined

  // Detect part number
  const partNumberPattern = /\b(\d{2,4}[-_]?\d{3,5})\b/
  const partNumberMatch = query.match(partNumberPattern)
  const partNumber = partNumberMatch ? partNumberMatch[1] : undefined

  // Detect part type
  const partTypes: Record<string, string> = {
    'filtr': 'filter', 'filter': 'filter',
    'pompa': 'pump', 'pump': 'pump',
    'cylinder': 'cylinder',
    'gąsienica': 'track', 'track': 'track',
    'uszczelka': 'seal', 'seal': 'seal',
    'łożysko': 'bearing', 'bearing': 'bearing'
  }

  let partType: string | undefined
  for (const [key, value] of Object.entries(partTypes)) {
    if (lowerQuery.includes(key)) {
      partType = value
      break
    }
  }

  // Detect machine type
  const machineTypes: Record<string, string> = {
    'koparka': 'excavator', 'excavator': 'excavator',
    'ładowarka': 'loader', 'loader': 'loader',
    'spychacz': 'dozer', 'dozer': 'dozer'
  }

  let machineType: string | undefined
  for (const [key, value] of Object.entries(machineTypes)) {
    if (lowerQuery.includes(key)) {
      machineType = value
      break
    }
  }

  // Determine intent
  let intent: ParsedSearchQuery['intent'] = 'general'
  if (partNumber) {
    intent = 'part_number'
  } else if (brand && model) {
    intent = 'search_machine'
  } else if (partType) {
    intent = 'search_part'
  }

  // Build keywords
  const keywords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2)

  return {
    brand,
    model,
    machineType,
    partType,
    partNumber,
    keywords,
    intent,
    confidence: 0.6,
    suggestions: [],
    refinedQuery: query
  }
}

// Validate and enhance parsed data
function validateAndEnhance(parsed: ParsedSearchQuery, originalQuery: string): ParsedSearchQuery {
  // Ensure required fields
  if (!parsed.keywords || !Array.isArray(parsed.keywords)) {
    parsed.keywords = originalQuery.toLowerCase().split(/\s+/).filter(w => w.length > 2)
  }
  
  if (!parsed.intent) {
    parsed.intent = 'general'
  }
  
  if (typeof parsed.confidence !== 'number') {
    parsed.confidence = 0.5
  }
  
  if (!parsed.suggestions || !Array.isArray(parsed.suggestions)) {
    parsed.suggestions = []
  }
  
  if (!parsed.refinedQuery) {
    parsed.refinedQuery = originalQuery
  }

  return parsed
}

// Build search parameters from parsed query
function buildSearchParams(parsed: ParsedSearchQuery): Record<string, any> {
  const params: Record<string, any> = {
    q: parsed.refinedQuery
  }

  if (parsed.brand) {
    params.brand = parsed.brand
  }
  
  if (parsed.model) {
    params.model = parsed.model
  }
  
  if (parsed.machineType) {
    params.machineType = parsed.machineType
  }
  
  if (parsed.partType) {
    params.partType = parsed.partType
  }
  
  if (parsed.partNumber) {
    params.partNumber = parsed.partNumber
  }

  return params
}
