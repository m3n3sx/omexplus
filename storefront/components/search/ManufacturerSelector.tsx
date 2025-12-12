'use client'

import { useState, useEffect } from 'react'
import { advancedSearchApi } from '@/lib/api-client'

interface Manufacturer {
  id: string
  name: string
  popularity_score: number
  region: string
}

interface ManufacturerSelectorProps {
  machineTypeId: string
  preSelected: string | null
  onSelect: (manufacturerId: string) => void
}

export function ManufacturerSelector({ machineTypeId, preSelected, onSelect }: ManufacturerSelectorProps) {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'popularity' | 'name'>('popularity')

  useEffect(() => {
    fetchManufacturers()
  }, [machineTypeId])

  const fetchManufacturers = async (query = '') => {
    try {
      const { results } = await advancedSearchApi.autocomplete(2, query, { machineTypeId })
      setManufacturers(results)
    } catch (error) {
      console.error('Failed to fetch manufacturers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    fetchManufacturers(query)
  }

  const sortedManufacturers = [...manufacturers].sort((a, b) => {
    if (sortBy === 'popularity') {
      return b.popularity_score - a.popularity_score
    }
    return a.name.localeCompare(b.name)
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin text-4xl">⚙️</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
          Step 2: Select Manufacturer
        </h2>
        <p className="text-neutral-600">
          Who made your machine?
        </p>
      </div>

      {/* Search and Sort */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search manufacturer... (e.g., CAT, Komatsu)"
            className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none"
            aria-label="Search manufacturers"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'popularity' | 'name')}
          className="px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none"
          aria-label="Sort manufacturers"
        >
          <option value="popularity">Sort by Popularity</option>
          <option value="name">Sort by Name</option>
        </select>
      </div>

      {/* Manufacturers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedManufacturers.map((manufacturer) => (
          <button
            key={manufacturer.id}
            onClick={() => onSelect(manufacturer.id)}
            className={`p-6 border-2 rounded-lg text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-lg ${
              preSelected === manufacturer.id
                ? 'border-primary-600 bg-primary-50'
                : 'border-neutral-300 hover:border-primary-400'
            }`}
            aria-label={`Select ${manufacturer.name}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="font-bold text-lg text-neutral-900 mb-1">
                  {manufacturer.name}
                </div>
                <div className="text-sm text-neutral-600">
                  Region: {manufacturer.region}
                </div>
              </div>
              {manufacturer.popularity_score >= 90 && (
                <div className="text-xs bg-yellow text-neutral-900 px-2 py-1 rounded h-fit">
                  ⭐ Top Choice
                </div>
              )}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 bg-neutral-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all"
                  style={{ width: `${manufacturer.popularity_score}%` }}
                />
              </div>
              <span className="text-xs text-neutral-600">
                {manufacturer.popularity_score}%
              </span>
            </div>
          </button>
        ))}
      </div>

      {sortedManufacturers.length === 0 && (
        <div className="text-center py-12 text-neutral-500">
          No manufacturers found. Try a different search term.
        </div>
      )}
    </div>
  )
}
