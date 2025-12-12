'use client'

import { useState, useEffect } from 'react'
import { advancedSearchApi } from '@/lib/api-client'

interface MachineType {
  id: string
  name: string
  name_pl: string
  emoji: string
  popularity_score: number
}

interface MachineTypeSelectorProps {
  preSelected: string | null
  onSelect: (machineTypeId: string) => void
}

export function MachineTypeSelector({ preSelected, onSelect }: MachineTypeSelectorProps) {
  const [machineTypes, setMachineTypes] = useState<MachineType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchMachineTypes()
  }, [])

  const fetchMachineTypes = async () => {
    try {
      const { results } = await advancedSearchApi.autocomplete(1, '')
      setMachineTypes(results)
    } catch (error) {
      console.error('Failed to fetch machine types:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (query.length > 0) {
      try {
        const { results } = await advancedSearchApi.autocomplete(1, query)
        setMachineTypes(results)
      } catch (error) {
        console.error('Search failed:', error)
      }
    } else {
      fetchMachineTypes()
    }
  }

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
          Step 1: Select Machine Type
        </h2>
        <p className="text-neutral-600">
          What type of machinery do you have?
        </p>
      </div>

      {/* Search Input */}
      <div className="relative mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search machine type... (e.g., excavator, koparka)"
          className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none"
          aria-label="Search machine types"
        />
      </div>

      {/* Machine Type Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {machineTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => onSelect(type.id)}
            className={`p-6 border-2 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg ${
              preSelected === type.id
                ? 'border-primary-600 bg-primary-50'
                : 'border-neutral-300 hover:border-primary-400'
            }`}
            aria-label={`Select ${type.name}`}
          >
            <div className="text-4xl mb-2">{type.emoji}</div>
            <div className="font-semibold text-neutral-900">{type.name}</div>
            <div className="text-sm text-neutral-600">{type.name_pl}</div>
            {type.popularity_score >= 80 && (
              <div className="mt-2 text-xs bg-yellow text-neutral-900 px-2 py-1 rounded">
                ⭐ Popular
              </div>
            )}
          </button>
        ))}
      </div>

      {machineTypes.length === 0 && (
        <div className="text-center py-12 text-neutral-500">
          No machine types found. Try a different search term.
        </div>
      )}
    </div>
  )
}
