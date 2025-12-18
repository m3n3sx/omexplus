'use client'

interface ChatHeaderProps {
  onClose: () => void
  onMinimize: () => void
  isMinimized: boolean
  language: string
}

export function ChatHeader({ onClose, onMinimize, isMinimized, language }: ChatHeaderProps) {
  const title = language === 'pl' ? 'Asystent AI' : 'AI Assistant'
  const subtitle = language === 'pl' ? 'Online - Odpowiadam w sekundach' : 'Online - Responding in seconds'

  return (
    <div className="px-4 py-3 bg-secondary-700 text-white rounded-t-lg flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
          <span className="text-2xl">🤖</span>
        </div>
        {!isMinimized && (
          <div>
            <div className="font-bold font-heading">{title}</div>
            <div className="text-xs text-neutral-300 flex items-center gap-1">
              <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
              {subtitle}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onMinimize}
          className="w-8 h-8 hover:bg-primary-500 rounded-full flex items-center justify-center transition-colors"
          aria-label={isMinimized ? 'Maximize' : 'Minimize'}
        >
          {isMinimized ? '⬆️' : '⬇️'}
        </button>
        <button
          onClick={onClose}
          className="w-8 h-8 hover:bg-primary-500 rounded-full flex items-center justify-center transition-colors"
          aria-label="Close chat"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
