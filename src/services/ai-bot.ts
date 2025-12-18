import { GeminiService } from "./gemini.service"

// AI Bot z Gemini AI i kontekstem sklepu
export class AIBotService {
  private gemini: GeminiService
  private conversationHistory: Map<string, Array<{ role: 'user' | 'model'; content: string }>> = new Map()
  
  private knowledgeBase = {
    greeting: [
      "Witaj! Jestem asystentem OMEX. Jak mogę Ci pomóc?",
      "Cześć! W czym mogę Ci dzisiaj pomóc?",
    ],
    products: {
      keywords: ["produkt", "cena", "dostępność", "specyfikacja", "katalog", "część", "pompa", "filtr"],
      response: "Mogę pomóc Ci znaleźć produkty. Powiedz mi czego szukasz lub przejdź do katalogu produktów.",
    },
    orders: {
      keywords: ["zamówienie", "status", "śledzenie", "dostawa", "przesyłka"],
      response: "Aby sprawdzić status zamówienia, podaj numer zamówienia lub zaloguj się na swoje konto.",
    },
    payment: {
      keywords: ["płatność", "zapłacić", "przelew", "karta", "faktura"],
      response: "Akceptujemy płatności kartą, przelewem i przy odbiorze. Faktury VAT wystawiamy automatycznie.",
    },
    shipping: {
      keywords: ["wysyłka", "dostawa", "kurier", "paczka", "czas dostawy"],
      response: "Wysyłamy zamówienia w 24h. Dostawa kurierem trwa 1-2 dni robocze. Darmowa dostawa od 500 zł.",
    },
    returns: {
      keywords: ["zwrot", "reklamacja", "wymiana", "gwarancja"],
      response: "Masz 14 dni na zwrot produktu. Gwarancja wynosi 24 miesiące.",
    },
    contact: {
      keywords: ["kontakt", "telefon", "email", "adres", "biuro"],
      response: "📧 Email: kontakt@omex.pl\n📞 Tel: +48 123 456 789\n🕐 Pon-Pt: 8:00-16:00",
    },
    b2b: {
      keywords: ["hurtowy", "b2b", "firma", "nip", "rabat hurtowy"],
      response: "Oferujemy specjalne ceny dla firm! Zarejestruj konto B2B.",
    },
  }

  constructor() {
    this.gemini = new GeminiService()
  }

  async generateResponse(message: string, context?: any): Promise<string> {
    const lowerMessage = message.toLowerCase()
    const conversationId = context?.conversationId || 'default'

    // Powitanie - szybka odpowiedź bez AI
    if (this.isGreeting(lowerMessage)) {
      return this.knowledgeBase.greeting[Math.floor(Math.random() * this.knowledgeBase.greeting.length)]
    }

    // Spróbuj użyć Gemini AI
    try {
      const history = this.conversationHistory.get(conversationId) || []
      
      const systemPrompt = `Jesteś asystentem sklepu OMEX specjalizującego się w częściach do maszyn budowlanych (koparki, ładowarki, spycharki).

TWOJE ZADANIA:
- Pomagasz klientom znaleźć części do ich maszyn
- Odpowiadasz na pytania o produkty, dostępność i kompatybilność
- Sugerujesz alternatywne części
- Informujesz o dostawie, płatnościach, zwrotach

INFORMACJE O SKLEPIE:
- Wysyłka w 24h, dostawa 1-2 dni
- Darmowa dostawa od 500 zł
- 14 dni na zwrot, 24 miesiące gwarancji
- Płatność: karta, przelew, przy odbiorze
- Kontakt: kontakt@omex.pl, +48 123 456 789

ZASADY:
- Odpowiadaj krótko (2-3 zdania)
- Bądź pomocny i konkretny
- Jeśli nie wiesz, zaproponuj połączenie z konsultantem
- Pytaj o markę i model maszyny jeśli klient szuka części`

      const response = await this.gemini.chat(message, history, systemPrompt)
      
      // Zapisz historię
      history.push({ role: 'user', content: message })
      history.push({ role: 'model', content: response })
      this.conversationHistory.set(conversationId, history.slice(-20)) // Keep last 20 messages
      
      return response
    } catch (error) {
      console.error('Gemini AI error, falling back to rules:', error)
      
      // Fallback do prostych reguł
      for (const [category, data] of Object.entries(this.knowledgeBase)) {
        if (category === "greeting") continue
        
        const categoryData = data as { keywords: string[]; response: string }
        if (categoryData.keywords.some(keyword => lowerMessage.includes(keyword))) {
          return categoryData.response
        }
      }

      return "Rozumiem Twoje pytanie. Czy chcesz:\n1. Przejrzeć produkty\n2. Sprawdzić zamówienie\n3. Porozmawiać z konsultantem"
    }
  }

  private isGreeting(message: string): boolean {
    const greetings = ["cześć", "czesc", "witaj", "hej", "dzień dobry", "dzien dobry", "hello", "hi"]
    return greetings.some(g => message.includes(g))
  }

  async shouldEscalateToAgent(conversation: any): Promise<boolean> {
    // Eskaluj do agenta jeśli:
    // - Klient wyraźnie prosi o kontakt z człowiekiem
    // - Rozmowa trwa długo bez rozwiązania
    // - Wykryto frustrację
    
    const lastMessages = conversation.messages?.slice(-5) || []
    const messageContent = lastMessages.map((m: any) => m.content.toLowerCase()).join(" ")
    
    const escalationKeywords = [
      "konsultant", "człowiek", "agent", "pracownik",
      "nie pomaga", "nie rozumiesz", "chcę rozmawiać",
      "połącz mnie", "polacz mnie"
    ]
    
    return escalationKeywords.some(keyword => messageContent.includes(keyword))
  }

  async analyzeIntent(message: string): Promise<{
    intent: string
    confidence: number
    suggestedAction?: string
  }> {
    const lowerMessage = message.toLowerCase()
    
    // Prosta analiza intencji
    for (const [category, data] of Object.entries(this.knowledgeBase)) {
      if (category === "greeting") continue
      
      const categoryData = data as { keywords: string[] }
      const matchedKeywords = categoryData.keywords.filter(k => lowerMessage.includes(k))
      
      if (matchedKeywords.length > 0) {
        return {
          intent: category,
          confidence: matchedKeywords.length / categoryData.keywords.length,
          suggestedAction: `show_${category}_info`
        }
      }
    }
    
    return {
      intent: "unknown",
      confidence: 0,
      suggestedAction: "ask_clarification"
    }
  }
}
