'use client'

/**
 * MachineSelector Component - Progressive search with real data from API
 * METODA 1: WYSZUKIWANIE PO MASZYNIE
 */

import { useState, useEffect } from 'react'

interface MachineSelectorProps {
  onComplete: (params: MachineSearchParams) => void
  onCancel: () => void
}

export interface MachineSearchParams {
  brand: string
  machineType: string
  model: string
  series?: string
  engine?: string
}

interface Brand {
  id: string
  name: string
  code: string
  models: number
}

interface MachineType {
  id: string
  name: string
  code: string
  count: number
}

interface Model {
  id: string
  name: string
  code: string
  years: string | null
  weight: string | null
  engine: string | null
  displacement: string | null
  serialRange: string | null
}

// Brand logos mapping - using local SVG files in /public/brands/
const brandLogos: Record<string, string> = {
  'caterpillar': '/brands/caterpillar.svg',
  'cat': '/brands/caterpillar.svg',
  'komatsu': '/brands/komatsu.svg',
  'doosan': '/brands/doosan.svg',
  'jcb': '/brands/jcb.svg',
  'case': '/brands/case.svg',
  'case ih': '/brands/case.svg',
  'new holland': '/brands/new-holland.svg',
  'newholland': '/brands/new-holland.svg',
  'bobcat': '/brands/bobcat.svg',
  'hitachi': '/brands/hitachi.svg',
  'volvo': '/brands/volvo.svg',
  'volvo ce': '/brands/volvo.svg',
  'terex': '/brands/terex.svg',
  'hyundai': '/brands/hyundai.svg',
  'hyundai ce': '/brands/hyundai.svg',
  'yanmar': '/brands/yanmar.svg',
  'liebherr': '/brands/liebherr.svg',
  'john deere': '/brands/john-deere.svg',
  'johndeere': '/brands/john-deere.svg',
  'deere': '/brands/john-deere.svg',
  'kubota': '/brands/kubota.svg',
  'takeuchi': '/brands/takeuchi.svg',
  'kobelco': '/brands/kobelco.svg',
  'sumitomo': '/brands/sumitomo.svg',
  'sany': '/brands/sany.svg',
  'xcmg': '/brands/xcmg.svg',
  'zoomlion': '/brands/zoomlion.svg',
  'bell': '/brands/bell.svg',
  'manitou': '/brands/manitou.svg',
  'wacker neuson': '/brands/wacker-neuson.svg',
}

// Get logo path for a brand
const getBrandLogo = (brandName: string): string | null => {
  const normalized = brandName.toLowerCase().trim()
  return brandLogos[normalized] || null
}

