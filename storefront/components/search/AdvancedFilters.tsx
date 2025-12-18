'use client'

/**
 * AdvancedFilters Component - Multi-criteria filtering
 * Full implementation with all filter options from specification
 */

import { useState, useEffect } from 'react'
import { FilterSearchParams } from '@/hooks/useSearch'

interface AdvancedFiltersProps {
  onFilterChange: (filters: FilterSearchParams) => void
  categories?: any[]
  onApply?: () => void
}

interface FilterOptions {
  machineBrands: string[]
  availability: Array<{ value: string; label: string }>
  partTypes: Array<{ value: string; label: string }>
  manufacturers: string[]
  sortBy: Array<{ value: string; label: string }>
}

export default function AdvancedFilters({ onFilterChange, categories = [], onApply }: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<FilterSearchParams>({
    categoryIds: [],
    includeSubcategories: true,
    machineBrands: [],
    availability: [],
    minPrice: undefined,
    maxPrice: undefined,
    currency: 'PLN',
    partTypes: [],
    manufacturers: [],
    minRating: undefined,
    minReviews: undefined,
    sortBy: 'best-selling',
  })

  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    categories: true,
    machineBrands: true,
    availability: true,
    price: true,
    partTypes: true,
    manufacturers: false,
    quality: false,
    rating: false,
    sort: true,
  })

  // Fetch filter options
  useEffect(() => {
    fetch('/api/search/filters')
      .then(res => res.json())
      .then(data => {
        setFilterOptions({
          machineBrands: data.machineBrands?.options || [],
          availability: data.availability?.options || [],
          partTypes: data.partTypes?.options || [],
          manufacturers: data.manufacturers?.options || [],
          sortBy: data.sortBy?.options || [],
        })
      })
      .catch(err => console.error('Failed to fetch filter options:', err))
  }, [])

  const updateFilter = (key: keyof FilterSearchParams, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const toggleArrayValue = (key: keyof FilterSearchParams, value: string) => {
    const currentArray = (filters[key] as string[]) || []
    const newArray = currentArray.includes(value)
      ? currentArray.filter(v => v !== value)
      : [...currentArray, value]
    updateFilter(key, newArray)
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const clearAllFilters = () => {
    const clearedFilters: FilterSearchParams = {
      categoryIds: [],
      includeSubcategories: true,
      machineBrands: [],
      availability: [],
      minPrice: undefined,
      maxPrice: undefined,
      currency: 'PLN',
      partTypes: [],
      manufacturers: [],
      minRating: undefined,
      minReviews: undefined,
      sortBy: 'best-selling',
    }
    setFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.categoryIds && filters.categoryIds.length > 0) count += filters.categoryIds.length
    if (filters.machineBrands && filters.machineBrands.length > 0) count += filters.machineBrands.length
    if (filters.availability && filters.availability.length > 0) count += filters.availability.length
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) count++
    if (filters.partTypes && filters.partTypes.length > 0) count += filters.partTypes.length
    if (filters.manufacturers && filters.manufacturers.length > 0) count += filters.manufacturers.length
    if (filters.minRating !== undefined) count++
    if (filters.minReviews !== undefined) count++
    return count
  }

  const FilterSection = ({ title, section, children }: { title: string; section: string; children: React.ReactNode }) => (
    <div className="border-b-2 border-neutral-200 pb-4 mb-4">
      <button
        onClick={() => toggleSection(section)}
        className="w-full flex justify-between items-center py-3 border-none bg-transparent cursor-pointer text-base font-semibold text-secondary-700"
      >
        <span>{title}</span>
        <span className="text-xl text-primary-500">
          {expandedSections[section] ? '−' : '+'}
        </span>
      </button>
      {expandedSections[section] && (
        <div className="pt-3">
          {children}
        </div>
      )}
    </div>
  )

  return (
    <div className="w-full max-w-xs bg-white rounded-2xl p-6 border-2 border-neutral-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-secondary-700">
          Filtry
        </h2>
        {getActiveFiltersCount() > 0 && (
          <button
            onClick={clearAllFilters}
            className="px-3 py-1 border-none rounded-lg bg-red-500 text-white cursor-pointer text-xs font-semibold hover:bg-red-600 transition-colors"
          >
            Wyczyść ({getActiveFiltersCount()})
          </button>
        )}
      </div>

      {/* Categories */}
      <FilterSection title="Kategorie" section="categories">
        <div className="mb-3">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-secondary-700">
            <input
              type="checkbox"
              checked={filters.includeSubcategories}
              onChange={(e) => updateFilter('includeSubcategories', e.target.checked)}
              className="w-4 h-4 accent-primary-500"
            />
            Uwzględnij podkategorie
          </label>
        </div>
        <div className="max-h-48 overflow-y-auto flex flex-col gap-2">
          {categories.slice(0, 10).map((category) => (
            <label
              key={category.id}
              className="flex items-center gap-2 cursor-pointer text-sm text-secondary-700"
            >
              <input
                type="checkbox"
                checked={filters.categoryIds?.includes(category.id) || false}
                onChange={() => toggleArrayValue('categoryIds', category.id)}
                className="w-4 h-4 accent-primary-500"
              />
              {category.icon} {category.name}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Machine Brands */}
      <FilterSection title="Marka maszyny" section="machineBrands">
        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
          {filterOptions?.machineBrands.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-2 cursor-pointer text-sm text-secondary-700"
            >
              <input
                type="checkbox"
                checked={filters.machineBrands?.includes(brand) || false}
                onChange={() => toggleArrayValue('machineBrands', brand)}
                className="w-4 h-4 accent-primary-500"
              />
              {brand}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Availability */}
      <FilterSection title="Dostępność" section="availability">
        <div className="flex flex-col gap-2">
          {filterOptions?.availability.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 cursor-pointer text-sm text-secondary-700"
            >
              <input
                type="checkbox"
                checked={filters.availability?.includes(option.value) || false}
                onChange={() => toggleArrayValue('availability', option.value)}
                className="w-4 h-4 accent-primary-500"
              />
              {option.label}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Zakres cen" section="price">
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs text-secondary-500 mb-1 block">
              Cena minimalna:
            </label>
            <input
              type="number"
              value={filters.minPrice || ''}
              onChange={(e) => updateFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)}
              placeholder="0"
              className="w-full p-2 border-2 border-neutral-200 rounded-lg text-sm text-secondary-700 outline-none focus:border-primary-500"
            />
          </div>
          <div>
            <label className="text-xs text-secondary-500 mb-1 block">
              Cena maksymalna:
            </label>
            <input
              type="number"
              value={filters.maxPrice || ''}
              onChange={(e) => updateFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
              placeholder="50000"
              className="w-full p-2 border-2 border-neutral-200 rounded-lg text-sm text-secondary-700 outline-none focus:border-primary-500"
            />
          </div>
          <div>
            <label className="text-xs text-secondary-500 mb-1 block">
              Waluta:
            </label>
            <select
              value={filters.currency}
              onChange={(e) => updateFilter('currency', e.target.value as 'PLN' | 'EUR')}
              className="w-full p-2 border-2 border-neutral-200 rounded-lg text-sm text-secondary-700 outline-none focus:border-primary-500"
            >
              <option value="PLN">PLN</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
        </div>
      </FilterSection>

      {/* Part Types (OEM vs Alternatives) */}
      <FilterSection title="Typ części" section="partTypes">
        <div className="flex flex-col gap-2">
          {filterOptions?.partTypes.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 cursor-pointer text-sm text-secondary-700"
            >
              <input
                type="checkbox"
                checked={filters.partTypes?.includes(option.value) || false}
                onChange={() => toggleArrayValue('partTypes', option.value)}
                className="w-4 h-4 accent-primary-500"
              />
              {option.label}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Manufacturers */}
      <FilterSection title="Producent" section="manufacturers">
        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
          {filterOptions?.manufacturers.map((manufacturer) => (
            <label
              key={manufacturer}
              className="flex items-center gap-2 cursor-pointer text-sm text-secondary-700"
            >
              <input
                type="checkbox"
                checked={filters.manufacturers?.includes(manufacturer) || false}
                onChange={() => toggleArrayValue('manufacturers', manufacturer)}
                className="w-4 h-4 accent-primary-500"
              />
              {manufacturer}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Quality/Rating */}
      <FilterSection title="Jakość & Oceny" section="quality">
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs text-secondary-500 mb-1 block">
              Minimalna ocena:
            </label>
            <select
              value={filters.minRating || ''}
              onChange={(e) => updateFilter('minRating', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full p-2 border-2 border-neutral-200 rounded-lg text-sm text-secondary-700 outline-none focus:border-primary-500"
            >
              <option value="">Wszystkie</option>
              <option value="4">4+ gwiazdki</option>
              <option value="4.5">4.5+ gwiazdki</option>
              <option value="5">5 gwiazdek</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-secondary-500 mb-1 block">
              Minimalna liczba recenzji:
            </label>
            <input
              type="number"
              value={filters.minReviews || ''}
              onChange={(e) => updateFilter('minReviews', e.target.value ? Number(e.target.value) : undefined)}
              placeholder="0"
              className="w-full p-2 border-2 border-neutral-200 rounded-lg text-sm text-secondary-700 outline-none focus:border-primary-500"
            />
          </div>
        </div>
      </FilterSection>

      {/* Sort */}
      <FilterSection title="Sortowanie" section="sort">
        <select
          value={filters.sortBy}
          onChange={(e) => updateFilter('sortBy', e.target.value)}
          className="w-full p-3 border-2 border-neutral-200 rounded-lg text-sm text-secondary-700 outline-none focus:border-primary-500"
        >
          {filterOptions?.sortBy.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FilterSection>

      {/* Apply Button */}
      {onApply && (
        <button
          onClick={onApply}
          className="w-full py-3 border-none rounded-xl bg-primary-500 text-white cursor-pointer text-base font-semibold mt-4 hover:bg-primary-600 transition-colors shadow-md"
        >
          Zastosuj filtry
        </button>
      )}

      {/* Active Filters Summary */}
      {getActiveFiltersCount() > 0 && (
        <div className="mt-4 p-3 bg-primary-50 rounded-xl text-xs text-primary-600 border-2 border-primary-200">
          Aktywne filtry: <strong>{getActiveFiltersCount()}</strong>
        </div>
      )}
    </div>
  )
}
