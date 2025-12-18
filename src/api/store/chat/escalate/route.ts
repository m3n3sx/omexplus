/**
 * Chat Escalation API
 * POST /store/chat/escalate - Request human support
 */

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

interface EscalationRequest {
  sessionId: string
  customerId?: string
  reason: string
  conversationHistory?: any[]
  contactPreference?: 'chat' | 'phone' | 'email'
  language?: string
}

// POST /store/chat/escalate - Escalate to human support
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const {
      sessionId,
      customerId,
      reason,
      conversationHistory = [],
      contactPreference = 'chat',
      language = 'pl'
    } = req.body as EscalationRequest

    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required" })
    }

    // Create escalation ticket
    const ticketId = `ESC-${Date.now()}`
    
    // In production, this would:
    // 1. Create a support ticket in your CRM/helpdesk
    // 2. Notify available support agents
    // 3. Add to support queue
    
    // Simulate queue position (in production, query actual queue)
    const queuePosition = Math.floor(Math.random() * 5) + 1
    const estimatedWaitTime = queuePosition * 3 // ~3 min per position

    // Support contact info
    const supportInfo = {
      phone: '+48 123 456 789',
      email: 'support@omex.pl',
      hours: language === 'pl' 
        ? 'Pon-Pt 8:00-18:00, Sob 9:00-14:00'
        : 'Mon-Fri 8:00-18:00, Sat 9:00-14:00'
    }

    // Log escalation for analytics
    console.log('Chat escalation:', {
      ticketId,
      sessionId,
      customerId,
      reason,
      contactPreference,
      timestamp: new Date().toISOString()
    })

    const message = language === 'pl'
      ? `Łączę Cię z naszym ekspertem. Twój numer zgłoszenia: ${ticketId}. Pozycja w kolejce: ${queuePosition}. Szacowany czas oczekiwania: ${estimatedWaitTime} minut.`
      : `Connecting you with our expert. Your ticket number: ${ticketId}. Queue position: ${queuePosition}. Estimated wait time: ${estimatedWaitTime} minutes.`

    res.json({
      success: true,
      ticketId,
      queuePosition,
      estimatedWaitTime,
      supportPhone: supportInfo.phone,
      supportEmail: supportInfo.email,
      supportHours: supportInfo.hours,
      message,
      contactPreference
    })

  } catch (error: any) {
    console.error("Escalation error:", error)
    res.status(500).json({ 
      success: false,
      error: error.message || "Escalation failed",
      fallbackPhone: '+48 123 456 789'
    })
  }
}

// GET /store/chat/escalate - Get support availability
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const language = (req.query.language as string) || 'pl'
  
  // Check current time for availability
  const now = new Date()
  const hour = now.getHours()
  const day = now.getDay()
  
  // Mon-Fri 8-18, Sat 9-14
  const isAvailable = (day >= 1 && day <= 5 && hour >= 8 && hour < 18) ||
                      (day === 6 && hour >= 9 && hour < 14)

  // Simulate current queue (in production, query actual data)
  const currentQueue = Math.floor(Math.random() * 8)
  const avgWaitTime = currentQueue * 3

  res.json({
    available: isAvailable,
    currentQueue,
    avgWaitTime,
    supportPhone: '+48 123 456 789',
    supportEmail: 'support@omex.pl',
    hours: language === 'pl'
      ? { weekdays: 'Pon-Pt 8:00-18:00', saturday: 'Sob 9:00-14:00', sunday: 'Niedz. zamknięte' }
      : { weekdays: 'Mon-Fri 8:00-18:00', saturday: 'Sat 9:00-14:00', sunday: 'Sun closed' },
    message: isAvailable
      ? (language === 'pl' ? 'Nasi eksperci są dostępni' : 'Our experts are available')
      : (language === 'pl' ? 'Obecnie poza godzinami pracy' : 'Currently outside working hours')
  })
}
