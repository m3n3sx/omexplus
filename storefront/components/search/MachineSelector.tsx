'use client'

/**
 * MachineSelector Component - Progressive search with results after each step
 * METODA 1: WYSZUKIWANIE PO MASZYNIE (NAJBARDZIEJ ZAAWANSOWANA)
 */

import { useState, useEffect } from 'react'
import { useSearch } from '@/hooks/useSearch'

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

const MACHINE_BRANDS = [
  { id: 'cat', name: 'CAT (Caterpillar)', code: 'CAT', models: 150 },
  { id: 'komatsu', name: 'Komatsu', code: 'KOM', models: 120 },
  { id: 'hitachi', name: 'Hitachi', code: 'HIT', models: 100 },
  { id: 'volvo', name: 'Volvo', code: 'VOL', models: 90 },
  { id: 'jcb', name: 'JCB', code: 'JCB', models: 80 },
  { id: 'kobelco', name: 'Kobelco', code: 'KOB', models: 70 },
  { id: 'hyundai', name: 'Hyundai', code: 'HYU', models: 60 },
  { id: 'bobcat', name: 'Bobcat', code: 'BOB', models: 50 },
  { id: 'doosan', name: 'Doosan', code: 'DOO', models: 55 },
  { id: 'case', name: 'Case', code: 'CAS', models: 45 },
]

const MACHINE_TYPES = [
  { id: 'Koparka', name: 'Koparka', code: 'EXC' },
  { id: 'Ładowarka', name: 'Ładowarka', code: 'LDR' },
  { id: 'Koparka-ładowarka', name: 'Koparka-ładowarka', code: 'BHL' },
  { id: 'Spychacz', name: 'Spychacz', code: 'DOZ' },
  { id: 'Ładowarka teleskopowa', name: 'Ładowarka teleskopowa', code: 'TEL' },
  { id: 'Walcarka', name: 'Walcarka', code: 'CMP' },
  { id: 'Mini koparka', name: 'Mini koparka', code: 'MIN' },
  { id: 'Koparka kołowa', name: 'Koparka kołowa', code: 'WHL' },
]

// Mock data - w produkcji z API
const MODELS_BY_BRAND: Record<string, any[]> = {
  cat: [
    { id: '320', name: '320', size: '20T', years: '2005-2024', sn: 'ABC-XYZ' },
    { id: '330', name: '330', size: '30T', years: '2008-2024', sn: 'DEF-UVW' },
    { id: '340', name: '340', size: '40T', years: '2010-2024', sn: 'GHI-RST' },
  ],
  komatsu: [
    { id: 'pc200', name: 'PC200', size: '20T', years: '2005-2024', sn: 'K200-K299' },
    { id: 'pc220', name: 'PC220', size: '22T', years: '2008-2024', sn: 'K220-K299' },
  ],
}

const SERIES_OPTIONS = [
  { id: 'small', name: 'Small frame (301, 305, 308)' },
  { id: 'standard', name: 'Standard (320, 325, 330)' },
  { id: 'large', name: 'Large frame (390, 395)' },
  { id: 'f-series', name: 'F-Series (Generacja F)' },
  { id: 'g-series', name: 'G-Series (Generacja G)' },
]

const ENGINE_OPTIONS = [
  { id: 'perkins', name: 'Perkins' },
  { id: 'caterpillar', name: 'Caterpillar' },
  { id: 'yanmar', name: 'Yanmar' },
  { id: 'mitsubishi', name: 'Mitsubishi' },
  { id: 'custom', name: 'Inny / Custom' },
]

