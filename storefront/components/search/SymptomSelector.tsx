'use client'

import { useState, useEffect } from 'react'
import { advancedSearchApi } from '@/lib/api-client'

interface Symptom {
  id: string
  symptom_text: string
  symptom_text_pl: string
  category: string
  subcategory: string
  confidence_score: number
}

interface SymptomSelectorProps {
  machineModelId: string
  preSelected: string | null
  onSelect: (symptom: string) => void
}

export function SymptomSelector({ machineModelId, preSelected, onSelect }: SymptomSelectorProps) {
  const [symptoms, setSymptoms] = useState<Symptom[]>([])
  const [loading, setLoading] = useState(false)
  const [customSymptom, setCustomSymptom] = useState('')
  const [aiSuggestions, setAiSuggestions] = useState<Symptom[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const commonSymptoms = [
    { emoji: '💧', text: 'Pump not working', text_pl: 'Pompa nie działa' },
    { emoji: '💧', text: 'Pump is leaking', text_pl: 'Pompa przecieka' },
    { emoji: '⚙️', text: 'Engine won\'t start', text_pl: 'Silnik nie odpala' },
    { emoji: '🔥', text: 'Engine overheating', text_pl: 'Silnik się przegrzewa' },
    { emoji: '⚡', text: 'No power', text_pl: 'Brak mocy' },
    { emoji: '💡', text: 'Lights not working', text_pl: 'Światła nie działają' },
    { emoji: '🔋', text: 'Battery dead', text_pl: 'Akumulator rozładowany' },
    { emoji: '🛑', text: 'Brake not working', text_pl: 'Hamulec nie działa' },
  ]

  const handleCustomSymptomChange = async (value: string) => {
    setCustomSymptom(value)
    
    if (value.length > 2) {
      setLoading(true)
      setShowSuggestions(true)
      
      try {
        const { results } = await advancedSearchApi.autocomplete(4, value)
        setAiSuggestions(results)
      } catch (error) {
        console.error('Failed to fetch symptom suggestions:', error)
      } finally {
        setLoading(false)
      }
    } else {
      setShowSuggestions(false)
      setAiSuggestions([])
    }
  }

  const handleSymptomSelect = (symptomText: string) => {
    onSelect(symptomText)
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
          Step 4: What's the Problem?
        </h2>
        <p className="text-neutral-600">
          Describe the issue in your own words - our AI will understand
        </p>
      </div>

      {/* Custom Symptom Input (AI-Powered) */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          🤖 Describe your issue:
        </label>
        <div className="relative">
          <textarea
            value={customSymptom}
            onChange={(e) => handleCustomSymptomChange(e.target.value)}
            placeholder="e.g., My hydraulic pump is making noise and leaking oil..."
            className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none resize-none"
            rows={3}
            aria-label="Describe your issue"
          />
          
          {loading && (
            <div className="absolute right-3 top-3 animate-spin">⚙️</div>
          )}

          {/* AI Suggestions Dropdown */}
          {showSuggestions && aiSuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-2 bg-white border-2 border-primary-500 rounded-lg shadow-xl max-h-64 overflow-y-auto">
              <div className="p-2 bg-primary-50 border-b border-primary-200 text-sm font-medium text-primary-900">
                🤖 AI Suggestions:
              </div>
              {aiSuggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => {
                    handleSymptomSelect(suggestion.symptom_text)
                    setShowSuggestions(false)
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-primary-50 transition-colors border-b border-neutral-100 last:border-0"
                >
                  <div className="font-medium text-neutral-900">
                    {suggestion.symptom_text}
                  </div>
                  <div className="text-sm text-neutral-600">
                    {suggestion.symptom_text_pl}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-primary-100 text-primary-900 px-2 py-0.5 rounded">
                      {suggestion.category} → {suggestion.subcategory}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {Math.round(suggestion.confidence_score)}% match
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {customSymptom.length > 3 && (
          <button
            onClick={() => handleSymptomSelect(customSymptom)}
            className="mt-3 w-full py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-all"
          >
            Continue with: "{customSymptom}"
          </button>
        )}
      </div>

      {/* OR Divider */}
      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-300"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-4 text-neutral-500 font-medium">OR SELECT COMMON ISSUE</span>
        </div>
      </div>

      {/* Common Symptoms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {commonSymptoms.map((symptom, index) => (
          <button
            key={index}
            onClick={() => handleSymptomSelect(symptom.text)}
            className="p-4 border-2 border-neutral-300 rounded-lg text-left hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 hover:scale-[1.02]"
            aria-label={`Select ${symptom.text}`}
          >
            <div className="flex items-center gap-3">
              <div className="text-3xl">{symptom.emoji}</div>
              <div>
                <div className="font-semibold text-neutral-900">{symptom.text}</div>
                <div className="text-sm text-neutral-600">{symptom.text_pl}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Help Text */}
      <div className="mt-6 p-4 bg-info/10 border border-info/30 rounded-lg">
        <div className="flex gap-3">
          <div className="text-2xl">💡</div>
          <div>
            <div className="font-semibold text-neutral-900 mb-1">
              Not sure what's wrong?
            </div>
            <p className="text-sm text-neutral-700">
              Just describe what you're experiencing. Our AI understands natural language like:
              "pump making weird noise", "no hydraulic pressure", "engine won't turn over"
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
