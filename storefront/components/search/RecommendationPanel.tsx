'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Recommendation {
  id: string
  title: string
  thumbnail: string
  price: number
  reason: string
  in_stock: boolean
}

interface RecommendationPanelProps {
  machineModelId: string
  partId: string | null
}

export function RecommendationPanel({ machineModelId, partId }: RecommendationPanelProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecommendations()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [machineModelId, partId])

  const fetchRecommendations = async () => {
    try {
      const params = partId 
        ? `partId=${partId}` 
        : `machineId=${machineModelId}`
      
      const response = await fetch(
        `/api/advanced-search?action=recommendations&${params}`
      )
      const { recommendations: recs } = await response.json()
      setRecommendations(recs)
    } catch (error) {
      console.error('Failed to fetch recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 bg-neutral-100 rounded-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-neutral-300 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-neutral-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (recommendations.length === 0) return null

  return (
    <div className="p-6 bg-neutral-50 rounded-lg border border-neutral-200">
      <h3 className="text-xl font-bold text-neutral-900 mb-4">
        🤝 Frequently Bought Together
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="bg-white p-4 rounded-lg border border-neutral-300 hover:border-primary-500 hover:shadow-md transition-all"
          >
            <div className="relative w-full h-32 bg-neutral-100 rounded mb-3">
              <Image
                src={rec.thumbnail || '/placeholder.svg'}
                alt={rec.title}
                fill
                className="object-cover rounded"
              />
            </div>
            <h4 className="font-semibold text-neutral-900 mb-1 line-clamp-2">
              {rec.title}
            </h4>
            <p className="text-sm text-neutral-600 mb-2">
              {rec.reason}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-primary-600">
                ${rec.price.toFixed(2)}
              </span>
              <button className="px-3 py-1 bg-primary-600 text-white text-sm font-semibold rounded hover:bg-primary-700 transition-colors">
                Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
