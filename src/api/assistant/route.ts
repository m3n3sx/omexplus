import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { AIAssistantService } from "../../services/ai-assistant.service"

/**
 * AI Assistant API Routes
 * Handles chat messages, context, intent detection, and escalation
 */

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { action } = req.body

  try {
    switch (action) {
      case "chat":
        return await handleChat(req, res)
      case "intent":
        return await handleIntentDetection(req, res)
      case "escalate":
        return await handleEscalation(req, res)
      default:
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Invalid action parameter"
        )
    }
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || "Internal server error"
    })
  }
}

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { action } = req.query

  try {
    switch (action) {
      case "context":
        return await handleGetContext(req, res)
      case "recommendations":
        return await handleGetRecommendations(req, res)
      case "history":
        return await handleGetHistory(req, res)
      default:
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Invalid action parameter"
        )
    }
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || "Internal server error"
    })
  }
}

/**
 * POST /api/assistant (action: chat)
 * Main chat endpoint - processes user message and returns AI response
 */
async function handleChat(req: MedusaRequest, res: MedusaResponse) {
  const { message, conversationId, sessionId, customerId, language = 'en' } = req.body
  const manager = req.scope.resolve("manager")
  const aiService = new AIAssistantService(manager)

  if (!message || !sessionId) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Message and sessionId are required"
    )
  }

  // Get or create conversation
  let conversation = await manager.query(`
    SELECT * FROM conversations WHERE id = $1
  `, [conversationId])

  if (conversation.length === 0) {
    const newConvId = conversationId || `conv_${Date.now()}`
    await manager.query(`
      INSERT INTO conversations (id, customer_id, session_id, language, status, started_at, last_message_at)
      VALUES ($1, $2, $3, $4, 'active', NOW(), NOW())
    `, [newConvId, customerId, sessionId, language])
    conversation = [{ id: newConvId }]
  }

  const convId = conversation[0].id

  // Get conversation history
  const history = await aiService.getConversationHistory(convId)

  // Build context
  const context = {
    customerId,
    sessionId,
    language,
    conversationHistory: history,
    currentMachine: await getCustomerMachine(manager, customerId)
  }

  // Process message
  const result = await aiService.processMessage(message, context)

  // Save user message
  await aiService.saveConversation(convId, {
    role: 'user',
    content: message
  }, result.intent)

  // Save assistant response
  await aiService.saveConversation(convId, {
    role: 'assistant',
    content: result.response
  }, result.intent)

  // Remember machine if extracted
  if (context.currentMachine && customerId) {
    await aiService.rememberMachine(customerId, context.currentMachine)
  }

  // Track analytics
  await trackAnalytics(manager, {
    conversationId: convId,
    customerId,
    sessionId,
    eventType: 'message_sent',
    eventData: {
      intent: result.intent.name,
      confidence: result.intent.confidence
    }
  })

  return res.json({
    success: true,
    conversationId: convId,
    response: result.response,
    intent: result.intent,
    actions: result.actions,
    quickReplies: result.quickReplies
  })
}

/**
 * POST /api/assistant (action: intent)
 * Detect intent from message without full processing
 */
async function handleIntentDetection(req: MedusaRequest, res: MedusaResponse) {
  const { message, language = 'en' } = req.body
  const manager = req.scope.resolve("manager")
  const aiService = new AIAssistantService(manager)

  if (!message) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Message is required"
    )
  }

  const context = {
    sessionId: 'temp',
    language,
    conversationHistory: [],
    currentMachine: {}
  }

  const intent = await aiService.detectIntent(message, context)

  return res.json({
    success: true,
    intent
  })
}

/**
 * POST /api/assistant (action: escalate)
 * Escalate conversation to human support
 */
async function handleEscalation(req: MedusaRequest, res: MedusaResponse) {
  const { conversationId, customerId, reason, priority = 'medium' } = req.body
  const manager = req.scope.resolve("manager")

  if (!conversationId) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "ConversationId is required"
    )
  }

  // Update conversation status
  await manager.query(`
    UPDATE conversations
    SET status = 'escalated', escalated_at = NOW()
    WHERE id = $1
  `, [conversationId])

  // Add to escalation queue
  const escalationId = `esc_${Date.now()}`
  await manager.query(`
    INSERT INTO escalation_queue (id, conversation_id, customer_id, priority, reason, status, created_at)
    VALUES ($1, $2, $3, $4, $5, 'pending', NOW())
  `, [escalationId, conversationId, customerId, priority, reason])

  // Get queue position
  const queuePosition = await manager.query(`
    SELECT COUNT(*) as position
    FROM escalation_queue
    WHERE status = 'pending' AND created_at < (
      SELECT created_at FROM escalation_queue WHERE id = $1
    )
  `, [escalationId])

  return res.json({
    success: true,
    escalationId,
    queuePosition: queuePosition[0].position + 1,
    estimatedWaitTime: (queuePosition[0].position + 1) * 3, // 3 minutes per person
    supportPhone: '+48 123 456 789',
    supportEmail: 'support@example.com'
  })
}

