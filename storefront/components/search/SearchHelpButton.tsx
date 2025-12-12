'use client'

import { useState } from 'react'
import { MiniAssistant } from '../assistant/MiniAssistant'
import { useSearchAssistant } from '@/contexts/SearchAssistantContext'

interface SearchHelpButtonProps {
  step: number
  context: any
  language?: string
  className?: string
}

export function SearchHelpButton({ 
  step, 
  context, 
  language = 'en',
  className = ''
}: SearchHelpButtonProps) {
  const [showHelp, setShowHelp] = useState(false)
  const { requestAssistantHelp } = useSearchAssistant()

  const handleClick = () => {
    setShowHelp(true)
    requestAssistantHelp(step, context)
  }

  const handleSuggestion = (suggestion: any) => {
    console.log('Received suggestion:', suggestion)
    // Apply suggestion to search
    setShowHelp(false)
  }

  return (
    <>
      <button
        onClick={handleClick}
        className={`
          inline-flex items-center gap-2 px-4 py-2 
          bg-secondary-100 text-secondary-700 rounded-lg 
          hover:bg-secondary-200 transition-colors
          font-medium text-sm
          ${className}
        `}
      >
        <span className="text-lg">💡</span>
        <span>
          {language === 'pl' ? 'Potrzebujesz pomocy?' : 'Need help with this?'}
        </span>
      </button>

      {showHelp && (
        <MiniAssistant
          step={step}
          context={context}
          language={language}
          onSuggestion={handleSuggestion}
          onClose={() => setShowHelp(false)}
        />
      )}
    </>
  )
}
