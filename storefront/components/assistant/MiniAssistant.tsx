'use client'

import { useState } from 'react'
import { ChatInput } from './ChatInput'
import { ChatMessage } from './ChatMessage'

interface MiniAssistantProps {
  step: number
  context: any
  language?: string
  onSuggestion?: (suggestion: any) => void
  onClose?: () => void
}

export function MiniAssistant({ 
  step, 
  context, 
  language = 'en',
  onSuggestion,
  onClose 
}: MiniAssistantProps) {
  const [messages, setMessages] = useState([
    {
      id: 'help_1',
      role: 'assistant' as const,
      content: getHelpMessage(step, language),
      timestamp: new Date()
    }
  ])
  const [isTyping, setIsTyping] = useState(false)

  const handleSend = async (message: string) => {
    // Add user message
    setMessages(prev => [...prev, {
      id: `msg_${Date.now()}`,
      role: 'user' as const,
      content: message,
      timestamp: new Date()
    }])

    setIsTyping(true)

    try {
      // Get AI help
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'chat',
          message,
          context: {
            type: 'search_help',
            step,
            searchContext: context
          },
          language
        })
      })

      const data = await response.json()

      if (data.success) {
        setMessages(prev => [...prev, {
          id: `msg_${Date.now() + 1}`,
          role: 'assistant' as const,
          content: data.response,
          timestamp: new Date()
        }])

        // If assistant provides a suggestion, pass it back
        if (data.actions && data.actions.length > 0) {
          const suggestion = data.actions[0]
          if (onSuggestion) {
            onSuggestion(suggestion.data)
          }
        }
      }
    } catch (error) {
      console.error('Mini assistant error:', error)
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md max-h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💡</span>
            <h3 className="font-semibold text-neutral-900">
              {language === 'pl' ? 'Potrzebujesz pomocy?' : 'Need Help?'}
            </h3>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-neutral-700 transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
          )}
        </div>

        {/* Messages */}
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
        </div>

        {/* Input */}
        <div className="border-t border-neutral-200">
          <ChatInput
            onSend={handleSend}
            disabled={isTyping}
            language={language}
            placeholder={language === 'pl' ? 'Opisz swój problem...' : 'Describe your issue...'}
          />
        </div>
      </div>
    </div>
  )
}

function getHelpMessage(step: number, language: string): string {
  const messages: Record<number, { en: string; pl: string }> = {
    1: {
      en: "I see you're selecting a machine type. What kind of equipment do you have? For example: excavator, loader, bulldozer?",
      pl: "Widzę, że wybierasz typ maszyny. Jaki sprzęt posiadasz? Na przykład: koparka, ładowarka, spychacz?"
    },
    2: {
      en: "Which manufacturer makes your machine? Popular brands include CAT, Komatsu, JCB, Volvo, Hitachi.",
      pl: "Jaki producent wykonał Twoją maszynę? Popularne marki to CAT, Komatsu, JCB, Volvo, Hitachi."
    },
    3: {
      en: "What's the model number of your machine? It's usually on a plate on the machine or in your manual.",
      pl: "Jaki jest numer modelu Twojej maszyny? Zazwyczaj znajduje się na tabliczce na maszynie lub w instrukcji."
    },
    4: {
      en: "What problem are you experiencing? For example: 'pump leaking', 'no power', 'strange noise'.",
      pl: "Jaki problem występuje? Na przykład: 'pompa przecieka', 'brak mocy', 'dziwny dźwięk'."
    },
    5: {
      en: "Based on your issue, I'll suggest the right part category. What symptoms is your machine showing?",
      pl: "Na podstawie Twojego problemu zasugeruję odpowiednią kategorię części. Jakie objawy wykazuje Twoja maszyna?"
    },
    6: {
      en: "I'll help you choose the right part. Tell me more about what you need.",
      pl: "Pomogę Ci wybrać odpowiednią część. Powiedz mi więcej o tym, czego potrzebujesz."
    }
  }

  return messages[step]?.[language] || messages[1][language]
}