/**
 * GET /api/assistant?action=context&sessionId=X
 * Get conversation context
 */
async function handleGetContext(req: MedusaRequest, res: MedusaResponse) {
  const { sessionId, customerId } = req.query
  const manager = req.scope.resolve("manager")

  if (!sessionId) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "SessionId is required"
    )
  }

  // Get active conversation
  const conversation = await manager.query(`
    SELECT * FROM conversations
    WHERE session_id = $1 AND status = 'active'
    ORDER BY last_message_at DESC
    LIMIT 1
  `, [sessionId])

  if (conversation.length === 0) {
    return res.json({
      success: true,
      hasContext: false
    })
  }

  const convId = conversation[0].id

  // Get recent messages
  const messages = await manager.query(`
    SELECT role, content, intent, created_at
    FROM conversation_messages
    WHERE conversation_id = $1
    ORDER BY created_at DESC
    LIMIT 10
  `, [convId])

  // Get customer machines
  const machines = await getCustomerMachine(manager, customerId)

  return res.json({
    success: true,
    hasContext: true,
    conversationId: convId,
    messages: messages.reverse(),
    currentMachine: machines,
    language: conversation[0].language
  })
}

/**
 * GET /api/assistant?action=recommendations&customerId=X
 * Get personalized recommendations
 */
async function handleGetRecommendations(req: MedusaRequest, res: MedusaResponse) {
  const { customerId, machineModelId } = req.query
  const manager = req.scope.resolve("manager")

  const recommendations: any[] = []

  // Get customer's machines
  if (customerId) {
    const machines = await manager.query(`
      SELECT mm.id, mm.name, mt.name as type_name
      FROM customer_machines cm
      JOIN machine_models mm ON cm.machine_model_id = mm.id
      JOIN machine_types mt ON cm.machine_type_id = mt.id
      WHERE cm.customer_id = $1
      ORDER BY cm.last_mentioned_at DESC
      LIMIT 3
    `, [customerId])

    recommendations.push({
      type: 'your_machines',
      title: 'Your Machines',
      items: machines
    })
  }

  // Get frequently bought together
  if (machineModelId) {
    const frequentParts = await manager.query(`
      SELECT p.id, p.title, p.thumbnail, pv.calculated_price as price
      FROM frequently_bought_together fbt
      JOIN product p ON fbt.related_product_id = p.id
      LEFT JOIN product_variant pv ON p.id = pv.product_id
      WHERE fbt.machine_model_id = $1
      ORDER BY fbt.frequency_score DESC
      LIMIT 5
    `, [machineModelId])

    recommendations.push({
      type: 'frequently_bought',
      title: 'Customers Also Buy',
      items: frequentParts
    })
  }

  // Get maintenance suggestions
  recommendations.push({
    type: 'maintenance',
    title: 'Maintenance Essentials',
    items: [
      { category: 'Filters', description: 'Replace every 500 hours' },
      { category: 'Seals', description: 'Check for leaks regularly' },
      { category: 'Fluids', description: 'Change every 1000 hours' }
    ]
  })

  return res.json({
    success: true,
    recommendations
  })
}

/**
 * GET /api/assistant?action=history&conversationId=X
 * Get conversation history
 */
async function handleGetHistory(req: MedusaRequest, res: MedusaResponse) {
  const { conversationId } = req.query
  const manager = req.scope.resolve("manager")

  if (!conversationId) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "ConversationId is required"
    )
  }

  const messages = await manager.query(`
    SELECT role, content, intent, confidence, created_at
    FROM conversation_messages
    WHERE conversation_id = $1
    ORDER BY created_at ASC
  `, [conversationId])

  return res.json({
    success: true,
    messages
  })
}

/**
 * Helper: Get customer's machine
 */
async function getCustomerMachine(manager: any, customerId?: string): Promise<any> {
  if (!customerId) return {}

  const machines = await manager.query(`
    SELECT 
      cm.machine_type_id as type,
      cm.manufacturer_id as manufacturer,
      cm.machine_model_id as model,
      mm.name as model_name
    FROM customer_machines cm
    LEFT JOIN machine_models mm ON cm.machine_model_id = mm.id
    WHERE cm.customer_id = $1 AND cm.is_primary = true
    LIMIT 1
  `, [customerId])

  return machines.length > 0 ? machines[0] : {}
}

/**
 * Helper: Track analytics
 */
async function trackAnalytics(manager: any, data: any): Promise<void> {
  const id = `analytics_${Date.now()}`
  
  await manager.query(`
    INSERT INTO assistant_analytics (
      id, conversation_id, event_type, event_data, 
      customer_id, session_id, created_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, NOW())
  `, [
    id,
    data.conversationId,
    data.eventType,
    JSON.stringify(data.eventData),
    data.customerId,
    data.sessionId
  ])
}
