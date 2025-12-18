/**
 * AI Assistant Service
 * Handles conversation logic, intent detection, and context management
 */

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface Intent {
  name: string
  confidence: number
  action: string
  metadata: any
}

interface AssistantContext {
  customerId?: string
  sessionId: string
  language: string
  currentMachine?: {
    type?: string
    manufacturer?: string
    model?: string
  }
  conversationHistory: Message[]
  lastIntent?: string
}

export class AIAssistantService {
  private manager: any
  private systemPrompt: string

  constructor(manager: any) {
    this.manager = manager
    this.systemPrompt = this.getSystemPrompt()
  }

  /**
   * Process user message and generate response
   */
  async processMessage(
    message: string,
    context: AssistantContext
  ): Promise<{
    response: string
    intent: Intent
    actions: any[]
    quickReplies: string[]
  }> {
    // 1. Detect intent
    const intent = await this.detectIntent(message, context)

    // 2. Extract entities (machine info, part names, etc.)
    const entities = await this.extractEntities(message, context)

    // 3. Update context with extracted info
    if (entities.machine) {
      context.currentMachine = { ...context.currentMachine, ...entities.machine }
    }

    // 4. Generate response based on intent
    const response = await this.generateResponse(message, intent, context, entities)

    // 5. Determine actions to take
    const actions = await this.determineActions(intent, entities, context)

    // 6. Get quick replies for next interaction
    const quickReplies = await this.getQuickReplies(intent.name, context.language)

    return {
      response,
      intent,
      actions,
      quickReplies
    }
  }

  /**
   * Detect user intent from message
   */
  async detectIntent(message: string, context: AssistantContext): Promise<Intent> {
    const lowerMessage = message.toLowerCase()

    // Get all intent mappings
    const intents = await this.manager.query(`
      SELECT intent_name, patterns, keywords, confidence_threshold, action, metadata
      FROM intent_mappings
      ORDER BY confidence_threshold DESC
    `)

    let bestMatch: Intent = {
      name: 'GENERAL_HELP',
      confidence: 50,
      action: 'provide_guidance',
      metadata: {}
    }

    for (const intent of intents) {
      let score = 0
      let matches = 0

      // Check pattern matches
      for (const pattern of intent.patterns) {
        if (lowerMessage.includes(pattern.toLowerCase())) {
          score += 30
          matches++
        }
      }

      // Check keyword matches
      for (const keyword of intent.keywords) {
        if (lowerMessage.includes(keyword.toLowerCase())) {
          score += 10
          matches++
        }
      }

      // Calculate confidence
      const confidence = Math.min(100, score + (matches * 5))

      if (confidence > bestMatch.confidence && confidence >= intent.confidence_threshold) {
        bestMatch = {
          name: intent.intent_name,
          confidence,
          action: intent.action,
          metadata: intent.metadata || {}
        }
      }
    }

    return bestMatch
  }

  /**
   * Extract entities from message (machine info, part names, etc.)
   */
  async extractEntities(message: string, context: AssistantContext): Promise<any> {
    const entities: any = {}

    // Extract machine type
    const machineTypes = await this.manager.query(`
      SELECT id, name, name_pl FROM machine_types
    `)
    for (const type of machineTypes) {
      if (
        message.toLowerCase().includes(type.name.toLowerCase()) ||
        message.toLowerCase().includes(type.name_pl?.toLowerCase())
      ) {
        entities.machine = { ...entities.machine, type: type.id }
      }
    }

    // Extract manufacturer
    const manufacturers = await this.manager.query(`
      SELECT id, name FROM manufacturers
    `)
    for (const mfr of manufacturers) {
      if (message.toLowerCase().includes(mfr.name.toLowerCase())) {
        entities.machine = { ...entities.machine, manufacturer: mfr.id }
      }
    }

    // Extract model
    const models = await this.manager.query(`
      SELECT id, name FROM machine_models
    `)
    for (const model of models) {
      if (message.toLowerCase().includes(model.name.toLowerCase())) {
        entities.machine = { ...entities.machine, model: model.id }
      }
    }

    // Extract symptoms
    const symptoms = await this.manager.query(`
      SELECT symptom_text, symptom_text_pl, category, subcategory
      FROM symptom_mappings
    `)
    for (const symptom of symptoms) {
      if (
        message.toLowerCase().includes(symptom.symptom_text.toLowerCase()) ||
        message.toLowerCase().includes(symptom.symptom_text_pl?.toLowerCase())
      ) {
        entities.symptom = {
          text: symptom.symptom_text,
          category: symptom.category,
          subcategory: symptom.subcategory
        }
      }
    }

    return entities
  }

