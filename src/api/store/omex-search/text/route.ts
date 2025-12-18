/**
 * METHOD 4: Text Search (Natural Language)
 * GET /store/omex-search/text
 * 
 * Supports AI-enhanced search with Gemini for better query understanding
 */

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import AdvancedSearchService from "../../../../modules/omex-search/advanced-search.service"
import { GeminiService } from "../../../../services/gemini.service"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const advancedSearchService = new AdvancedSearchService({ container_: req.scope } as any)

  try {
    const { 
      q,
      query, 
      language = 'pl', 
      fuzzy = 'true',
      ai = 'false' // Enable AI-enhanced search
    } = req.query

    const searchQuery = (q || query) as string

    if (!searchQuery) {
      return res.status(400).json({
        error: "Search query is required",
        example: "/store/omex-search/text?q=pompa hydrauliczna do komatsu pc200",
        examples: [
          "pompa hydrauliczna do komatsu pc200",
          "filtr oleju cat 320d",
          "gąsienice do hitachi zx210",
          "młot hydrauliczny 3 tony",
          "320-8134",
        ],
      })
    }

    let enhancedQuery = searchQuery
    let aiAnalysis: any = null

    // AI-enhanced search
    if (ai === 'true') {
      try {
        const gemini = new GeminiService()
        const aiResponse = await gemini.chat(
          `Zoptymalizuj to zapytanie wyszukiwania części do maszyn budowlanych: "${searchQuery}". 
           Odpowiedz TYLKO zoptymalizowanym zapytaniem, bez wyjaśnień. 
           Dodaj synonimy i powiązane terminy jeśli to pomoże w wyszukiwaniu.`,
          [],
          'Jesteś ekspertem od części do maszyn budowlanych. Optymalizujesz zapytania wyszukiwania.'
        )
        
        if (aiResponse && aiResponse.length < 200) {
          enhancedQuery = aiResponse.trim()
          aiAnalysis = {
            originalQuery: searchQuery,
            enhancedQuery: enhancedQuery,
            aiEnhanced: true
          }
        }
      } catch (aiError) {
        console.error('AI enhancement failed, using original query:', aiError)
      }
    }

    const result = await advancedSearchService.searchByText({
      query: enhancedQuery,
      language: language as 'pl' | 'en' | 'de' | 'uk',
      fuzzy: fuzzy === 'true',
    })

    // Add AI analysis to response if available
    const response = {
      ...result,
      ...(aiAnalysis ? { aiAnalysis } : {})
    }

    res.json(response)
  } catch (error: any) {
    res.status(500).json({
      error: "Text search failed",
      message: error.message,
    })
  }
}
