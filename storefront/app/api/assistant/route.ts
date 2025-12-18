/**
 * Storefront Assistant API
 * Proxy to backend chat API with Gemini AI
 * Messages are stored in database for admin dashboard
 */

import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
const API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ''

const headers = {
  'Content-Type': 'application/json',
  'x-publishable-api-key': API_KEY
}

// POST /api/assistant - Send message to AI assistant
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    if (action === 'escalate') {
      // Handle escalation
      const response = await fetch(`${BACKEND_URL}/store/chat/escalate`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          sessionId: body.sessionId,
          customerId: body.customerId,
          reason: body.reason,
          conversationHistory: body.history,
          language: body.language
        })
      })

      const data = await response.json()
      return NextResponse.json(data)
    }

    // Get or create conversation
    let conversationId = body.conversationId

    if (!conversationId) {
      // Create new conversation
      const convResponse = await fetch(`${BACKEND_URL}/store/chat/conversations`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          customer_email: body.customerId ? `customer_${body.customerId}@omex.pl` : undefined,
          customer_name: body.customerName || 'Gość',
          customer_id: body.customerId
        })
      })

      if (!convResponse.ok) {
        throw new Error(`Failed to create conversation: ${convResponse.status}`)
      }

      const convData = await convResponse.json()
      conversationId = convData.conversation.id
    }

    // Send message to conversation (this saves to DB and gets AI response)
    const response = await fetch(`${BACKEND_URL}/store/chat/${conversationId}/messages`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        content: body.message,
        sender_type: 'customer'
      })
    })

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`)
    }

    const data = await response.json()
    
    return NextResponse.json({
      success: true,
      response: data.bot_message?.content || '',
      intent: data.intent,
      actions: data.actions || [],
      quickReplies: data.quick_replies || [],
      searchResults: data.search_results,
      conversationId: conversationId,
      searchContext: data.search_context
    })

  } catch (error: any) {
    console.error('Assistant API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        response: 'Przepraszam, wystąpił błąd. Spróbuj ponownie lub skontaktuj się z nami telefonicznie.'
      },
      { status: 500 }
    )
  }
}

// GET /api/assistant - Get context or suggestions
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const action = searchParams.get('action')
    const sessionId = searchParams.get('sessionId')
    const conversationId = searchParams.get('conversationId')
    const language = searchParams.get('language') || 'pl'

    if (action === 'context' && conversationId) {
      // Load existing conversation
      const response = await fetch(`${BACKEND_URL}/store/chat/${conversationId}`, {
        headers: { 'x-publishable-api-key': API_KEY }
      })
      
      if (response.ok) {
        const data = await response.json()
        return NextResponse.json({
          hasContext: true,
          conversationId: conversationId,
          messages: data.messages?.map((m: any) => ({
            role: m.sender_type === 'customer' ? 'user' : 'assistant',
            content: m.content,
            created_at: m.created_at
          })) || []
        })
      }
      
      return NextResponse.json({
        hasContext: false,
        conversationId: null,
        messages: []
      })
    }

    if (action === 'support-status') {
      // Check support availability
      const response = await fetch(`${BACKEND_URL}/store/chat/escalate?language=${language}`, {
        headers: { 'x-publishable-api-key': API_KEY }
      })
      const data = await response.json()
      return NextResponse.json(data)
    }

    // Default: return suggestions
    const response = await fetch(`${BACKEND_URL}/store/chat?language=${language}`, {
      headers: { 'x-publishable-api-key': API_KEY }
    })
    const data = await response.json()
    
    return NextResponse.json(data)

  } catch (error: any) {
    console.error('Assistant GET error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
