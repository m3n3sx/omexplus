'use client'

import { useState, useEffect, useRef } from 'react'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { QuickReplies } from './QuickReplies'
import { ChatHeader } from './ChatHeader'
import { ProductCards } from './ProductCards'
import { useSearchAssistant } from '@/contexts/SearchAssistantContext'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  intent?: string
  actions?: any[]
  products?: any[]
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

  const CONVERSATION_KEY = 'omex_chat_conversation_id'

  const { 
    conversationContext, 
    launchSearchFromAssistant,
    searchData 
  } = useSearchAssistant()

  // Load saved conversation on mount
  useEffect(() => {
    const savedConvId = localStorage.getItem(CONVERSATION_KEY)
    if (savedConvId) {
      setConversationId(savedConvId)
      loadConversation(savedConvId)
    } else if (messages.length === 0) {
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

  const loadConversation = async (convId: string) => {
    try {
      const response = await fetch(
        `/api/assistant?action=context&conversationId=${convId}`
      )
      const data = await response.json()

      if (data.hasContext && data.messages?.length > 0) {
        setMessages(data.messages.map((m: any) => ({
          id: `msg_${Date.now()}_${Math.random()}`,
          role: m.role,
          content: m.content,
          timestamp: new Date(m.created_at)
        })))
      } else {
        // Conversation not found, clear and start fresh
        localStorage.removeItem(CONVERSATION_KEY)
        setConversationId(null)
        addWelcomeMessage()
      }
    } catch (error) {
      console.error('Failed to load conversation:', error)
      addWelcomeMessage()
    }
  }

  // Save conversation ID when it changes
  useEffect(() => {
    if (conversationId) {
      localStorage.setItem(CONVERSATION_KEY, conversationId)
    }
  }, [conversationId])

  const addWelcomeMessage = () => {
    const welcomeText = language === 'pl'
      ? 'Cześć! 👋 Mogę pomóc Ci znaleźć części lub uruchomić zaawansowane wyszukiwanie. Co Cię interesuje?'
      : 'Hi! 👋 I can help you find parts or launch advanced search. What are you looking for?'

    setMessages([{
      id: `welcome_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
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

  // Generate unique ID
  const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  const sendMessage = async (content: string) => {
    const userMessage: Message = {
      id: generateId(),
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
          id: generateId(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
          intent: data.intent?.name,
          actions: data.actions,
          // Add products directly to message
          products: data.searchResults && data.searchResults.length > 0 ? data.searchResults : undefined
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

        case 'show_products':
          // Products are shown inline with message
          break

        case 'escalate_to_human':
          // Handle escalation
          handleEscalation(action.data)
          break

        case 'offer_escalation':
          // Offer to connect with human
          setQuickReplies(prev => [
            ...prev.filter(r => !r.includes('ekspert') && !r.includes('expert')),
            language === 'pl' ? 'Połącz z ekspertem' : 'Connect with expert'
          ])
          break
      }
    })
  }

  const handleEscalation = async (data: any) => {
    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'escalate',
          sessionId,
          customerId,
          reason: data?.reason || 'User requested human support',
          language
        })
      })

      const result = await response.json()

      if (result.success) {
        const escalationMessage: Message = {
          id: `esc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          role: 'system',
          content: result.message,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, escalationMessage])
        setQuickReplies([
          language === 'pl' ? 'Zadzwoń teraz' : 'Call now',
          language === 'pl' ? 'Wyślij email' : 'Send email',
          language === 'pl' ? 'Kontynuuj z AI' : 'Continue with AI'
        ])
      }
    } catch (error) {
      console.error('Escalation failed:', error)
    }
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
      id: `asst_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role: 'assistant',
      content,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, message])
  }

  const addErrorMessage = () => {
    const errorMessage: Message = {
      id: `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
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
                <div key={message.id}>
                  <ChatMessage
                    message={message}
                    language={language}
                  />
                  {message.products && message.products.length > 0 && (
                    <div className="ml-10 mt-2">
                      <ProductCards
                        products={message.products}
                        language={language}
                        onProductClick={(product) => {
                          window.open(`/products/${product.handle}`, '_blank')
                        }}
                        onAddToCart={(product) => {
                          // TODO: Add to cart functionality
                          console.log('Add to cart:', product)
                        }}
                      />
                    </div>
                  )}
                </div>
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
          className="w-16 h-16 bg-primary-500 text-white rounded-full shadow-2xl hover:bg-secondary-700 transition-all duration-300 flex items-center justify-center hover:scale-110"
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
                  <div key={message.id}>
                    <ChatMessage
                      message={message}
                      language={language}
                    />
                    {message.products && message.products.length > 0 && (
                      <div className="ml-10 mt-2">
                        <ProductCards
                          products={message.products}
                          language={language}
                          onProductClick={(product) => {
                            window.open(`/products/${product.handle}`, '_blank')
                          }}
                          onAddToCart={(product) => {
                            console.log('Add to cart:', product)
                          }}
                        />
                      </div>
                    )}
                  </div>
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