export default function MachineSelector({ onComplete, onCancel }: MachineSelectorProps) {
  const [step, setStep] = useState(1)
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedModel, setSelectedModel] = useState<Model | null>(null)
  const [modelSearch, setModelSearch] = useState('')
  
  // Data from API
  const [brands, setBrands] = useState<Brand[]>([])
  const [types, setTypes] = useState<MachineType[]>([])
  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(false)

  const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

  const headers: Record<string, string> = {}
  if (publishableKey) {
    headers['x-publishable-api-key'] = publishableKey
  }

  // Load brands on mount
  useEffect(() => {
    loadBrands()
  }, [])

  // Load types when brand changes
  useEffect(() => {
    if (selectedBrand) {
      loadTypes(selectedBrand)
    }
  }, [selectedBrand])

  // Load models when type changes
  useEffect(() => {
    if (selectedBrand && selectedType) {
      loadModels(selectedBrand, selectedType)
    }
  }, [selectedBrand, selectedType])

  const loadBrands = async () => {
    setLoading(true)
    try {
      const res = await fetch(backendUrl + '/store/omex-search/machines/brands', { headers })
      const data = await res.json()
      setBrands(data.brands || [])
    } catch (err) {
      console.error('Error loading brands:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadTypes = async (manufacturer: string) => {
    setLoading(true)
    try {
      const res = await fetch(
        backendUrl + '/store/omex-search/machines/types?manufacturer=' + encodeURIComponent(manufacturer),
        { headers }
      )
      const data = await res.json()
      setTypes(data.types || [])
    } catch (err) {
      console.error('Error loading types:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadModels = async (manufacturer: string, type: string) => {
    setLoading(true)
    try {
      const res = await fetch(
        backendUrl + '/store/omex-search/machines/models?manufacturer=' + encodeURIComponent(manufacturer) +
        '&type=' + encodeURIComponent(type),
        { headers }
      )
      const data = await res.json()
      setModels(data.models || [])
    } catch (err) {
      console.error('Error loading models:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredModels = models.filter(m =>
    m.name.toLowerCase().includes(modelSearch.toLowerCase())
  )

  const handleComplete = () => {
    onComplete({
      brand: selectedBrand,
      machineType: selectedType,
      model: selectedModel?.name || '',
      engine: selectedModel?.engine || undefined,
    })
  }

  const handleBrandSelect = (brand: Brand) => {
    setSelectedBrand(brand.name)
    setSelectedType('')
    setSelectedModel(null)
    setModels([])
    setStep(2)
  }

  const handleTypeSelect = (type: MachineType) => {
    setSelectedType(type.name)
    setSelectedModel(null)
    setStep(3)
  }

  const handleModelSelect = (model: Model) => {
    setSelectedModel(model)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map(s => (
          <div
            key={s}
            className={`flex-1 h-1.5 rounded-full transition-colors ${
              s <= step ? 'bg-primary-500' : 'bg-neutral-200'
            }`}
          />
        ))}
      </div>

      {/* Step Indicator */}
      <div className="text-center mb-8">
        <div className="text-sm text-secondary-600 mb-2">
          Krok {step} z 3
        </div>
        <h2 className="text-2xl font-bold text-secondary-800">
          {step === 1 && 'Wybierz producenta'}
          {step === 2 && 'Wybierz typ maszyny'}
          {step === 3 && 'Wybierz model'}
        </h2>
        {selectedBrand && (
          <div className="mt-2 text-sm text-secondary-600">
            {selectedBrand}
            {selectedType && ' → ' + selectedType}
            {selectedModel && ' → ' + selectedModel.name}
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-8 text-secondary-700">
          <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          Ładowanie...
        </div>
      )}

      {/* STEP 1: Brand Selection */}
      {step === 1 && !loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {brands.map(brand => {
            const logoPath = getBrandLogo(brand.name)
            return (
              <button
                key={brand.id}
                onClick={() => handleBrandSelect(brand)}
                className={`p-4 border-2 rounded-2xl text-center transition-all hover:border-primary-500 hover:bg-primary-50 group ${
                  selectedBrand === brand.name 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-neutral-200 bg-white'
                }`}
              >
                {/* Brand Logo */}
                <div className="h-14 flex items-center justify-center mb-2">
                  {logoPath ? (
                    <img
                      src={logoPath}
                      alt={`${brand.name} logo`}
                      className="max-h-12 max-w-[90px] w-auto object-contain opacity-70 group-hover:opacity-100 transition-all"
                      onError={(e) => {
                        // Fallback to text if image fails to load
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        const parent = target.parentElement
                        if (parent) {
                          parent.innerHTML = `<span class="text-lg font-bold text-secondary-800 bg-neutral-100 px-3 py-1 rounded-lg">${brand.code}</span>`
                        }
                      }}
                    />
                  ) : (
                    <span className={`text-lg font-bold px-3 py-1 rounded-lg ${
                      selectedBrand === brand.name
                        ? 'bg-primary-500 text-white'
                        : 'bg-neutral-100 text-secondary-800 group-hover:bg-primary-100'
                    }`}>
                      {brand.code}
                    </span>
                  )}
                </div>
                {/* Brand Name */}
                <div className={`text-sm font-semibold mb-1 ${
                  selectedBrand === brand.name
                    ? 'text-primary-600'
                    : 'text-secondary-800'
                }`}>
                  {brand.name}
                </div>
                <div className="text-xs text-secondary-500">
                  {brand.models} modeli
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* STEP 2: Type Selection */}
      {step === 2 && !loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {types.map(type => (
            <button
              key={type.id}
              onClick={() => handleTypeSelect(type)}
              className={`p-4 border-2 rounded-2xl text-center transition-all hover:border-primary-500 hover:bg-primary-50 ${
                selectedType === type.name 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-neutral-200 bg-white'
              }`}
            >
              <div className={`text-sm font-bold mb-1 px-3 py-1 rounded-lg ${
                selectedType === type.name
                  ? 'bg-primary-500 text-white'
                  : 'bg-neutral-100 text-secondary-700'
              }`}>
                {type.code}
              </div>
              <div className="text-sm font-semibold text-secondary-700 mt-2">
                {type.name}
              </div>
              <div className="text-xs text-secondary-500 mt-1">
                {type.count} modeli
              </div>
            </button>
          ))}
        </div>
      )}

      {/* STEP 3: Model Selection */}
      {step === 3 && !loading && (
        <div>
          {/* Search */}
          <input
            type="text"
            value={modelSearch}
            onChange={(e) => setModelSearch(e.target.value)}
            placeholder="Szukaj modelu..."
            className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl mb-4 focus:border-primary-500 outline-none text-secondary-700"
          />

          {/* Models Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
            {filteredModels.map(model => (
              <button
                key={model.id}
                onClick={() => handleModelSelect(model)}
                className={`p-4 border-2 rounded-xl text-left transition-all hover:border-primary-500 ${
                  selectedModel?.id === model.id 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-neutral-200 bg-white'
                }`}
              >
                <div className="font-bold text-secondary-700 text-lg">
                  {model.name}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {model.weight && (
                    <span className="text-xs bg-neutral-100 text-secondary-700 px-2 py-0.5 rounded">
                      ⚖️ {model.weight}
                    </span>
                  )}
                  {model.years && (
                    <span className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded">
                      📅 {model.years}
                    </span>
                  )}
                </div>
                {model.engine && (
                  <div className="text-xs text-secondary-500 mt-2">
                    ⚙️ {model.engine}
                  </div>
                )}
              </button>
            ))}
          </div>

          {filteredModels.length === 0 && (
            <div className="text-center py-8 text-secondary-500">
              Brak modeli pasujących do wyszukiwania
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => {
            if (step === 1) {
              onCancel()
            } else {
              setStep(step - 1)
              if (step === 2) {
                setSelectedType('')
                setTypes([])
              }
              if (step === 3) {
                setSelectedModel(null)
              }
            }
          }}
          className="px-6 py-3 border-2 border-neutral-300 rounded-xl font-semibold text-secondary-700 hover:bg-neutral-100 transition-colors"
        >
          {step === 1 ? 'Anuluj' : 'Wstecz'}
        </button>

        {selectedModel && (
          <button
            onClick={handleComplete}
            className="px-6 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors"
          >
            Szukaj części dla {selectedModel.name}
          </button>
        )}
      </div>

      {/* Selected Model Details */}
      {selectedModel && (
        <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
          <h3 className="font-bold text-blue-800 mb-2">
            Wybrana maszyna: {selectedBrand} {selectedModel.name}
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm text-blue-700">
            {selectedModel.weight && <div>⚖️ Waga: {selectedModel.weight}</div>}
            {selectedModel.years && <div>📅 Lata: {selectedModel.years}</div>}
            {selectedModel.engine && <div>⚙️ Silnik: {selectedModel.engine}</div>}
            {selectedModel.displacement && <div>🔧 Pojemność: {selectedModel.displacement}</div>}
            {selectedModel.serialRange && <div>🔢 S/N: {selectedModel.serialRange}</div>}
          </div>
        </div>
      )}
    </div>
  )
}
