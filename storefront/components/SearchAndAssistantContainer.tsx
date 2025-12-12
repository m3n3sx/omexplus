'use client'

import { useState } from 'react'
import { SearchAssistantProvider, useSearchAssistant } from '@/contexts/SearchAssistantContext'
import { IntegratedChatWidget } from './assistant/IntegratedChatWidget'
import { IntegratedSearchSystem } from './search/IntegratedSearchSystem'

interface SearchAndAssistantContainerProps {
  customerId?: string
  language?: string
  initialMode?: 'assistant' | 'search'
}

function SearchAndAssistantContent({ 
  customerId, 
  language = 'en',
  initialMode = 'assistant'
}: SearchAndAssistantContainerProps) {
  const { 
    isSearchActive, 
    isAssistantActive,
    searchData,
    returnToAssistant 
  } = useSearchAssistant()

  const [viewMode, setViewMode] = useState<'split' | 'search-only' | 'assistant-only'>(
    initialMode === 'search' ? 'search-only' : 'split'
  )

  const handleLaunchSearch = (data: any) => {
    setViewMode('search-only')
  }

  const handleBackToAssistant = () => {
    setViewMode('split')
  }

  // Mobile: Stack vertically
  // Desktop: Side by side
  return (
    <div className="h-screen flex flex-col lg:flex-row">
      {/* Assistant Panel */}
      {(viewMode === 'split' || viewMode === 'assistant-only') && (
        <div className={`
          ${viewMode === 'split' ? 'lg:w-[30%]' : 'w-full'}
          ${viewMode === 'split' ? 'hidden lg:block' : ''}
          border-r border-neutral-200
        `}>
          <IntegratedChatWidget
            customerId={customerId}
            language={language}
            position="sidebar"
            onLaunchSearch={handleLaunchSearch}
          />
        </div>
      )}

      {/* Search Panel */}
      {(viewMode === 'split' || viewMode === 'search-only') && isSearchActive && (
        <div className={`
          ${viewMode === 'split' ? 'lg:w-[70%]' : 'w-full'}
          flex-1
        `}>
          <IntegratedSearchSystem
            initialData={searchData}
            onPartSelected={(part) => {
              console.log('Part selected:', part)
            }}
            onBack={handleBackToAssistant}
            showBackButton={viewMode === 'search-only'}
          />
        </div>
      )}

      {/* Mobile: Floating assistant button when in search-only mode */}
      {viewMode === 'search-only' && (
        <div className="lg:hidden">
          <IntegratedChatWidget
            customerId={customerId}
            language={language}
            position="bottom-right"
            onLaunchSearch={handleLaunchSearch}
          />
        </div>
      )}

      {/* Empty state when no search active */}
      {!isSearchActive && viewMode === 'split' && (
        <div className="flex-1 flex items-center justify-center bg-neutral-50">
          <div className="text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">
              {language === 'pl' ? 'Gotowy do wyszukiwania' : 'Ready to Search'}
            </h3>
            <p className="text-neutral-600">
              {language === 'pl' 
                ? 'Powiedz asystentowi, czego szukasz, aby rozpocząć'
                : 'Tell the assistant what you\'re looking for to get started'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export function SearchAndAssistantContainer(props: SearchAndAssistantContainerProps) {
  return (
    <SearchAssistantProvider>
      <SearchAndAssistantContent {...props} />
    </SearchAssistantProvider>
  )
}
