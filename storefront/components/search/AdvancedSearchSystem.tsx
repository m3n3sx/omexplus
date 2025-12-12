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

interface SearchState {
  step: number
  machineType: string | null
  manufacturer: string | null
  model: string | null
  symptom: string | null
  category: string | null
  selectedPart: string | null
}

export function AdvancedSearchSystem() {
  const [searchState, setSearchState] = useState<SearchState>({
    step: 0,
    machineType: null,
    manufacturer: null,
    model: null,
    symptom: null,
    category: null,
    selectedPart: null
  })

  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [sessionId] = useState(`session_${Date.now()}`)

  // Track analytics
  useEffect(() => {
    if (searchState.step > 0) {
      trackSearchStep()
    }
  }, [searchState.step])

  const handleInitialSearch = async (query: string) => {
    setIsAnalyzing(true)
    
    try {
      // Analyze query with AI
      const response = await fetch('/api/advanced-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'analyze-query',
          query
        })
      })

      const { analysis } = await response.json()

      // Pre-fill wizard based on AI analysis
      setSearchState(prev => ({
        ...prev,
        step: 1,
        machineType: analysis.machineType,
        manufacturer: analysis.manufacturer,
        model: analysis.model,
        symptom: analysis.issue
      }))

      // Jump to appropriate step based on what was detected
      if (analysis.model) {
        setSearchState(prev => ({ ...prev, step: 4 }))
      } else if (analysis.manufacturer) {
        setSearchState(prev => ({ ...prev, step: 3 }))
      } else if (analysis.machineType) {
        setSearchState(prev => ({ ...prev, step: 2 }))
      }
    } catch (error) {
      console.error('Query analysis failed:', error)
      // Fallback to manual wizard
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
    <div className="min-h-screen bg-neutral-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 mb-2">
            🔍 Advanced Parts Search
          </h1>
          <p className="text-lg text-neutral-600">
            Find the perfect part for your machinery in 6 easy steps
          </p>
        </div>

        {/* Progress Bar */}
        {searchState.step > 0 && (
          <ProgressBar 
            currentStep={searchState.step} 
            totalSteps={6}
            onBack={handleBack}
            onReset={handleReset}
          />
        )}

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
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
                onSelectPart={(partId) => setSearchState(prev => ({ ...prev, selectedPart: partId }))}
              />

              {/* Compatibility Validator */}
              {searchState.selectedPart && (
                <CompatibilityValidator
                  machineModelId={searchState.model!}
                  partId={searchState.selectedPart}
                />
              )}

              {/* Recommendations */}
              <RecommendationPanel
                machineModelId={searchState.model!}
                partId={searchState.selectedPart}
              />
            </div>
          )}
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-neutral-500">
          <p>Need help? Our AI-powered search guides you step-by-step to find compatible parts.</p>
          <p className="mt-1">All parts are validated for compatibility before purchase.</p>
        </div>
      </div>
    </div>
  )
}
