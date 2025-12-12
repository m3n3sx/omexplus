'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface SearchData {
  machineType?: string | null
  manufacturer?: string | null
  model?: string | null
  symptom?: string | null
  category?: string | null
  partId?: string | null
}

interface SearchAssistantContextType {
  // State
  isSearchActive: boolean
  isAssistantActive: boolean
  searchData: SearchData
  conversationContext: any
  
  // Actions
  launchSearchFromAssistant: (prefilledData: SearchData) => void
  returnToAssistant: (selectedPart?: any) => void
  requestAssistantHelp: (step: number, context: any) => void
  updateSearchData: (data: Partial<SearchData>) => void
  trackSearchBehavior: (action: string, data: any) => void
}

const SearchAssistantContext = createContext<SearchAssistantContextType | undefined>(undefined)

export function SearchAssistantProvider({ children }: { children: ReactNode }) {
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [isAssistantActive, setIsAssistantActive] = useState(true)
  const [searchData, setSearchData] = useState<SearchData>({})
  const [conversationContext, setConversationContext] = useState<any>(null)

  const launchSearchFromAssistant = (prefilledData: SearchData) => {
    setSearchData(prefilledData)
    setIsSearchActive(true)
    setIsAssistantActive(false)
    
    // Track transition
    trackSearchBehavior('launch_from_assistant', prefilledData)
  }

  const returnToAssistant = (selectedPart?: any) => {
    setIsSearchActive(false)
    setIsAssistantActive(true)
    
    if (selectedPart) {
      setConversationContext({
        type: 'part_selected',
        part: selectedPart,
        searchData
      })
    }
    
    // Track return
    trackSearchBehavior('return_to_assistant', { selectedPart })
  }

  const requestAssistantHelp = (step: number, context: any) => {
    setConversationContext({
      type: 'help_requested',
      step,
      context,
      searchData
    })
    setIsAssistantActive(true)
    
    // Track help request
    trackSearchBehavior('request_help', { step, context })
  }

  const updateSearchData = (data: Partial<SearchData>) => {
    setSearchData(prev => ({ ...prev, ...data }))
  }

  const trackSearchBehavior = async (action: string, data: any) => {
    try {
      await fetch('/api/search-assistant-analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          data,
          timestamp: new Date().toISOString()
        })
      })
    } catch (error) {
      console.error('Failed to track behavior:', error)
    }
  }

  return (
    <SearchAssistantContext.Provider
      value={{
        isSearchActive,
        isAssistantActive,
        searchData,
        conversationContext,
        launchSearchFromAssistant,
        returnToAssistant,
        requestAssistantHelp,
        updateSearchData,
        trackSearchBehavior
      }}
    >
      {children}
    </SearchAssistantContext.Provider>
  )
}

export function useSearchAssistant() {
  const context = useContext(SearchAssistantContext)
  if (!context) {
    throw new Error('useSearchAssistant must be used within SearchAssistantProvider')
  }
  return context
}
