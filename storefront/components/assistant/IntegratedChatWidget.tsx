'use client'

import { useState, useEffect, useRef } from 'react'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { QuickReplies } from './QuickReplies'
import { ChatHeader } from './ChatHeader'
import { useSearchAssistant } from '@/contexts/SearchAssistantContext'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  intent?: string
  actions?: any[]
}

interface IntegratedChatWidgetProps {
  customerId?: string
  language?: string
  position?: 'bottom-right' | 'bottom-left' | 'sidebar'
  onLaunchSearch?: (data: any) => void
}

export function IntegratedChatWidget({ 
  customerId, 
  language = 'en',
  position = 'bottom-right',
  onLaunchSearch
}: IntegratedChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(position === 'sidebar')
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [quickReplies, setQuickReplies] = useState<string[]>([])
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [sessionId] = useState(`session_${Date.now()}`)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { 
    conversationContext, 
    launchSearchFromAssistant,
    searchData 
  } = useSearchAssistant()

  useEffect(() => {
    loadContext()
    if (messages.length === 0) {
      addWelcomeMessage()
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Handle context from search system
  useEffect(() => {
    if (conversationContext) {
      handleSearchContext(conversationContext)
    }
  }, [conversationContext])

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
      ? 'Cześć! 👋 Mogę pomóc Ci znaleźć części lub uruchomić zaawansowane wyszukiwanie. Co Cię interesuje?'
      : 'Hi! 👋 I can help you find parts or launch advanced search. What are you looking for?'

    setMessages([{
      id: `msg_${Date.now()}`,
      role: 'assistant',
      content: welcomeText,
      timestamp: new Date()
    }])

    setQuickReplies(
      language === 'pl'
        ? ['Pomóż mi znaleźć część', 'Uruchom wyszukiwanie', 'Sprawdź kompatybilność', 'Pokaż rekomendacje']
        : ['Help me find a part', 'Launch search', 'Check compatibility', 'Show recommendations']
    )
  }

  const handleSearchContext = (context: any) => {
    if (context.type === 'part_selected') {
      // User selected a part in search, show recommendations
      const message = language === 'pl'
        ? `Świetny wybór! Wybrałeś ${context.part?.name}. Czy chcesz zobaczyć powiązane części?`
        : `Great choice! You selected ${context.part?.name}. Would you like to see related parts?`
      
      addAssistantMessage(message)
      setQuickReplies(
        language === 'pl'
          ? ['Pokaż powiązane', 'Dodaj do koszyka', 'Szukaj dalej', 'Gotowe']
          : ['Show related', 'Add to cart', 'Search more', 'Done']
      )
    } else if (context.type === 'help_requested') {
      // User requested help from search
      const message = language === 'pl'
        ? `Widzę, że potrzebujesz pomocy w kroku ${context.step}. Powiedz mi, co próbujesz znaleźć?`
        : `I see you need help at step ${context.step}. Tell me what you're trying to find?`
      
      addAssistantMessage(message)
    }
  }

  const sendMessage = async (content: string) => {
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
          language,
          searchContext: searchData
        })
      })

      const data = await response.json()

      if (data.success) {
        if (!conversationId) {
          setConversationId(data.conversationId)
        }

        const assistantMessage: Message = {
          id: `msg_${Date.now() + 1}`,
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
          intent: data.intent.name,
          actions: data.actions
        }
        setMessages(prev => [...prev, assistantMessage])

        if (data.quickReplies && data.quickReplies.length > 0) {
          setQuickReplies(data.quickReplies)
        }

        if (data.actions && data.actions.length > 0) {
          handleActions(data.actions)
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      addErrorMessage()
    } finally {
      setIsTyping(false)
    }
  }

  const handleActions = (actions: any[]) => {
    actions.forEach(action => {
      switch (action.type) {
        case 'launch_search':
          // Launch integrated search with pre-filled data
          launchSearchFromAssistant(action.data)
          if (onLaunchSearch) {
            onLaunchSearch(action.data)
          }
          break

        case 'show_recommendations':
          // Show recommendations inline
          displayRecommendations(action.data)
          break

        case 'validate_compatibility':
          // Show compatibility check
          displayCompatibility(action.data)
          break
      }
    })
  }

  const displayRecommendations = (data: any) => {
    const message = language === 'pl'
      ? `Na podstawie Twojego wyboru, polecam również:`
      : `Based on your selection, I also recommend:`
    
    addAssistantMessage(message)
    // TODO: Display recommendations from data.recommendations
  }

  const displayCompatibility = (_data: any) => {
    const message = language === 'pl'
      ? `Sprawdzam kompatybilność...`
      : `Checking compatibility...`
    
    addAssistantMessage(message)
  }

  const addAssistantMessage = (content: string) => {
    const message: Message = {
      id: `msg_${Date.now()}`,
      role: 'assistant',
      content,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, message])
  }

  const addErrorMessage = () => {
    const errorMessage: Message = {
      id: `msg_${Date.now() + 1}`,
      role: 'assistant',
      content: language === 'pl'
        ? 'Przepraszam, wystąpił błąd. Spróbuj ponownie.'
        : 'Sorry, an error occurred. Please try again.',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, errorMessage])
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

  // Sidebar mode (for integrated view)
  if (position === 'sidebar') {
    return (
      <div className="h-full flex flex-col bg-white border-r border-neutral-200">
        <ChatHeader
          onClose={() => {}}
          onMinimize={toggleMinimize}
          isMinimized={isMinimized}
          language={language}
        />

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
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {quickReplies.length > 0 && (
              <QuickReplies
                replies={quickReplies}
                onSelect={handleQuickReply}
              />
            )}

            <ChatInput
              onSend={sendMessage}
              disabled={isTyping}
              language={language}
            />
          </>
        )}
      </div>
    )
  }

  // Widget mode (floating)
  const positionClasses = position === 'bottom-right' 
    ? 'right-4 bottom-4' 
    : 'left-4 bottom-4'

  return (
    <div className={`fixed ${positionClasses} z-50`}>
      {!isOpen && (
        <button
          onClick={toggleOpen}
          className="w-16 h-16 bg-primary-600 text-white rounded-full shadow-2xl hover:bg-primary-700 transition-all duration-300 flex items-center justify-center hover:scale-110"
          aria-label="Open chat"
        >
          <span className="text-3xl">💬</span>
        </button>
      )}

      {isOpen && (
        <div 
          className={`bg-white rounded-lg shadow-2xl transition-all duration-300 ${
            isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
          } flex flex-col`}
        >
          <ChatHeader
            onClose={() => setIsOpen(false)}
            onMinimize={toggleMinimize}
            isMinimized={isMinimized}
            language={language}
          />

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
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {quickReplies.length > 0 && (
                <QuickReplies
                  replies={quickReplies}
                  onSelect={handleQuickReply}
                />
              )}

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
