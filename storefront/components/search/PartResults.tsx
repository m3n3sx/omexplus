'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Part {
  id: string
  title: string
  description: string
  thumbnail: string
  price: number
  compatibility_level: string
  confidence_score: number
  is_original: boolean
  in_stock: boolean
  quantity: number
}

interface PartResultsProps {
  machineModelId: string
  categoryId: string
  onSelectPart: (partId: string) => void
}

export function PartResults({ machineModelId, categoryId, onSelectPart }: PartResultsProps) {
  const [parts, setParts] = useState<Part[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'compatibility' | 'price'>('compatibility')
  const [filterInStock, setFilterInStock] = useState(false)

  useEffect(() => {
    fetchParts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [machineModelId, categoryId])

  const fetchParts = async () => {
    try {
      const response = await fetch('/api/advanced-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'suggest-parts',
          machineModelId,
          categoryId: categoryId !== 'all' ? categoryId : null
        })
      })

      const { parts: fetchedParts } = await response.json()
      setParts(fetchedParts)
    } catch (error) {
      console.error('Failed to fetch parts:', error)
    } finally {
      setLoading(false)
    }
  }

  const sortedParts = [...parts]
    .filter(part => !filterInStock || part.in_stock)
    .sort((a, b) => {
      if (sortBy === 'compatibility') {
        return b.confidence_score - a.confidence_score
      }
      return a.price - b.price
    })

  const getCompatibilityBadge = (level: string, confidence: number) => {
    switch (level) {
      case 'perfect':
        return { text: '✅ Perfect Match', color: 'bg-success text-white', score: confidence }
      case 'compatible':
        return { text: '⚠️ Compatible', color: 'bg-warning text-neutral-900', score: confidence }
      case 'check_specs':
        return { text: '❓ Check Specs', color: 'bg-info text-white', score: confidence }
      default:
        return { text: '❌ Not Compatible', color: 'bg-danger text-white', score: 0 }
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-12">
        <div className="animate-spin text-4xl mb-4">⚙️</div>
        <p className="text-neutral-600">Finding compatible parts...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
          Step 6: Compatible Parts
        </h2>
        <p className="text-neutral-600">
          Found {sortedParts.length} compatible parts for your machine
        </p>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col md:flex-row gap-4 p-4 bg-neutral-100 rounded-lg">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-neutral-700">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'compatibility' | 'price')}
            className="px-3 py-2 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none"
          >
            <option value="compatibility">Best Match</option>
            <option value="price">Lowest Price</option>
          </select>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filterInStock}
            onChange={(e) => setFilterInStock(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm font-medium text-neutral-700">In Stock Only</span>
        </label>
      </div>

      {/* Parts Grid */}
      <div className="space-y-4">
        {sortedParts.map((part) => {
          const badge = getCompatibilityBadge(part.compatibility_level, part.confidence_score)
          
          return (
            <div
              key={part.id}
              className="border-2 border-neutral-300 rounded-lg p-5 hover:border-primary-500 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex flex-col md:flex-row gap-5">
                {/* Image */}
                <div className="w-full md:w-48 h-48 relative bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={part.thumbnail || '/placeholder.svg'}
                    alt={part.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-neutral-900 mb-1">
                        {part.title}
                      </h3>
                      <p className="text-sm text-neutral-600 line-clamp-2">
                        {part.description}
                      </p>
                    </div>
                    {part.is_original && (
                      <span className="text-xs bg-primary-600 text-white px-3 py-1 rounded font-semibold">
                        ORIGINAL
                      </span>
                    )}
                  </div>

                  {/* Compatibility Badge */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`text-sm px-3 py-1 rounded font-semibold ${badge.color}`}>
                      {badge.text}
                    </span>
                    <span className="text-sm text-neutral-600">
                      {Math.round(badge.score)}% confidence
                    </span>
                  </div>

                  {/* Compatibility Bar */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-neutral-700">Compatibility:</span>
                      <span className="text-xs text-neutral-600">{Math.round(badge.score)}%</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          badge.score >= 90 ? 'bg-success' :
                          badge.score >= 70 ? 'bg-warning' :
                          'bg-danger'
                        }`}
                        style={{ width: `${badge.score}%` }}
                      />
                    </div>
                  </div>

                  {/* Price and Stock */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-primary-600">
                        ${part.price.toFixed(2)}
                      </div>
                      <div className="text-sm text-neutral-600">
                        {part.in_stock ? (
                          <span className="text-success">✓ In Stock ({part.quantity} available)</span>
                        ) : (
                          <span className="text-danger">✗ Out of Stock</span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectPart(part.id)}
                      disabled={!part.in_stock}
                      className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                    >
                      {part.in_stock ? 'Select Part' : 'Notify When Available'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {sortedParts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">😕</div>
          <h3 className="text-xl font-semibold text-neutral-900 mb-2">
            No compatible parts found
          </h3>
          <p className="text-neutral-600 mb-4">
            Try adjusting your filters or contact our support team for assistance.
          </p>
          <button
            onClick={() => setFilterInStock(false)}
            className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700"
          >
            Show All Parts
          </button>
        </div>
      )}
    </div>
  )
}
