import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { GeminiService } from "../../../services/gemini.service"

interface ChatMessage {
  role: 'user' | 'model'
  content: string
}

// POST /admin/chat - send message to AI chat
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { message, history = [], context } = req.body as {
      message: string
      history?: ChatMessage[]
      context?: string
    }

    if (!message) {
      return res.status(400).json({ error: "Message is required" })
    }

    const gemini = new GeminiService()

    const systemPrompt = `Jesteś asystentem AI dla panelu administracyjnego sklepu OMEX.
Pomagasz administratorom w:
- Zarządzaniu produktami i kategoriami
- Analizie zamówień i sprzedaży
- Tworzeniu opisów produktów
- Odpowiadaniu na pytania dotyczące funkcji systemu
- Tłumaczeniu treści

Bądź pomocny, konkretny i profesjonalny. Odpowiadaj po polsku, chyba że użytkownik poprosi o inny język.
${context ? `\nDodatkowy kontekst: ${context}` : ''}`

    const response = await gemini.chat(message, history, systemPrompt)

    res.json({
      message: response,
      role: 'model'
    })
  } catch (error: any) {
    console.error("Chat error:", error)
    res.status(500).json({ error: error.message || "Chat error" })
  }
}

// GET /admin/chat/suggestions - get suggested prompts
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const suggestions = [
    "Napisz opis produktu dla...",
    "Jak dodać nowy produkt?",
    "Pokaż statystyki sprzedaży",
    "Przetłumacz tekst na angielski",
    "Jak zarządzać zamówieniami?",
    "Pomóż mi z kategoryzacją produktów",
  ]

  res.json({ suggestions })
}
