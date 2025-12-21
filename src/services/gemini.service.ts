/**
 * Gemini AI Service
 * Integration with Google Gemini API for chat and vision functionality
 */

interface ChatMessage {
  role: 'user' | 'model'
  content: string
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{ text: string }>
      role: string
    }
    finishReason: string
  }>
}

interface ImageAnalysisResult {
  detectedPartType?: string
  partCategory?: string
  possibleBrands?: string[]
  ocrText?: string[]
  partNumbers?: string[]
  description?: string
  confidence: number
  suggestedSearchTerms?: string[]
}

export class GeminiService {
  private providedApiKey?: string
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta'
  private model = 'gemini-2.0-flash'

  constructor(apiKey?: string) {
    this.providedApiKey = apiKey
  }

  private get apiKey(): string {
    // Always read from env to support hot reload
    const key = this.providedApiKey || process.env.GEMINI_API_KEY || ''
    if (!key) {
      console.warn('Gemini API key not configured. Set GEMINI_API_KEY in .env')
    }
    return key
  }

  /**
   * Analyze image of a machine part using Gemini Vision
   */
  async analyzePartImage(imageBase64: string, mimeType: string = 'image/jpeg'): Promise<ImageAnalysisResult> {
    if (!this.apiKey) {
      throw new Error('Gemini API key is not configured')
    }

    const url = `${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`

    const systemPrompt = `Jesteś ekspertem od części do maszyn budowlanych (koparki, ładowarki, spycharki, walce).
Analizujesz zdjęcia części i identyfikujesz je.

TWOJE ZADANIE:
1. Zidentyfikuj typ części na zdjęciu
2. Odczytaj wszelkie numery katalogowe, kody, napisy (OCR)
3. Określ możliwe marki/producentów
4. Zasugeruj terminy wyszukiwania

ODPOWIEDZ W FORMACIE JSON (bez markdown, tylko czysty JSON):
{
  "detectedPartType": "typ części po polsku (np. filtr oleju, pompa hydrauliczna, cylinder, gąsienica)",
  "partCategory": "kategoria (filters/hydraulics/engine/undercarriage/electrical/cabin)",
  "possibleBrands": ["lista możliwych marek"],
  "ocrText": ["wszystkie odczytane teksty z obrazu"],
  "partNumbers": ["wykryte numery katalogowe w formacie XXX-XXXX lub podobnym"],
  "description": "krótki opis części po polsku",
  "confidence": 0.0-1.0,
  "suggestedSearchTerms": ["sugerowane terminy wyszukiwania po polsku"]
}

ZNANE MARKI: CAT, Caterpillar, Komatsu, Hitachi, Volvo, JCB, Kobelco, Hyundai, Doosan, Liebherr, Case, Bobcat, Parker, Rexroth, Bosch, Perkins, Yanmar

TYPY CZĘŚCI:
- Filtry: filtr oleju, filtr paliwa, filtr powietrza, filtr hydrauliczny
- Hydraulika: pompa hydrauliczna, cylinder hydrauliczny, zawór, rozdzielacz
- Silnik: turbosprężarka, alternator, rozrusznik, wtryskiwacz
- Podwozie: gąsienica, rolka, koło napędowe, napinacz
- Elektryka: czujnik, przekaźnik, wiązka przewodów
- Kabina: fotel, joystick, panel sterowania`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              { text: systemPrompt },
            ]
          },
          {
            role: 'model',
            parts: [{ text: 'Rozumiem. Przeanalizuję zdjęcie części i zwrócę wynik w formacie JSON.' }]
          },
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType: mimeType,
                  data: imageBase64
                }
              },
              { text: 'Przeanalizuj to zdjęcie części do maszyny budowlanej. Zidentyfikuj część, odczytaj numery i zasugeruj wyszukiwanie.' }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Gemini Vision API error:', error)
      throw new Error(`Gemini Vision API error: ${response.status}`)
    }

    const data: GeminiResponse = await response.json()

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response from Gemini Vision')
    }

    const text = data.candidates[0].content.parts
      .map(part => part.text)
      .join('')

    // Parse JSON response
    try {
      let cleanResponse = text.trim()
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

      const parsed = JSON.parse(cleanResponse) as ImageAnalysisResult
      return {
        ...parsed,
        confidence: parsed.confidence || 0.7
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini Vision response:', text)
      // Return basic result
      return {
        description: text.slice(0, 200),
        confidence: 0.3,
        suggestedSearchTerms: []
      }
    }
  }

  /**
   * Send a chat message and get a response
   */
  async chat(
    message: string,
    history: ChatMessage[] = [],
    systemPrompt?: string
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Gemini API key is not configured')
    }

    const url = `${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`

    // Build contents array with history
    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = []

    // Add system instruction if provided
    if (systemPrompt) {
      contents.push({
        role: 'user',
        parts: [{ text: `System: ${systemPrompt}` }]
      })
      contents.push({
        role: 'model',
        parts: [{ text: 'Understood. I will follow these instructions.' }]
      })
    }

    // Add conversation history
    for (const msg of history) {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      })
    }

    // Add current message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    })

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        ]
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Gemini API error:', error)
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data: GeminiResponse = await response.json()

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response from Gemini')
    }

    const text = data.candidates[0].content.parts
      .map(part => part.text)
      .join('')

    return text
  }

  /**
   * Generate product description
   */
  async generateProductDescription(
    productName: string,
    category?: string,
    features?: string[]
  ): Promise<string> {
    const prompt = `Napisz krótki, atrakcyjny opis produktu dla sklepu internetowego.
Produkt: ${productName}
${category ? `Kategoria: ${category}` : ''}
${features?.length ? `Cechy: ${features.join(', ')}` : ''}

Opis powinien być:
- Zwięzły (2-3 zdania)
- Zachęcający do zakupu
- Profesjonalny
- W języku polskim`

    return this.chat(prompt)
  }

  /**
   * Answer customer question about products
   */
  async answerProductQuestion(
    question: string,
    productContext?: string
  ): Promise<string> {
    const systemPrompt = `Jesteś pomocnym asystentem sklepu internetowego OMEX. 
Odpowiadasz na pytania klientów dotyczące produktów i zamówień.
Bądź uprzejmy, konkretny i pomocny.
${productContext ? `Kontekst produktu: ${productContext}` : ''}`

    return this.chat(question, [], systemPrompt)
  }

  /**
   * Translate text using Gemini
   */
  async translate(
    text: string,
    targetLanguage: string,
    sourceLanguage: string = 'pl'
  ): Promise<string> {
    const prompt = `Przetłumacz poniższy tekst z języka ${sourceLanguage} na ${targetLanguage}. 
Zwróć tylko przetłumaczony tekst, bez dodatkowych komentarzy.

Tekst do tłumaczenia:
${text}`

    return this.chat(prompt)
  }
}

// Singleton instance
export const geminiService = new GeminiService()
