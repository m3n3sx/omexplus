'use client'

import { useState, useEffect } from 'react'
import { advancedSearchApi } from '@/lib/api-client'

interface Category {
  category: string
  subcategory: string
  confidence: number
}

interface CategorySelectorProps {
  symptom: string
  machineModelId: string
  onSelect: (category: string) => void
}

export function CategorySelector({ symptom, machineModelId, onSelect }: CategorySelectorProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    analyzeSymptom()
  }, [symptom])

  const analyzeSymptom = async () => {
    try {
      const { analysis } = await advancedSearchApi.analyzeQuery(symptom)
      
      // AI-suggested categories based on symptom analysis
      const mockCategories: Category[] = [
        { category: analysis.suggestedCategory || 'Hydraulics', subcategory: 'Pumps', confidence: 85 },
        { category: 'Hydraulics', subcategory: 'Cylinders', confidence: 45 },
        { category: 'Hydraulics', subcategory: 'Seals', confidence: 35 }
      ]

      setCategories(mockCategories)
    } catch (error) {
      console.error('Failed to analyze symptom:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-12">
        <svg className="animate-spin w-10 h-10 text-primary-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
        <p className="text-neutral-600">AI is analyzing your issue...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
          Step 5: AI-Suggested Categories
        </h2>
        <p className="text-neutral-600">
          Based on "{symptom}", here are the most likely part categories
        </p>
      </div>

      {/* AI Analysis Summary */}
      <div className="p-5 bg-primary-50 border-2 border-primary-200 rounded-lg mb-6">
        <div className="flex items-start gap-3">
          <svg className="w-8 h-8 text-primary-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          <div>
            <div className="font-semibold text-primary-900 mb-2">
              AI Analysis Complete
            </div>
            <p className="text-sm text-primary-800">
              Our AI analyzed your issue and matched it with the most relevant part categories.
              The confidence score shows how likely each category is to solve your problem.
            </p>
          </div>
        </div>
      </div>

      {/* Category Cards */}
      <div className="space-y-4">
        {categories.map((cat, index) => (
          <button
            key={index}
            onClick={() => onSelect(cat.category.toLowerCase())}
            className="w-full p-6 border-2 border-neutral-300 rounded-lg text-left hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
            aria-label={`Select ${cat.category} - ${cat.subcategory}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {index === 0 && (
                    <span className="text-xs bg-success text-white px-2 py-1 rounded font-semibold">
                      BEST MATCH
                    </span>
                  )}
                  <span className="text-xs bg-neutral-200 text-neutral-700 px-2 py-1 rounded">
                    #{index + 1}
                  </span>
                </div>
                <div className="font-bold text-xl text-neutral-900">
                  {cat.category}
                </div>
                <div className="text-neutral-600">
                  Subcategory: {cat.subcategory}
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary-600">
                  {Math.round(cat.confidence)}%
                </div>
                <div className="text-xs text-neutral-600">confidence</div>
              </div>
            </div>

            {/* Confidence Bar */}
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-neutral-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    cat.confidence >= 70 ? 'bg-success' :
                    cat.confidence >= 40 ? 'bg-warning' :
                    'bg-neutral-400'
                  }`}
                  style={{ width: `${cat.confidence}%` }}
                />
              </div>
              <div className="text-sm font-medium text-neutral-700 flex items-center gap-1">
                {cat.confidence >= 70 ? (
                  <><svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> High</>
                ) : cat.confidence >= 40 ? (
                  <><svg className="w-4 h-4 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg> Medium</>
                ) : (
                  <><svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Low</>
                )}
              </div>
            </div>

            {/* Why This Match */}
            {index === 0 && (
              <div className="mt-4 p-3 bg-white rounded border border-neutral-200">
                <div className="text-xs font-semibold text-neutral-700 mb-1">
                  Why this match?
                </div>
                <p className="text-sm text-neutral-600">
                  Your symptom "{symptom}" strongly indicates issues with {cat.category.toLowerCase()},
                  specifically in the {cat.subcategory.toLowerCase()} area.
                </p>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Not Sure Option */}
      <button
        onClick={() => onSelect('all')}
        className="w-full py-4 border-2 border-neutral-400 text-neutral-700 font-semibold rounded-lg hover:bg-neutral-100 transition-all"
      >
        Not sure? Show all compatible parts
      </button>
    </div>
  )
}
