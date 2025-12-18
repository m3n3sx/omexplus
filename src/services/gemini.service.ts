/**
 * Gemini AI Service
 * Integration with Google Gemini API for chat functionality
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