  /**
   * Generate AI response
   */
  async generateResponse(
    message: string,
    intent: Intent,
    context: AssistantContext,
    entities: any
  ): Promise<string> {
    const lang = context.language

    switch (intent.name) {
      case 'SEARCH_GUIDE':
        return this.generateSearchGuideResponse(entities, lang)

      case 'TECHNICAL_ISSUE':
        return this.generateTechnicalIssueResponse(entities, lang)

      case 'COMPATIBILITY_CHECK':
        return this.generateCompatibilityResponse(entities, context, lang)

      case 'PRODUCT_INQUIRY':
        return this.generateProductInquiryResponse(entities, lang)

      case 'PRICE_INQUIRY':
        return this.generatePriceInquiryResponse(entities, lang)

      case 'REORDER':
        return this.generateReorderResponse(context, lang)

      case 'RECOMMENDATION':
        return this.generateRecommendationResponse(context, lang)

      case 'MAINTENANCE_ADVICE':
        return this.generateMaintenanceAdviceResponse(entities, lang)

      case 'ESCALATE':
        return this.generateEscalationResponse(lang)

      default:
        return this.generateGeneralHelpResponse(lang)
    }
  }

  /**
   * Response generators for each intent
   */
  private generateSearchGuideResponse(entities: any, lang: string): string {
    if (lang === 'pl') {
      if (entities.machine?.model) {
        return `Świetnie! Masz ${entities.machine.model}. Teraz powiedz mi - jaki jest problem? (np. "pompa przecieka", "brak mocy")`
      }
      if (entities.machine?.manufacturer) {
        return `Rozumiem, masz maszynę ${entities.machine.manufacturer}. Jaki to model? (np. 320D, PC200)`
      }
      if (entities.machine?.type) {
        return `Okej, szukasz części do koparki. Jaki producent? (CAT, Komatsu, JCB, etc.)`
      }
      return `Pomogę Ci znaleźć odpowiednią część! Zacznijmy od początku - jaki typ maszyny posiadasz? (koparka, ładowarka, dźwig, etc.)`
    }

    // English
    if (entities.machine?.model) {
      return `Great! You have a ${entities.machine.model}. Now tell me - what's the issue? (e.g., "pump leaking", "no power")`
    }
    if (entities.machine?.manufacturer) {
      return `I understand you have a ${entities.machine.manufacturer} machine. Which model? (e.g., 320D, PC200)`
    }
    if (entities.machine?.type) {
      return `Okay, you're looking for excavator parts. Which manufacturer? (CAT, Komatsu, JCB, etc.)`
    }
    return `I'll help you find the right part! Let's start - what type of machine do you have? (excavator, loader, crane, etc.)`
  }

  private generateTechnicalIssueResponse(entities: any, lang: string): string {
    if (lang === 'pl') {
      if (entities.symptom) {
        return `Rozumiem problem: "${entities.symptom.text}". To wskazuje na kategorię: ${entities.symptom.category}. Uruchamiam wyszukiwanie kompatybilnych części...`
      }
      return `Przykro mi słyszeć o problemie. Opisz dokładniej co się dzieje, a pomogę zdiagnozować i znaleźć odpowiednią część.`
    }

    if (entities.symptom) {
      return `I understand the issue: "${entities.symptom.text}". This points to category: ${entities.symptom.category}. Launching search for compatible parts...`
    }
    return `Sorry to hear about the problem. Describe exactly what's happening, and I'll help diagnose and find the right part.`
  }

