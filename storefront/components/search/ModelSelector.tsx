'use client'

import { useState, useEffect } from 'react'
import { advancedSearchApi } from '@/lib/api-client'

interface MachineModel {
  id: string
  name: string
  year_from: number
  year_to: number
  power_hp: number
  weight_kg: number
  specs: any
  popularity_score: number
}

interface ModelSelectorProps {
  manufacturerId: string
  preSelected: string | null
  onSelect: (modelId: string) => void
}

export function ModelSelector({ manufacturerId, preSelected, onSelect }: ModelSelectorProps) {
  const [models, setModels] = useState<MachineModel[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedModel, setSelectedModel] = useState<MachineModel | null>(null)

  useEffect(() => {
    fetchModels()
  }, [manufacturerId])

  const fetchModels = async (query = '') => {
    try {
      const { results } = await advancedSearchApi.autocomplete(3, query, { manufacturerId })
      setModels(results)
    } catch (error) {
      console.error('Failed to fetch models:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    fetchModels(query)
  }

  const handleModelClick = (model: MachineModel) => {
    setSelectedModel(model)
  }

  const handleConfirm = () => {
    if (selectedModel) {
      onSelect(selectedModel.id)
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
          Step 3: Select Model
        </h2>
        <p className="text-neutral-600">
          Which specific model do you have?
        </p>
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search model... (e.g., 320D, PC200)"
          className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none"
          aria-label="Search models"
        />
      </div>

      {/* Models List */}
      <div className="space-y-3">
        {models.map((model) => (
          <button
            key={model.id}
            onClick={() => handleModelClick(model)}
            className={`w-full p-5 border-2 rounded-lg text-left transition-all duration-200 hover:shadow-md ${
              selectedModel?.id === model.id
                ? 'border-primary-600 bg-primary-50'
                : 'border-neutral-300 hover:border-primary-400'
            }`}
            aria-label={`Select ${model.name}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-bold text-xl text-neutral-900">
                  {model.name}
                </div>
                <div className="text-sm text-neutral-600">
                  Years: {model.year_from} - {model.year_to}
                </div>
              </div>
              {model.popularity_score >= 90 && (
                <div className="text-xs bg-yellow text-neutral-900 px-2 py-1 rounded">
                  ⭐ Popular
                </div>
              )}
            </div>

            {/* Specs Preview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="bg-neutral-100 px-3 py-2 rounded">
                <div className="text-neutral-600">Power</div>
                <div className="font-semibold text-neutral-900">{model.power_hp} HP</div>
              </div>
              <div className="bg-neutral-100 px-3 py-2 rounded">
                <div className="text-neutral-600">Weight</div>
                <div className="font-semibold text-neutral-900">{model.weight_kg} kg</div>
              </div>
              {model.specs?.engine && (
                <div className="bg-neutral-100 px-3 py-2 rounded">
                  <div className="text-neutral-600">Engine</div>
                  <div className="font-semibold text-neutral-900">{model.specs.engine}</div>
                </div>
              )}
              {model.specs?.bucket_capacity && (
                <div className="bg-neutral-100 px-3 py-2 rounded">
                  <div className="text-neutral-600">Bucket</div>
                  <div className="font-semibold text-neutral-900">{model.specs.bucket_capacity}</div>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {models.length === 0 && (
        <div className="text-center py-12 text-neutral-500">
          No models found. Try a different search term.
        </div>
      )}

      {/* Confirm Button */}
      {selectedModel && (
        <div className="sticky bottom-0 bg-white pt-4 border-t border-neutral-200">
          <button
            onClick={handleConfirm}
            className="w-full py-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-all duration-200 transform hover:scale-[1.02]"
          >
            Continue with {selectedModel.name}
          </button>
        </div>
      )}
    </div>
  )
}
