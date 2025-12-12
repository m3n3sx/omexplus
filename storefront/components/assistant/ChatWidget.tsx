'use client'

import { useState, useEffect, useRef } from 'react'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { QuickReplies } from './QuickReplies'
import { ChatHeader } from './ChatHeader'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  intent?: string
}

interface ChatWidgetProps {
  customerId?: string
  language?: string
  position?: 'bottom-right' | 'bottom-left'
}

export function ChatWidget({ 
  customerId, 
  language = 'en',
  position = 'bottom-right' 
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [quickReplies, setQuickReplies] = useState<string[]>([])
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [sessionId] = useState(`session_${Date.now()}`)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load conversation context on mount
    loadContext()
    
    // Show welcome message
    if (messages.length === 0) {
      addWelcomeMessage()
    }
  }, [])

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    scrollToBottom()
  }, [messages])

  const loadContext = async () => {
    try {
      const response = await fetch(
        `/api/assistant?action=context&sessionId=${sessionId}&customerId=${customerId || ''}`
      )
      const data = await response.json()

      if (data.hasContext) {
        setConversationId(data.conversationId)
        setMessages(data.messages.map((m: any) => ({
          id: `msg_${Date.now()}_${Math.random()}`,
          role: m.role,
          content: m.content,
          timestamp: new Date(m.created_at)
        })))
      }
    } catch (error) {
      console.error('Failed to load context:', error)
    }
  }

  const addWelcomeMessage = () => {
    const welcomeText = language === 'pl'
      ? 'Cześć! 👋 Jestem Twoim asystentem. Mogę pomóc Ci znaleźć części, sprawdzić kompatybilność lub odpowiedzieć na pytania. Jak mogę pomóc?'
      : 'Hi! 👋 I\'m your assistant. I can help you find parts, check compatibility, or answer questions. How can I help?'

    setMessages([{
      id: `msg_${Date.now()}`,
      role: 'assistant',
      content: welcomeText,
      timestamp: new Date()
    }])

    setQuickReplies(
      language === 'pl'
        ? ['Znajdź części', 'Sprawdź kompatybilność', 'Zamów ponownie', 'Porozmawiaj z ekspertem']
        : ['Find parts', 'Check compatibility', 'Reorder', 'Talk to expert']
    )
  }

  const sendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setQuickReplies([])
    setIsTyping(true)

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'chat',
          message: content,
          conversationId,
          sessionId,
          customerId,
          language
        })
      })

      const data = await response.json()

      if (data.success) {
        // Update conversation ID
        if (!conversationId) {
          setConversationId(data.conversationId)
        }

        // Add assistant response
        const assistantMessage: Message = {
          id: `msg_${Date.now() + 1}`,
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
          intent: data.intent.name
        }
        setMessages(prev => [...prev, assistantMessage])

        // Update quick replies
        if (data.quickReplies && data.quickReplies.length > 0) {
          setQuickReplies(data.quickReplies)
        }

        // Handle actions
        if (data.actions && data.actions.length > 0) {
          handleActions(data.actions)
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      
      const errorMessage: Message = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: language === 'pl'
          ? 'Przepraszam, wystąpił błąd. Spróbuj ponownie.'
          : 'Sorry, an error occurred. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleActions = (actions: any[]) => {
    actions.forEach(action => {
      switch (action.type) {
        case 'launch_search':
          // Redirect to search with pre-filled data
          const searchParams = new URLSearchParams(action.data)
          window.location.href = `/search?${searchParams}`
          break

        case 'validate_compatibility':
          // Open compatibility checker
          console.log('Validate compatibility:', action.data)
          break

        case 'show_order_history':
          // Show order history
          window.location.href = '/account/orders'
          break

        case 'escalate_to_human':
          // Show escalation message
          handleEscalation()
          break
      }
    })
  }

  const handleEscalation = async () => {
    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'escalate',
          conversationId,
          customerId,
          reason: 'User requested human support'
        })
      })

      const data = await response.json()

      if (data.success) {
        const escalationMessage: Message = {
          id: `msg_${Date.now()}`,
          role: 'system',
          content: language === 'pl'
            ? `Łączę z ekspertem... Pozycja w kolejce: ${data.queuePosition}. Szacowany czas: ${data.estimatedWaitTime} min. Możesz też zadzwonić: ${data.supportPhone}`
            : `Connecting to expert... Queue position: ${data.queuePosition}. Estimated time: ${data.estimatedWaitTime} min. You can also call: ${data.supportPhone}`,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, escalationMessage])
      }
    } catch (error) {
      console.error('Escalation failed:', error)
    }
  }

  const handleQuickReply = (reply: string) => {
    sendMessage(reply)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const toggleOpen = () => {
    setIsOpen(!isOpen)
    if (!isOpen && messages.length === 0) {
      addWelcomeMessage()
    }
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const positionClasses = position === 'bottom-right' 
    ? 'right-4 bottom-4' 
    : 'left-4 bottom-4'

  return (
    <div className={`fixed ${positionClasses} z-50`}>
      {/* Chat Button (when closed) */}
      {!isOpen && (
        <button
          onClick={toggleOpen}
          className="w-16 h-16 bg-primary-600 text-white rounded-full shadow-2xl hover:bg-primary-700 transition-all duration-300 flex items-center justify-center hover:scale-110"
          aria-label="Open chat"
        >
          <span className="text-3xl">💬</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          className={`bg-white rounded-lg shadow-2xl transition-all duration-300 ${
            isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
          } flex flex-col`}
        >
          {/* Header */}
          <ChatHeader
            onClose={() => setIsOpen(false)}
            onMinimize={toggleMinimize}
            isMinimized={isMinimized}
            language={language}
          />

          {/* Messages Area */}
          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50">
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    language={language}
                  />
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 text-neutral-600">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                    <span className="text-sm">
                      {language === 'pl' ? 'Pisze...' : 'Typing...'}
                    </span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Replies */}
              {quickReplies.length > 0 && (
                <QuickReplies
                  replies={quickReplies}
                  onSelect={handleQuickReply}
                />
              )}

              {/* Input Area */}
              <ChatInput
                onSend={sendMessage}
                disabled={isTyping}
                language={language}
              />
            </>
          )}
        </div>
      )}
    </div>
  )
}