  private generateCompatibilityResponse(entities: any, context: AssistantContext, lang: string): string {
    if (lang === 'pl') {
      if (context.currentMachine?.model) {
        return `Sprawdzam kompatybilność dla ${context.currentMachine.model}... Moment.`
      }
      return `Aby sprawdzić kompatybilność, potrzebuję znać model Twojej maszyny. Jaki to model?`
    }

    if (context.currentMachine?.model) {
      return `Checking compatibility for ${context.currentMachine.model}... One moment.`
    }
    return `To check compatibility, I need to know your machine model. Which model do you have?`
  }

  private generateProductInquiryResponse(entities: any, lang: string): string {
    return lang === 'pl'
      ? `Chętnie opowiem o tym produkcie. Który produkt Cię interesuje? Możesz podać nazwę lub numer części.`
      : `I'd be happy to tell you about that product. Which product are you interested in? You can provide the name or part number.`
  }

  private generatePriceInquiryResponse(entities: any, lang: string): string {
    return lang === 'pl'
      ? `Sprawdzam ceny... Oferujemy 3 opcje: Oryginalne (najwyższa jakość), Kompatybilne (dobry stosunek ceny do jakości), Budżetowe (podstawowa funkcjonalność). Którą opcję chcesz zobaczyć?`
      : `Checking prices... We offer 3 options: Original (highest quality), Compatible (good value), Budget (basic functionality). Which option would you like to see?`
  }

  private generateReorderResponse(context: AssistantContext, lang: string): string {
    return lang === 'pl'
      ? `Sprawdzam Twoje poprzednie zamówienia... Czy chcesz zamówić te same części ponownie?`
      : `Checking your previous orders... Would you like to reorder the same parts?`
  }

  private generateRecommendationResponse(context: AssistantContext, lang: string): string {
    if (lang === 'pl') {
      return context.currentMachine?.model
        ? `Na podstawie Twojej maszyny ${context.currentMachine.model}, polecam sprawdzenie tych części...`
        : `Chętnie doradzę! Najpierw powiedz mi - jaki model maszyny posiadasz?`
    }
    return context.currentMachine?.model
      ? `Based on your ${context.currentMachine.model}, I recommend checking these parts...`
      : `I'd be happy to advise! First tell me - which machine model do you have?`
  }

  private generateMaintenanceAdviceResponse(entities: any, lang: string): string {
    return lang === 'pl'
      ? `Świetne pytanie o konserwację! Dla części hydraulicznych zalecam wymianę co 5000 godzin pracy lub przy pierwszych oznakach zużycia (przecieki, utrata ciśnienia). Chcesz zobaczyć zestaw konserwacyjny?`
      : `Great question about maintenance! For hydraulic parts, I recommend replacement every 5000 operating hours or at first signs of wear (leaks, pressure loss). Want to see a maintenance kit?`
  }

  private generateEscalationResponse(lang: string): string {
    return lang === 'pl'
      ? `Rozumiem, że potrzebujesz pomocy eksperta. Łączę Cię z naszym specjalistą. Średni czas oczekiwania: 2-3 minuty. Możesz też zadzwonić: +48 123 456 789`
      : `I understand you need expert help. Connecting you with our specialist. Average wait time: 2-3 minutes. You can also call: +48 123 456 789`
  }

  private generateGeneralHelpResponse(lang: string): string {
    return lang === 'pl'
      ? `Jestem tutaj, aby pomóc! Mogę: 1) Pomóc znaleźć części, 2) Sprawdzić kompatybilność, 3) Odpowiedzieć na pytania techniczne, 4) Pokazać Twoje poprzednie zamówienia. Co Cię interesuje?`
      : `I'm here to help! I can: 1) Help find parts, 2) Check compatibility, 3) Answer technical questions, 4) Show your previous orders. What interests you?`
  }

