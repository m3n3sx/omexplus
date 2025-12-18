'use client'

import { useMemo } from 'react'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  intent?: string
}

interface ChatMessageProps {
  message: Message
  language: string
}

// Parse and render message content with basic markdown support
function renderContent(content: string, isUser: boolean) {
  // Split by newlines and process each line
  const lines = content.split('\n')
  
  return lines.map((line, lineIndex) => {
    // Check for numbered list (1. 2. 3.)
    const numberedMatch = line.match(/^(\d+)\.\s+(.+)$/)
    if (numberedMatch) {
      return (
        <div key={lineIndex} className="flex gap-2 my-1">
          <span className={`font-semibold ${isUser ? 'text-blue-200' : 'text-blue-600'}`}>
            {numberedMatch[1]}.
          </span>
          <span>{renderInlineContent(numberedMatch[2], isUser)}</span>
        </div>
      )
    }

    // Check for bullet points
    if (line.startsWith('- ') || line.startsWith('• ')) {
      return (
        <div key={lineIndex} className="flex gap-2 my-1 ml-2">
          <span className={isUser ? 'text-blue-200' : 'text-blue-600'}>•</span>
          <span>{renderInlineContent(line.slice(2), isUser)}</span>
        </div>
      )
    }

    // Regular line
    if (line.trim()) {
      return <p key={lineIndex} className="my-1">{renderInlineContent(line, isUser)}</p>
    }
    
    return <br key={lineIndex} />
  })
}

// Render inline content (bold, links, SKU)
function renderInlineContent(text: string, isUser: boolean) {
  const parts: (string | JSX.Element)[] = []
  let remaining = text
  let keyIndex = 0

  // Pattern for SKU references
  const skuPattern = /\(SKU:\s*([^)]+)\)/g
  // Pattern for bold text **text**
  const boldPattern = /\*\*([^*]+)\*\*/g
  // Pattern for product references [Product Name]
  const productPattern = /\[([^\]]+)\]/g

  // Simple approach: replace patterns with styled elements
  remaining = remaining.replace(skuPattern, (_, sku) => `{{SKU:${sku}}}`)
  remaining = remaining.replace(boldPattern, (_, text) => `{{BOLD:${text}}}`)
  remaining = remaining.replace(productPattern, (_, product) => `{{PRODUCT:${product}}}`)

  // Split and render
  const tokens = remaining.split(/(\{\{[^}]+\}\})/g)
  
  return tokens.map((token, i) => {
    if (token.startsWith('{{SKU:')) {
      const sku = token.slice(6, -2)
      return (
        <span key={i} className={`text-xs px-1.5 py-0.5 rounded ${isUser ? 'bg-blue-500' : 'bg-gray-200 text-gray-600'}`}>
          SKU: {sku}
        </span>
      )
    }
    if (token.startsWith('{{BOLD:')) {
      const boldText = token.slice(7, -2)
      return <strong key={i}>{boldText}</strong>
    }
    if (token.startsWith('{{PRODUCT:')) {
      const product = token.slice(10, -2)
      return (
        <span key={i} className={`font-medium ${isUser ? 'text-blue-100' : 'text-blue-700'}`}>
          {product}
        </span>
      )
    }
    return token
  })
}

export function ChatMessage({ message, language }: ChatMessageProps) {
  const isUser = message.role === 'user'
  const isSystem = message.role === 'system'

  const renderedContent = useMemo(() => renderContent(message.content, isUser), [message.content, isUser])

  if (isSystem) {
    return (
      <div className="flex justify-center">
        <div className="px-4 py-2 bg-info/20 text-info-dark rounded-full text-sm max-w-[80%] text-center">
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start gap-2 max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser ? 'bg-primary-600 text-white' : 'bg-secondary-600 text-white'
        }`}>
          {isUser ? '👤' : '🤖'}
        </div>

        {/* Message Bubble */}
        <div>
          <div className={`px-4 py-3 rounded-2xl ${
            isUser 
              ? 'bg-primary-600 text-white rounded-tr-none' 
              : 'bg-white border border-neutral-200 text-neutral-900 rounded-tl-none'
          }`}>
            <div className="text-sm">{renderedContent}</div>
          </div>

          {/* Timestamp */}
          <div className={`text-xs text-neutral-500 mt-1 px-2 ${isUser ? 'text-right' : 'text-left'}`}>
            {formatTime(message.timestamp, language)}
          </div>
        </div>
      </div>
    </div>
  )
}

function formatTime(date: Date, language: string): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)

  if (minutes < 1) {
    return language === 'pl' ? 'Teraz' : 'Now'
  }
  if (minutes < 60) {
    return language === 'pl' ? `${minutes} min temu` : `${minutes} min ago`
  }
  if (hours < 24) {
    return language === 'pl' ? `${hours} godz. temu` : `${hours} hours ago`
  }

  return date.toLocaleTimeString(language === 'pl' ? 'pl-PL' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}
