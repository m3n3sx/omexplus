'use client'

import { useState, useEffect } from 'react'

// Typy wariantów dla części do maszyn
export interface ProductOption {
  id: string
  title: string // np. "Rozmiar", "Materiał", "Typ"
  values: OptionValue[]
}

export interface OptionValue {
  id: string
  value: string // np. "50mm", "Stal", "Oryginał"
}

export interface ProductVariant {
  id: string
  title: string
  sku?: string
  inventory_quantity?: number
  prices?: Array<{
    amount: number
    currency_code: string
  }>
  options?: Array<{
    value: string
    option_id: string
  }>
}

interface VariantSelectorProps {
  options: ProductOption[]
  variants: ProductVariant[]
  selectedVariant: ProductVariant | null
  onVariantChange: (variant: ProductVariant | null) => void
  className?: string
}

export function VariantSelector({
  options,
  variants,
  selectedVariant,
  onVariantChange,
  className = ''
}: VariantSelectorProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})

  // Inicjalizuj wybrane opcje na podstawie wybranego wariantu
  useEffect(() => {
    if (selectedVariant?.options) {
      const optionsMap: Record<string, string> = {}
      selectedVariant.options.forEach(opt => {
        optionsMap[opt.option_id] = opt.value
      })
      setSelectedOptions(optionsMap)
    }
  }, [selectedVariant])

  // Znajdź wariant pasujący do wybranych opcji
  const findMatchingVariant = (newOptions: Record<string, string>) => {
    return variants.find(variant => {
      if (!variant.options) return false
      return variant.options.every(opt => 
        newOptions[opt.option_id] === opt.value
      )
    })
  }

  // Sprawdź czy dana wartość opcji jest dostępna (ma wariant w magazynie)
  const isOptionValueAvailable = (optionId: string, value: string) => {
    const testOptions = { ...selectedOptions, [optionId]: value }
    const matchingVariant = findMatchingVariant(testOptions)
    return matchingVariant && (matchingVariant.inventory_quantity ?? 0) > 0
  }

  // Sprawdź czy dana wartość opcji ma jakikolwiek wariant (nawet niedostępny)
  const hasVariantForOption = (optionId: string, value: string) => {
    return variants.some(variant => 
      variant.options?.some(opt => opt.option_id === optionId && opt.value === value)
    )
  }

  const handleOptionChange = (optionId: string, value: string) => {
    const newOptions = { ...selectedOptions, [optionId]: value }
    setSelectedOptions(newOptions)
    
    const matchingVariant = findMatchingVariant(newOptions)
    onVariantChange(matchingVariant || null)
  }

  if (!options || options.length === 0) {
    return null
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {options.map((option) => (
        <div key={option.id} className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            {option.title}
            {selectedOptions[option.id] && (
              <span className="ml-2 font-normal text-gray-500">
                — {selectedOptions[option.id]}
              </span>
            )}
          </label>
          
          <div className="flex flex-wrap gap-2">
            {option.values.map((optionValue) => {
              const isSelected = selectedOptions[option.id] === optionValue.value
              const isAvailable = isOptionValueAvailable(option.id, optionValue.value)
              const hasVariant = hasVariantForOption(option.id, optionValue.value)
              
              return (
                <button
                  key={optionValue.id}
                  type="button"
                  onClick={() => handleOptionChange(option.id, optionValue.value)}
                  disabled={!hasVariant}
                  className={`
                    px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-200
                    ${isSelected
                      ? 'border-primary-500 bg-primary-50 text-primary-700 ring-2 ring-primary-200'
                      : isAvailable
                        ? 'border-gray-200 bg-white text-gray-700 hover:border-primary-300 hover:bg-gray-50'
                        : hasVariant
                          ? 'border-gray-200 bg-gray-50 text-gray-400 line-through cursor-pointer'
                          : 'border-gray-100 bg-gray-100 text-gray-300 cursor-not-allowed'
                    }
                  `}
                >
                  {optionValue.value}
                  {!isAvailable && hasVariant && (
                    <span className="ml-1 text-xs">(brak)</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      ))}
      
      {/* Informacja o wybranym wariancie */}
      {selectedVariant && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">SKU:</span>
            <span className="font-mono font-semibold text-gray-900">
              {selectedVariant.sku || 'N/A'}
            </span>
          </div>
          {selectedVariant.inventory_quantity !== undefined && (
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-gray-600">Dostępność:</span>
              <span className={`font-semibold ${
                selectedVariant.inventory_quantity > 10 
                  ? 'text-green-600' 
                  : selectedVariant.inventory_quantity > 0 
                    ? 'text-orange-600' 
                    : 'text-red-600'
              }`}>
                {selectedVariant.inventory_quantity > 10 
                  ? '✓ W magazynie' 
                  : selectedVariant.inventory_quantity > 0 
                    ? `⚡ Ostatnie ${selectedVariant.inventory_quantity} szt.` 
                    : '✕ Brak w magazynie'}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Komponent dla prostego wyboru wariantu (dropdown)
export function VariantDropdown({
  variants,
  selectedVariant,
  onVariantChange,
  className = ''
}: Omit<VariantSelectorProps, 'options'>) {
  if (!variants || variants.length <= 1) {
    return null
  }

  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Wybierz wariant
      </label>
      <select
        value={selectedVariant?.id || ''}
        onChange={(e) => {
          const variant = variants.find(v => v.id === e.target.value)
          onVariantChange(variant || null)
        }}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      >
        {variants.map((variant) => {
          const price = variant.prices?.[0]
          const priceStr = price ? ` - ${(price.amount / 100).toFixed(2)} PLN` : ''
          const stockStr = variant.inventory_quantity === 0 ? ' (brak)' : ''
          
          return (
            <option key={variant.id} value={variant.id}>
              {variant.title}{priceStr}{stockStr}
            </option>
          )
        })}
      </select>
    </div>
  )
}