  /**
   * Determine actions to take based on intent
   */
  private async determineActions(intent: Intent, entities: any, context: AssistantContext): Promise<any[]> {
    const actions: any[] = []

    switch (intent.name) {
      case 'SEARCH_GUIDE':
        if (entities.machine?.model && entities.symptom) {
          actions.push({
            type: 'launch_search',
            data: {
              machineModel: entities.machine.model,
              category: entities.symptom.category,
              autoFill: true
            }
          })
        } else if (entities.machine) {
          actions.push({
            type: 'prefill_search',
            data: entities.machine
          })
        }
        break

      case 'COMPATIBILITY_CHECK':
        if (context.currentMachine?.model) {
          actions.push({
            type: 'validate_compatibility',
            data: {
              machineModel: context.currentMachine.model
            }
          })
        }
        break

      case 'REORDER':
        actions.push({
          type: 'show_order_history',
          data: { customerId: context.customerId }
        })
        break

      case 'ESCALATE':
        actions.push({
          type: 'escalate_to_human',
          data: { priority: 'medium' }
        })
        break
    }

    return actions
  }

  /**
   * Get quick reply suggestions
   */
  private async getQuickReplies(intent: string, language: string): Promise<string[]> {
    const field = language === 'pl' ? 'reply_text_pl' : 'reply_text'
    
    const replies = await this.manager.query(`
      SELECT ${field} as text
      FROM quick_replies
      WHERE intent = $1
      ORDER BY display_order
      LIMIT 4
    `, [intent])

    return replies.map((r: any) => r.text)
  }

  /**
   * System prompt for AI
   */
  private getSystemPrompt(): string {
    return `You are a helpful AI assistant for a B2B machinery parts shop.

Your role:
- Help customers find the right parts for their machinery
- Answer technical questions about compatibility and specifications
- Provide maintenance advice
- Be friendly but professional
- Never be pushy about sales
- Escalate to human support when needed

Your knowledge:
- Machinery types: excavators, loaders, cranes, bulldozers, forklifts
- Major brands: CAT, Komatsu, JCB, Volvo, Hitachi, Liebherr
- Part categories: hydraulics, engine, electrical, brakes, filters
- Compatibility rules and specifications

Your personality:
- Helpful and patient
- Expert but not condescending
- Honest about limitations
- Slightly Polish accent in language (even in English)

Guidelines:
- Always ask for machine model before suggesting parts
- Validate compatibility before recommending
- Offer 3 options: Original, Compatible, Budget
- Suggest related parts (seals, hoses, filters)
- Remind about maintenance schedules
- Be honest if you don't know something

Language:
- Respond in the same language as the customer
- Support Polish and English
- Use simple, clear language (not too technical)
`
  }

  /**
   * Save conversation to database
   */
  async saveConversation(
    conversationId: string,
    message: Message,
    intent: Intent
  ): Promise<void> {
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    await this.manager.query(`
      INSERT INTO conversation_messages (id, conversation_id, role, content, intent, confidence, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
    `, [messageId, conversationId, message.role, message.content, intent.name, intent.confidence])

    // Update conversation last_message_at
    await this.manager.query(`
      UPDATE conversations
      SET last_message_at = NOW()
      WHERE id = $1
    `, [conversationId])
  }

  /**
   * Get conversation history
   */
  async getConversationHistory(conversationId: string): Promise<Message[]> {
    const messages = await this.manager.query(`
      SELECT role, content
      FROM conversation_messages
      WHERE conversation_id = $1
      ORDER BY created_at ASC
      LIMIT 50
    `, [conversationId])

    return messages
  }

  /**
   * Remember customer's machine
   */
  async rememberMachine(customerId: string, machineData: any): Promise<void> {
    const id = `cm_${Date.now()}`

    await this.manager.query(`
      INSERT INTO customer_machines (
        id, customer_id, machine_type_id, manufacturer_id, 
        machine_model_id, is_primary, created_at
      )
      VALUES ($1, $2, $3, $4, $5, true, NOW())
      ON CONFLICT (customer_id, machine_model_id) 
      DO UPDATE SET last_mentioned_at = NOW()
    `, [id, customerId, machineData.type, machineData.manufacturer, machineData.model])
  }
}