export default function MachineSelector({ onComplete, onCancel }: MachineSelectorProps) {
  const [step, setStep] = useState(1)
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [selectedSeries, setSelectedSeries] = useState('')
  const [selectedEngine, setSelectedEngine] = useState('')
  const [modelSearch, setModelSearch] = useState('')
  
  const { search, results, loading } = useSearch()
  const [showResults, setShowResults] = useState(false)

  // Search after each selection
  useEffect(() => {
    if (selectedBrand && selectedType) {
      performSearch()
    }
  }, [selectedBrand, selectedType, selectedModel, selectedSeries, selectedEngine])

  const performSearch = async () => {
    if (!selectedBrand || !selectedType) return

    try {
      await search({
        method: 'machine',
        params: {
          brand: selectedBrand,
          machineType: selectedType,
          model: selectedModel || '',
          series: selectedSeries || undefined,
          engine: selectedEngine || undefined,
        }
      })
      setShowResults(true)
    } catch (error) {
      console.error('Search error:', error)
    }
  }

  const filteredModels = selectedBrand && MODELS_BY_BRAND[selectedBrand]
    ? MODELS_BY_BRAND[selectedBrand].filter(m =>
        m.name.toLowerCase().includes(modelSearch.toLowerCase())
      )
    : []

  const handleComplete = () => {
    onComplete({
      brand: selectedBrand,
      machineType: selectedType,
      model: selectedModel,
      series: selectedSeries || undefined,
      engine: selectedEngine || undefined,
    })
  }

  const canProceed = () => {
    switch (step) {
      case 1: return selectedBrand !== ''
      case 2: return selectedType !== ''
      case 3: return selectedModel !== ''
      case 4: return true // Series optional
      case 5: return true // Engine optional
      default: return false
    }
  }

  const handleSelection = (stepNum: number, value: string) => {
    switch (stepNum) {
      case 1:
        setSelectedBrand(value)
        setStep(2)
        // Trigger search immediately after brand selection
        setTimeout(() => performSearch(), 100)
        break
      case 2:
        setSelectedType(value)
        // Auto-search after type selection
        setTimeout(() => performSearch(), 100)
        break
      case 3:
        setSelectedModel(value)
        // Auto-search after model selection
        setTimeout(() => performSearch(), 100)
        break
      case 4:
        setSelectedSeries(value)
        // Auto-search after series selection
        setTimeout(() => performSearch(), 100)
        break
      case 5:
        setSelectedEngine(value)
        // Auto-search after engine selection
        setTimeout(() => performSearch(), 100)
        break
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
        {[1, 2, 3, 4, 5].map(s => (
          <div
            key={s}
            style={{
              flex: 1,
              height: '6px',
              backgroundColor: s <= step ? '#EBAE34' : '#FBF9F6',
              borderRadius: '3px',
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
          Krok {step} z 5
        </div>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#424242',
        }}>
          {step === 1 && 'Wybierz markę maszyny'}
          {step === 2 && 'Wybierz typ maszyny'}
          {step === 3 && 'Wybierz model'}
          {step === 4 && 'Wybierz serię (opcjonalnie)'}
          {step === 5 && 'Wybierz silnik (opcjonalnie)'}
        </h2>
      </div>

      {/* STEP 1: Brand Selection */}
      {step === 1 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {MACHINE_BRANDS.map(brand => (
              <button
                key={brand.id}
                onClick={() => handleSelection(1, brand.code)}
                style={{
                  padding: '1.5rem',
                  border: `2px solid ${selectedBrand === brand.code ? '#EBAE34' : '#e5e7eb'}`,
                  borderRadius: '16px',
                  backgroundColor: selectedBrand === brand.code ? '#FBF9F6' : 'white',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ 
                  fontSize: '1.25rem', 
                  marginBottom: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: selectedBrand === brand.code ? '#EBAE34' : '#FBF9F6',
                  color: selectedBrand === brand.code ? 'white' : '#424242',
                  borderRadius: '8px',
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                }}>
                  {brand.code}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  marginBottom: '0.25rem',
                  color: '#424242',
                }}>
                  {brand.name}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                }}>
                  {brand.models} modeli
                </div>
              </button>
            ))}
          </div>

          {/* Show results after brand selection */}
          {showResults && selectedBrand && (
            <div style={{
              marginTop: '2rem',
              padding: '1.5rem',
              backgroundColor: '#E8F4FE',
              borderRadius: '16px',
              border: '2px solid #1675F2',
            }}>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#0554F2',
              }}>
                Znalezione części dla {selectedBrand}
              </h3>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                  Wyszukiwanie...
                </div>
              ) : results.length > 0 ? (
                <div style={{
                  display: 'grid',
                  gap: '0.75rem',
                  maxHeight: '300px',
                  overflowY: 'auto',
                }}>
                  {results.slice(0, 5).map((product: any) => (
                    <div
                      key={product.id}
                      style={{
                        padding: '0.75rem',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        fontSize: '0.875rem',
                        border: '1px solid #D4EBFC',
                      }}
                    >
                      {product.title}
                    </div>
                  ))}
                  {results.length > 5 && (
                    <div style={{
                      padding: '0.75rem',
                      textAlign: 'center',
                      color: '#1675F2',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                    }}>
                      + {results.length - 5} więcej produktów
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                  Brak wyników
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* STEP 2: Machine Type */}
      {step === 2 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-8">
            {MACHINE_TYPES.map(type => (
              <button
                key={type.id}
                onClick={() => handleSelection(2, type.name)}
                style={{
                  padding: '1.5rem',
                  border: `2px solid ${selectedType === type.name ? '#EBAE34' : '#e5e7eb'}`,
                  borderRadius: '16px',
                  backgroundColor: selectedType === type.name ? '#FBF9F6' : 'white',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ 
                  fontSize: '1rem', 
                  marginBottom: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: selectedType === type.name ? '#EBAE34' : '#FBF9F6',
                  color: selectedType === type.name ? 'white' : '#424242',
                  borderRadius: '8px',
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                }}>
                  {type.code}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#424242',
                }}>
                  {type.name}
                </div>
              </button>
            ))}
          </div>

          {/* Show results after type selection */}
          {showResults && selectedType && (
            <div style={{
              marginTop: '2rem',
              padding: '1.5rem',
              backgroundColor: '#E8F4FE',
              borderRadius: '16px',
              border: '2px solid #1675F2',
            }}>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#0554F2',
              }}>
                Znalezione części dla {selectedBrand} {selectedType}
              </h3>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                  Wyszukiwanie...
                </div>
              ) : results.length > 0 ? (
                <div style={{
                  display: 'grid',
                  gap: '0.75rem',
                  maxHeight: '300px',
                  overflowY: 'auto',
                }}>
                  {results.slice(0, 5).map((product: any) => (
                    <div
                      key={product.id}
                      style={{
                        padding: '0.75rem',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                      }}
                    >
                      {product.title}
                    </div>
                  ))}
                  {results.length > 5 && (
                    <div style={{
                      padding: '0.75rem',
                      textAlign: 'center',
                      color: '#1675F2',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                    }}>
                      + {results.length - 5} więcej produktów
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                  Brak wyników
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* STEP 3: Model Selection */}
      {step === 3 && (
        <>
          <div>
            <input
              type="text"
              value={modelSearch}
              onChange={(e) => setModelSearch(e.target.value)}
              placeholder="Wpisz model (np. PC200, 320, ZX210)..."
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                marginBottom: '1rem',
                fontSize: '0.875rem',
              }}
            />
            
            {/* Common models as buttons */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              marginBottom: '1rem',
            }}>
              {['PC200', '320', '330', 'ZX210', 'EC210'].map(model => (
                <button
                  key={model}
                  onClick={() => handleSelection(3, model)}
                  style={{
                    padding: '0.5rem 1rem',
                    border: `2px solid ${selectedModel === model ? '#3b82f6' : '#e5e7eb'}`,
                    borderRadius: '6px',
                    backgroundColor: selectedModel === model ? '#eff6ff' : 'white',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                  }}
                >
                  {model}
                </button>
              ))}
            </div>
          </div>

          {/* Show results after model selection */}
          {showResults && selectedModel && (
            <div style={{
              marginTop: '2rem',
              padding: '1.5rem',
              backgroundColor: '#E8F4FE',
              borderRadius: '16px',
              border: '2px solid #1675F2',
            }}>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#0554F2',
              }}>
                Znalezione części dla {selectedBrand} {selectedType} {selectedModel}
              </h3>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                  Wyszukiwanie...
                </div>
              ) : results.length > 0 ? (
                <div style={{
                  display: 'grid',
                  gap: '0.75rem',
                  maxHeight: '300px',
                  overflowY: 'auto',
                }}>
                  {results.slice(0, 8).map((product: any) => (
                    <div
                      key={product.id}
                      style={{
                        padding: '0.75rem',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        fontSize: '0.875rem',
                        border: '1px solid #D4EBFC',
                      }}
                    >
                      {product.title}
                    </div>
                  ))}
                  {results.length > 8 && (
                    <div style={{
                      padding: '0.75rem',
                      textAlign: 'center',
                      color: '#1675F2',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                    }}>
                      + {results.length - 8} więcej produktów
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                  Brak wyników dla tego modelu
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* STEP 4: Series Selection (Optional) */}
      {step === 4 && (
        <>
          <div className="grid grid-cols-1 gap-3">
            {SERIES_OPTIONS.map(series => (
              <button
                key={series.id}
                onClick={() => setSelectedSeries(series.id)}
                style={{
                  padding: '1rem',
                  border: `2px solid ${selectedSeries === series.id ? '#EBAE34' : '#e5e7eb'}`,
                  borderRadius: '12px',
                  backgroundColor: selectedSeries === series.id ? '#FBF9F6' : 'white',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                  color: '#424242',
                }}
              >
                {series.name}
              </button>
            ))}
          </div>

          {/* Show results after series selection */}
          {showResults && selectedSeries && (
            <div style={{
              marginTop: '2rem',
              padding: '1.5rem',
              backgroundColor: '#E8F4FE',
              borderRadius: '16px',
              border: '2px solid #1675F2',
            }}>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#0554F2',
              }}>
                Znalezione części dla {selectedBrand} {selectedType} {selectedModel} (Seria: {selectedSeries})
              </h3>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                  Wyszukiwanie...
                </div>
              ) : results.length > 0 ? (
                <div style={{
                  display: 'grid',
                  gap: '0.75rem',
                  maxHeight: '300px',
                  overflowY: 'auto',
                }}>
                  {results.slice(0, 8).map((product: any) => (
                    <div
                      key={product.id}
                      style={{
                        padding: '0.75rem',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        fontSize: '0.875rem',
                        border: '1px solid #D4EBFC',
                      }}
                    >
                      {product.title}
                    </div>
                  ))}
                  {results.length > 8 && (
                    <div style={{
                      padding: '0.75rem',
                      textAlign: 'center',
                      color: '#1675F2',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                    }}>
                      + {results.length - 8} więcej produktów
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                  Brak wyników
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* STEP 5: Engine Selection (Optional) */}
      {step === 5 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {ENGINE_OPTIONS.map(engine => (
              <button
                key={engine.id}
                onClick={() => setSelectedEngine(engine.id)}
                style={{
                  padding: '1.5rem',
                  border: `2px solid ${selectedEngine === engine.id ? '#EBAE34' : '#e5e7eb'}`,
                  borderRadius: '12px',
                  backgroundColor: selectedEngine === engine.id ? '#FBF9F6' : 'white',
                  cursor: 'pointer',
                  textAlign: 'center',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                  color: '#424242',
                }}
              >
                {engine.name}
              </button>
            ))}
          </div>

          {/* Show results after engine selection */}
          {showResults && selectedEngine && (
            <div style={{
              marginTop: '2rem',
              padding: '1.5rem',
              backgroundColor: '#E8F4FE',
              borderRadius: '16px',
              border: '2px solid #1675F2',
            }}>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#0554F2',
              }}>
                Znalezione części dla {selectedBrand} {selectedType} {selectedModel} (Silnik: {selectedEngine})
              </h3>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                  Wyszukiwanie...
                </div>
              ) : results.length > 0 ? (
                <div style={{
                  display: 'grid',
                  gap: '0.75rem',
                  maxHeight: '300px',
                  overflowY: 'auto',
                }}>
                  {results.slice(0, 10).map((product: any) => (
                    <div
                      key={product.id}
                      style={{
                        padding: '0.75rem',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        fontSize: '0.875rem',
                        border: '1px solid #D4EBFC',
                      }}
                    >
                      {product.title}
                    </div>
                  ))}
                  {results.length > 10 && (
                    <div style={{
                      padding: '0.75rem',
                      textAlign: 'center',
                      color: '#1675F2',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                    }}>
                      + {results.length - 10} więcej produktów
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                  Brak wyników
                </div>
              )}
            </div>
          )}
        </>
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
              setShowResults(false)
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

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {/* Show "View All Results" button if we have results */}
          {showResults && results.length > 0 && step >= 2 && (
            <button
              onClick={handleComplete}
              style={{
                padding: '0.75rem 1.5rem',
                border: '2px solid #EBAE34',
                borderRadius: '12px',
                backgroundColor: 'white',
                color: '#EBAE34',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600',
              }}
            >
              Zobacz wszystkie ({results.length})
            </button>
          )}

          {/* Continue to next step */}
          {step < 5 && (
            <button
              onClick={() => {
                setStep(step + 1)
                setShowResults(false)
              }}
              disabled={!canProceed()}
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '12px',
                backgroundColor: canProceed() ? '#EBAE34' : '#FBF9F6',
                color: canProceed() ? 'white' : '#9ca3af',
                cursor: canProceed() ? 'pointer' : 'not-allowed',
                fontSize: '0.875rem',
                fontWeight: '600',

              }}
            >
              Zawęź wyniki
            </button>
          )}

          {step === 5 && (
            <button
              onClick={handleComplete}
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '12px',
                backgroundColor: '#EBAE34',
                color: 'white',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600',

              }}
            >
              Szukaj części
            </button>
          )}
        </div>
      </div>

      {/* Skip Button for Optional Steps */}
      {(step === 4 || step === 5) && (
        <div style={{
          textAlign: 'center',
          marginTop: '1rem',
        }}>
          <button
            onClick={() => {
              if (step === 4) {
                setSelectedSeries('')
                setStep(5)
              } else {
                setSelectedEngine('')
                handleComplete()
              }
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#6b7280',
              cursor: 'pointer',
              fontSize: '0.875rem',
              textDecoration: 'underline',
            }}
          >
            Pomiń ten krok
          </button>
        </div>
      )}
    </div>
  )
}
