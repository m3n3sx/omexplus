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
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
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
