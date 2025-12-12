'use client'

import { useState } from 'react'
import { MachineTypeSelector } from '@/components/search/MachineTypeSelector'
import { ManufacturerSelector } from '@/components/search/ManufacturerSelector'
import { ModelSelector } from '@/components/search/ModelSelector'

export default function TestSearchPage() {
  const [step, setStep] = useState(1)
  const [selectedMachineType, setSelectedMachineType] = useState<string | null>(null)
  const [selectedManufacturer, setSelectedManufacturer] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8">
            🧪 Search API Test
          </h1>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    s === step
                      ? 'bg-primary-600 text-white'
                      : s < step
                      ? 'bg-success text-white'
                      : 'bg-neutral-300 text-neutral-600'
                  }`}
                >
                  {s < step ? '✓' : s}
                </div>
              ))}
            </div>
            <div className="text-center mt-4 text-sm text-neutral-600">
              Step {step} of 3
            </div>
          </div>

          {/* Selection Summary */}
          {(selectedMachineType || selectedManufacturer || selectedModel) && (
            <div className="mb-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
              <div className="text-sm font-semibold text-primary-900 mb-2">
                Your Selection:
              </div>
              <div className="space-y-1 text-sm text-primary-800">
                {selectedMachineType && <div>✓ Machine Type: {selectedMachineType}</div>}
                {selectedManufacturer && <div>✓ Manufacturer: {selectedManufacturer}</div>}
                {selectedModel && <div>✓ Model: {selectedModel}</div>}
              </div>
            </div>
          )}

          {/* Step 1: Machine Type */}
          {step === 1 && (
            <MachineTypeSelector
              preSelected={selectedMachineType}
              onSelect={(id) => {
                setSelectedMachineType(id)
                setStep(2)
              }}
            />
          )}

          {/* Step 2: Manufacturer */}
          {step === 2 && selectedMachineType && (
            <>
              <button
                onClick={() => setStep(1)}
                className="mb-4 text-primary-600 hover:text-primary-700 font-medium"
              >
                ← Back to Machine Type
              </button>
              <ManufacturerSelector
                machineTypeId={selectedMachineType}
                preSelected={selectedManufacturer}
                onSelect={(id) => {
                  setSelectedManufacturer(id)
                  setStep(3)
                }}
              />
            </>
          )}

          {/* Step 3: Model */}
          {step === 3 && selectedManufacturer && (
            <>
              <button
                onClick={() => setStep(2)}
                className="mb-4 text-primary-600 hover:text-primary-700 font-medium"
              >
                ← Back to Manufacturer
              </button>
              <ModelSelector
                manufacturerId={selectedManufacturer}
                preSelected={selectedModel}
                onSelect={(id) => {
                  setSelectedModel(id)
                  alert(`Selected Model: ${id}\n\nSearch API is working! ✅`)
                }}
              />
            </>
          )}

          {/* Debug Info */}
          <div className="mt-8 p-4 bg-neutral-100 rounded-lg">
            <div className="text-xs font-mono text-neutral-700">
              <div className="font-bold mb-2">Debug Info:</div>
              <div>Backend URL: {process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:9000'}</div>
              <div>API Key: {process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ? '✓ Set' : '✗ Missing'}</div>
              <div>Current Step: {step}</div>
              <div>Machine Type: {selectedMachineType || 'Not selected'}</div>
              <div>Manufacturer: {selectedManufacturer || 'Not selected'}</div>
              <div>Model: {selectedModel || 'Not selected'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
