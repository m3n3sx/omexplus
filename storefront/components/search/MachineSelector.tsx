'use client'

/**
 * MachineSelector Component - 5-step wizard for machine-based search
 * METODA 1: WYSZUKIWANIE PO MASZYNIE (NAJBARDZIEJ ZAAWANSOWANA)
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
  { id: 'excavator', name: 'Koparka', code: 'EXC' },
  { id: 'loader', name: 'Ładowarka', code: 'LDR' },
  { id: 'backhoe', name: 'Koparka-ładowarka', code: 'BHL' },
  { id: 'dozer', name: 'Spychacz', code: 'DOZ' },
  { id: 'telehandler', name: 'Ładowarka teleskopowa', code: 'TEL' },
  { id: 'compactor', name: 'Walcarka', code: 'CMP' },
  { id: 'mini-excavator', name: 'Mini koparka', code: 'MIN' },
  { id: 'wheel-excavator', name: 'Koparka kołowa', code: 'WHL' },
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
          Krok {step} z 5
        </div>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
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
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '1rem',
        }}>
          {MACHINE_BRANDS.map(brand => (
            <button
              key={brand.id}
              onClick={() => setSelectedBrand(brand.id)}
              style={{
                padding: '1.5rem',
                border: `2px solid ${selectedBrand === brand.id ? '#3b82f6' : '#e5e7eb'}`,
                borderRadius: '12px',
                backgroundColor: selectedBrand === brand.id ? '#eff6ff' : 'white',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ 
                fontSize: '1.25rem', 
                marginBottom: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: selectedBrand === brand.id ? '#3b82f6' : '#f3f4f6',
                color: selectedBrand === brand.id ? 'white' : '#6b7280',
                borderRadius: '6px',
                fontFamily: 'monospace',
                fontWeight: 'bold',
              }}>
                {brand.code}
              </div>
              <div style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                marginBottom: '0.25rem',
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
      )}

      {/* STEP 2: Machine Type */}
      {step === 2 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem',
        }}>
          {MACHINE_TYPES.map(type => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              style={{
                padding: '1.5rem',
                border: `2px solid ${selectedType === type.id ? '#3b82f6' : '#e5e7eb'}`,
                borderRadius: '12px',
                backgroundColor: selectedType === type.id ? '#eff6ff' : 'white',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ 
                fontSize: '1rem', 
                marginBottom: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: selectedType === type.id ? '#3b82f6' : '#f3f4f6',
                color: selectedType === type.id ? 'white' : '#6b7280',
                borderRadius: '6px',
                fontFamily: 'monospace',
                fontWeight: 'bold',
              }}>
                {type.code}
              </div>
              <div style={{
                fontSize: '0.875rem',
                fontWeight: '600',
              }}>
                {type.name}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* STEP 3: Model Selection */}
      {step === 3 && (
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
                key={model.id}
                onClick={() => setSelectedModel(model.id)}
                style={{
                  padding: '1rem',
                  border: `2px solid ${selectedModel === model.id ? '#3b82f6' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  backgroundColor: selectedModel === model.id ? '#eff6ff' : 'white',
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
                      {model.name}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                    }}>
                      {model.size} • {model.years} • SN: {model.sn}
                    </div>
                  </div>
                  <div style={{
                    padding: '0.25rem 0.5rem',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    color: '#6b7280',
                  }}>
                    {model.size}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 4: Series Selection (Optional) */}
      {step === 4 && (
        <div style={{
          display: 'grid',
          gap: '0.75rem',
        }}>
          {SERIES_OPTIONS.map(series => (
            <button
              key={series.id}
              onClick={() => setSelectedSeries(series.id)}
              style={{
                padding: '1rem',
                border: `2px solid ${selectedSeries === series.id ? '#3b82f6' : '#e5e7eb'}`,
                borderRadius: '8px',
                backgroundColor: selectedSeries === series.id ? '#eff6ff' : 'white',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'all 0.2s',
              }}
            >
              {series.name}
            </button>
          ))}
        </div>
      )}

      {/* STEP 5: Engine Selection (Optional) */}
      {step === 5 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '1rem',
        }}>
          {ENGINE_OPTIONS.map(engine => (
            <button
              key={engine.id}
              onClick={() => setSelectedEngine(engine.id)}
              style={{
                padding: '1.5rem',
                border: `2px solid ${selectedEngine === engine.id ? '#3b82f6' : '#e5e7eb'}`,
                borderRadius: '8px',
                backgroundColor: selectedEngine === engine.id ? '#eff6ff' : 'white',
                cursor: 'pointer',
                textAlign: 'center',
                fontSize: '0.875rem',
                fontWeight: '600',
                transition: 'all 0.2s',
              }}
            >
              {engine.name}
            </button>
          ))}
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
            if (step === 5) {
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
          {step === 5 ? 'Szukaj części' : 'Dalej'}
        </button>
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
