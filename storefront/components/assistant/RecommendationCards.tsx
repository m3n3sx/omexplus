'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Recommendation {
  id: string
  name: string
  price: number
  image?: string
  confidence: number
  reason: string
}

interface RecommendationCardsProps {
  partId?: string
  machineModelId?: string
  language?: string
}

export function RecommendationCards({ 
  partId, 
  machineModelId,
  language = 'en' 
}: RecommendationCardsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (partId || machineModelId) {
      loadRecommendations()
    }
  }, [partId, machineModelId])

  const loadRecommendations = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (partId) params.append('partId', partId)
      if (machineModelId) params.append('machineModelId', machineModelId)

      const response = await fetch(`/api/advanced-search?action=recommendations&${params}`)
      const data = await response.json()

      if (data.success) {
        setRecommendations(data.recommendations || [])
      }
    } catch (error) {
      console.error('Failed to load recommendations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToCart = (recommendation: Recommendation) => {
    console.log('Add to cart:', recommendation)
    // Implement add to cart logic
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-neutral-100 rounded-lg h-48 animate-pulse" />
        ))}
      </div>
    )
  }

  if (recommendations.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-neutral-900">
        {language === 'pl' ? '🎯 Polecane dla Ciebie' : '🎯 Recommended for You'}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="bg-white border border-neutral-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            {/* Image */}
            <div className="relative w-full h-32 mb-3 bg-neutral-100 rounded-lg overflow-hidden">
              {rec.image ? (
                <Image
                  src={rec.image}
                  alt={rec.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">
                  🔧
                </div>
              )}
            </div>

            {/* Info */}
            <h4 className="font-semibold text-neutral-900 mb-1 line-clamp-2">
              {rec.name}
            </h4>
            
            <p className="text-sm text-neutral-600 mb-2 line-clamp-2">
              {rec.reason}
            </p>

            {/* Confidence */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 bg-neutral-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all"
                  style={{ width: `${rec.confidence}%` }}
                />
              </div>
              <span className="text-xs text-neutral-600">
                {rec.confidence}%
              </span>
            </div>

            {/* Price & Action */}
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-primary-600">
                ${rec.price.toFixed(2)}
              </span>
              <button
                onClick={() => handleAddToCart(rec)}
                className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors"
              >
                {language === 'pl' ? 'Dodaj' : 'Add'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
