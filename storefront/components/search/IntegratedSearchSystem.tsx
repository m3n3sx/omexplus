'use client'

import { useState, useEffect } from 'react'
import { SearchInput } from './SearchInput'
import { MachineTypeSelector } from './MachineTypeSelector'
import { ManufacturerSelector } from './ManufacturerSelector'
import { ModelSelector } from './ModelSelector'
import { SymptomSelector } from './SymptomSelector'
import { CategorySelector } from './CategorySelector'
import { PartResults } from './PartResults'
import { CompatibilityValidator } from './CompatibilityValidator'
import { RecommendationPanel } from './RecommendationPanel'
import { ProgressBar } from './ProgressBar'
import { useSearchAssistant } from '@/contexts/SearchAssistantContext'

interface SearchState {
  step: number
  machineType: string | null
  manufacturer: string | null
  model: string | null
  symptom: string | null
  category: string | null
  selectedPart: string | null
}

interface IntegratedSearchSystemProps {
  initialData?: Partial<SearchState>
  onPartSelected?: (part: any) => void
  onBack?: () => void
  showBackButton?: boolean
}

export function IntegratedSearchSystem({ 
  initialData,
  onPartSelected,
  onBack,
  showBackButton = false
}: IntegratedSearchSystemProps) {
  const [searchState, setSearchState] = useState<SearchState>({
    step: initialData?.step || 0,
    machineType: initialData?.machineType || null,
    manufacturer: initialData?.manufacturer || null,
    model: initialData?.model || null,
    symptom: initialData?.symptom || null,
    category: initialData?.category || null,
    selectedPart: null
  })

  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [sessionId] = useState(`session_${Date.now()}`)
  const [showHelpButton, setShowHelpButton] = useState(true)

  const { 
    updateSearchData, 
    requestAssistantHelp,
    returnToAssistant,
    trackSearchBehavior 
  } = useSearchAssistant()

  // Apply initial data from assistant
  useEffect(() => {
    if (initialData) {
      setSearchState(prev => ({
        ...prev,
        ...initialData
      }))
      
      // Jump to appropriate step
      if (initialData.category) {
        setSearchState(prev => ({ ...prev, step: 6 }))
      } else if (initialData.symptom) {
        setSearchState(prev => ({ ...prev, step: 5 }))
      } else if (initialData.model) {
        setSearchState(prev => ({ ...prev, step: 4 }))
      } else if (initialData.manufacturer) {
        setSearchState(prev => ({ ...prev, step: 3 }))
      } else if (initialData.machineType) {
        setSearchState(prev => ({ ...prev, step: 2 }))
      }
    }
  }, [initialData])

  // Sync with context
  useEffect(() => {
    updateSearchData(searchState)
  }, [searchState])

  // Track analytics
  useEffect(() => {
    if (searchState.step > 0) {
      trackSearchStep()
    }
  }, [searchState.step])

  const handleInitialSearch = async (query: string) => {
    setIsAnalyzing(true)
    
    try {
      const response = await fetch('/api/advanced-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'analyze-query',
          query
        })
      })

      const { analysis } = await response.json()

      setSearchState(prev => ({
        ...prev,
        step: 1,
        machineType: analysis.machineType,
        manufacturer: analysis.manufacturer,
        model: analysis.model,
        symptom: analysis.issue
      }))

      if (analysis.model) {
        setSearchState(prev => ({ ...prev, step: 4 }))
      } else if (analysis.manufacturer) {
        setSearchState(prev => ({ ...prev, step: 3 }))
      } else if (analysis.machineType) {
        setSearchState(prev => ({ ...prev, step: 2 }))
      }

      trackSearchBehavior('initial_search', { query, analysis })
    } catch (error) {
      console.error('Query analysis failed:', error)
      setSearchState(prev => ({ ...prev, step: 1 }))
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleStepComplete = (stepData: Partial<SearchState>) => {
    setSearchState(prev => ({
      ...prev,
      ...stepData,
      step: prev.step + 1
    }))
    
    trackSearchBehavior('step_complete', { step: searchState.step, data: stepData })
  }

  const handleBack = () => {
    setSearchState(prev => ({
      ...prev,
      step: Math.max(0, prev.step - 1)
    }))
  }

  const handleReset = () => {
    setSearchState({
      step: 0,
      machineType: null,
      manufacturer: null,
      model: null,
      symptom: null,
      category: null,
      selectedPart: null
    })
    
    trackSearchBehavior('reset', {})
  }

  const handlePartSelection = (partId: string, partData: any) => {
    setSearchState(prev => ({ ...prev, selectedPart: partId }))
    
    if (onPartSelected) {
      onPartSelected(partData)
    }
    
    trackSearchBehavior('part_selected', { partId, partData })
  }

  const handleRequestHelp = () => {
    requestAssistantHelp(searchState.step, {
      machineType: searchState.machineType,
      manufacturer: searchState.manufacturer,
      model: searchState.model,
      symptom: searchState.symptom
    })
  }

  const handleReturnToAssistant = () => {
    if (searchState.selectedPart) {
      returnToAssistant({
        id: searchState.selectedPart,
        name: 'Selected Part' // Would fetch actual part data
      })
    } else {
      returnToAssistant()
    }
    
    if (onBack) {
      onBack()
    }
  }

  const trackSearchStep = async () => {
    try {
      await fetch('/api/advanced-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'track-analytics',
          sessionId,
          machineTypeId: searchState.machineType,
          manufacturerId: searchState.manufacturer,
          machineModelId: searchState.model,
          symptom: searchState.symptom
        })
      })
    } catch (error) {
      console.error('Analytics tracking failed:', error)
    }
  }

  return (
    <div className="h-full flex flex-col bg-neutral-50">
      {/* Header with back button */}
      <div className="bg-white border-b border-neutral-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <button
                onClick={handleReturnToAssistant}
                className="text-neutral-600 hover:text-neutral-900 transition-colors"
                aria-label="Back to assistant"
              >
                ← Back
              </button>
            )}
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">
                🔍 Advanced Search
              </h2>
              <p className="text-sm text-neutral-600">
                Find the perfect part in 6 easy steps
              </p>
            </div>
          </div>
          
          {showHelpButton && searchState.step > 0 && (
            <button
              onClick={handleRequestHelp}
              className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors flex items-center gap-2"
            >
              <span>💡</span>
              <span>Need help?</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {searchState.step > 0 && (
        <div className="bg-white border-b border-neutral-200 px-6 py-3">
          <ProgressBar 
            currentStep={searchState.step} 
            totalSteps={6}
            onBack={handleBack}
            onReset={handleReset}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto">
          {/* Step 0: Initial Search */}
          {searchState.step === 0 && (
            <SearchInput 
              onSearch={handleInitialSearch}
              isAnalyzing={isAnalyzing}
            />
          )}

          {/* Step 1: Machine Type */}
          {searchState.step === 1 && (
            <MachineTypeSelector
              preSelected={searchState.machineType}
              onSelect={(machineType) => handleStepComplete({ machineType })}
            />
          )}

          {/* Step 2: Manufacturer */}
          {searchState.step === 2 && (
            <ManufacturerSelector
              machineTypeId={searchState.machineType!}
              preSelected={searchState.manufacturer}
              onSelect={(manufacturer) => handleStepComplete({ manufacturer })}
            />
          )}

          {/* Step 3: Model */}
          {searchState.step === 3 && (
            <ModelSelector
              manufacturerId={searchState.manufacturer!}
              preSelected={searchState.model}
              onSelect={(model) => handleStepComplete({ model })}
            />
          )}

          {/* Step 4: Symptom/Issue */}
          {searchState.step === 4 && (
            <SymptomSelector
              machineModelId={searchState.model!}
              preSelected={searchState.symptom}
              onSelect={(symptom) => handleStepComplete({ symptom })}
            />
          )}

          {/* Step 5: Category (AI Suggested) */}
          {searchState.step === 5 && (
            <CategorySelector
              symptom={searchState.symptom!}
              machineModelId={searchState.model!}
              onSelect={(category) => handleStepComplete({ category })}
            />
          )}

          {/* Step 6: Part Results */}
          {searchState.step === 6 && (
            <div className="space-y-6">
              <PartResults
                machineModelId={searchState.model!}
                categoryId={searchState.category!}
                onSelectPart={handlePartSelection}
              />

              {searchState.selectedPart && (
                <>
                  <CompatibilityValidator
                    machineModelId={searchState.model!}
                    partId={searchState.selectedPart}
                  />

                  <RecommendationPanel
                    machineModelId={searchState.model!}
                    partId={searchState.selectedPart}
                  />

                  {showBackButton && (
                    <div className="flex justify-center">
                      <button
                        onClick={handleReturnToAssistant}
                        className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        Continue with Assistant →
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
