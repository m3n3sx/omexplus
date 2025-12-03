'use client'

/**
 * MachineSelector Component - 4-step wizard for machine-based search
 * METODA 1: WYSZUKIWANIE PO MASZYNIE (NAJBARDZIEJ ZAAWANSOWANA)
 * Używa custom API endpoints z real-time danymi z bazy
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
  frame?: string
  engine?: string
}

interface BrandOption {
  value: string
  label: string
  count: number
}

interface TypeOption {
  value: string
  label: string
  count: number
}

interface ModelOption {
  value: string
  label: string
  count: number
}

export default function MachineSelector({ onComplete, onCancel }: MachineSelectorProps) {
  const [step, setStep] = useState(1)
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [modelSearch, setModelSearch] = useState('')
  
  // API data
  const [brands, setBrands] = useState<BrandOption[]>([])
  const [types, setTypes] = useState<TypeOption[]>([])
  const [models, setModels] = useState<ModelOption[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

  // Fetch brands on mount
  useEffect(() => {
    fetchBrands()
  }, [])

  // Fetch types when brand selected
  useEffect(() => {
    if (selectedBrand && step === 2) {
      fetchTypes()
    }
  }, [selectedBrand, step])

  // Fetch models when type selected
  useEffect(() => {
    if (selectedBrand && selectedType && step === 3) {
      fetchModels()
    }
  }, [selectedBrand, selectedType, step])

  const fetchBrands = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${backendUrl}/store/omex-search`, {
        headers: publishableKey ? {
          'x-publishable-api-key': publishableKey
        } : {}
      })
      
      if (!response.ok) throw new Error('Failed to fetch brands')
      
      const data = await response.json()
      setBrands(data.brands || [])
    } catch (err) {
      setError('Nie udało się pobrać marek')
      console.error('Error fetching brands:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchTypes = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `${backendUrl}/store/omex-search?brand=${encodeURIComponent(selectedBrand)}`,
        {
          headers: publishableKey ? {
            'x-publishable-api-key': publishableKey
          } : {}
        }
      )
      
      if (!response.ok) throw new Error('Failed to fetch types')
      
      const data = await response.json()
      setTypes(data.types || [])
    } catch (err) {
      setError('Nie udało się pobrać typów maszyn')
      console.error('Error fetching types:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchModels = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `${backendUrl}/store/omex-search?brand=${encodeURIComponent(selectedBrand)}&machineType=${encodeURIComponent(selectedType)}`,
        {
          headers: publishableKey ? {
            'x-publishable-api-key': publishableKey
          } : {}
        }
      )
      
      if (!response.ok) throw new Error('Failed to fetch models')
      
      const data = await response.json()
      setModels(data.models || [])
    } catch (err) {
      setError('Nie udało się pobrać modeli')
      console.error('Error fetching models:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredModels = models.filter(m =>
    m.value.toLowerCase().includes(modelSearch.toLowerCase())
  )

  const handleComplete = () => {
    onComplete({
      brand: selectedBrand,
      machineType: selectedType,
      model: selectedModel,
    })
  }

  const canProceed = () => {
    if (loading) return false
    switch (step) {
      case 1: return selectedBrand !== ''
      case 2: return selectedType !== ''
      case 3: return selectedModel !== ''
      default: return false
    }
  }

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
    }}>
      {/* Progress Bar */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '2rem',
      }}>
        {[1, 2, 3].map(s => (
          <div
            key={s}
            style={{
              flex: 1,
              height: '4px',
              backgroundColor: s <= step ? '#3b82f6' : '#e5e7eb',
              borderRadius: '2px',
              transition: 'background-color 0.3s',
            }}
          />
        ))}
      </div>

      {/* Step Indicator */}
      <div style={{
        textAlign: 'center',
        marginBottom: '2rem',
      }}>
        <div style={{
          fontSize: '0.875rem',
          color: '#6b7280',
          marginBottom: '0.5rem',
        }}>
          Krok {step} z 3
        </div>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
        }}>
          {step === 1 && 'Wybierz markę maszyny'}
          {step === 2 && `Wybierz typ maszyny (${selectedBrand})`}
          {step === 3 && `Wybierz model (${selectedBrand} ${selectedType})`}
        </h2>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          marginBottom: '1rem',
          color: '#991b1b',
          fontSize: '0.875rem',
        }}>
          {error}
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          color: '#6b7280',
        }}>
          <div style={{
            display: 'inline-block',
            width: '40px',
            height: '40px',
            border: '4px solid #e5e7eb',
            borderTopColor: '#3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
          <div style={{ marginTop: '1rem' }}>Ładowanie...</div>
        </div>
      )}

      {/* STEP 1: Brand Selection */}
      {step === 1 && !loading && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '1rem',
        }}>
          {brands.map(brand => (
            <button
              key={brand.value}
              onClick={() => setSelectedBrand(brand.value)}
              style={{
                padding: '1.5rem',
                border: `2px solid ${selectedBrand === brand.value ? '#3b82f6' : '#e5e7eb'}`,
                borderRadius: '12px',
                backgroundColor: selectedBrand === brand.value ? '#eff6ff' : 'white',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s',
              }}
            >
              <div style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                marginBottom: '0.5rem',
              }}>
                {brand.label}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#6b7280',
              }}>
                {brand.count} produktów
              </div>
            </button>
          ))}
        </div>
      )}

      {/* STEP 2: Machine Type */}
      {step === 2 && !loading && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem',
        }}>
          {types.map(type => (
            <button
              key={type.value}
              onClick={() => setSelectedType(type.value)}
              style={{
                padding: '1.5rem',
                border: `2px solid ${selectedType === type.value ? '#3b82f6' : '#e5e7eb'}`,
                borderRadius: '12px',
                backgroundColor: selectedType === type.value ? '#eff6ff' : 'white',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s',
              }}
            >
              <div style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                marginBottom: '0.5rem',
              }}>
                {type.label}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#6b7280',
              }}>
                {type.count} produktów
              </div>
            </button>
          ))}
        </div>
      )}

      {/* STEP 3: Model Selection */}
      {step === 3 && !loading && (
        <div>
          <input
            type="text"
            value={modelSearch}
            onChange={(e) => setModelSearch(e.target.value)}
            placeholder="Szukaj modelu..."
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              marginBottom: '1rem',
              fontSize: '0.875rem',
            }}
          />
          <div style={{
            display: 'grid',
            gap: '0.75rem',
            maxHeight: '400px',
            overflowY: 'auto',
          }}>
            {filteredModels.map(model => (
              <button
                key={model.value}
                onClick={() => setSelectedModel(model.value)}
                style={{
                  padding: '1rem',
                  border: `2px solid ${selectedModel === model.value ? '#3b82f6' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  backgroundColor: selectedModel === model.value ? '#eff6ff' : 'white',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <div>
                    <div style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      marginBottom: '0.25rem',
                    }}>
                      {model.label}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                    }}>
                      {model.count} produktów
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginTop: '2rem',
        justifyContent: 'space-between',
      }}>
        <button
          onClick={() => {
            if (step === 1) {
              onCancel()
            } else {
              setStep(step - 1)
            }
          }}
          style={{
            padding: '0.75rem 1.5rem',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            backgroundColor: 'white',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '600',
          }}
        >
          {step === 1 ? 'Anuluj' : 'Wstecz'}
        </button>

        <button
          onClick={() => {
            if (step === 3) {
              handleComplete()
            } else {
              setStep(step + 1)
            }
          }}
          disabled={!canProceed()}
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: canProceed() ? '#3b82f6' : '#e5e7eb',
            color: canProceed() ? 'white' : '#9ca3af',
            cursor: canProceed() ? 'pointer' : 'not-allowed',
            fontSize: '0.875rem',
            fontWeight: '600',
          }}
        >
          {step === 3 ? 'Szukaj części' : 'Dalej'}
        </button>
      </div>

      {/* CSS for loading spinner */}
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
