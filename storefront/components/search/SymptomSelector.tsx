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

  const symptomIcons = {
    pump: <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>,
    engine: <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    fire: <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>,
    bolt: <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    light: <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
    battery: <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8h16a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4a2 2 0 012-2zm16 0V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2m16 8v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2" /></svg>,
    brake: <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
  }

  const commonSymptoms = [
    { icon: 'pump', text: 'Pump not working', text_pl: 'Pompa nie działa' },
    { icon: 'pump', text: 'Pump is leaking', text_pl: 'Pompa przecieka' },
    { icon: 'engine', text: 'Engine won\'t start', text_pl: 'Silnik nie odpala' },
    { icon: 'fire', text: 'Engine overheating', text_pl: 'Silnik się przegrzewa' },
    { icon: 'bolt', text: 'No power', text_pl: 'Brak mocy' },
    { icon: 'light', text: 'Lights not working', text_pl: 'Światła nie działają' },
    { icon: 'battery', text: 'Battery dead', text_pl: 'Akumulator rozładowany' },
    { icon: 'brake', text: 'Brake not working', text_pl: 'Hamulec nie działa' },
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
        <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center gap-2">
          <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          Describe your issue:
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
            <svg className="absolute right-3 top-3 animate-spin w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          )}

          {/* AI Suggestions Dropdown */}
          {showSuggestions && aiSuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-2 bg-white border-2 border-primary-500 rounded-lg shadow-xl max-h-64 overflow-y-auto">
              <div className="p-2 bg-primary-50 border-b border-primary-200 text-sm font-medium text-primary-900 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                AI Suggestions:
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
              <div>{symptomIcons[symptom.icon as keyof typeof symptomIcons]}</div>
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
          <svg className="w-6 h-6 text-info flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
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
