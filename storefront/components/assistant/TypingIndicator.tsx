'use client'

interface TypingIndicatorProps {
  language?: string
  variant?: 'default' | 'compact'
}

export function TypingIndicator({ 
  language = 'en',
  variant = 'default' 
}: TypingIndicatorProps) {
  if (variant === 'compact') {
    return (
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
        <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
        <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 text-neutral-600 py-2">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
        <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
        <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
      </div>
      <span className="text-sm">
        {language === 'pl' ? 'Pisze...' : 'Typing...'}
      </span>
    </div>
  )
}
