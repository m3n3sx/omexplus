'use client'

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

export function ChatMessage({ message, language }: ChatMessageProps) {
  const isUser = message.role === 'user'
  const isSystem = message.role === 'system'

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
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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
