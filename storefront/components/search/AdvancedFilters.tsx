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
    <div style={{
      borderBottom: '1px solid #e5e7eb',
      paddingBottom: '1rem',
      marginBottom: '1rem',
    }}>
      <button
        onClick={() => toggleSection(section)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.75rem 0',
          border: 'none',
          backgroundColor: 'transparent',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: '600',
        }}
      >
        <span>{title}</span>
        <span style={{ fontSize: '1.25rem' }}>
          {expandedSections[section] ? '−' : '+'}
        </span>
      </button>
      {expandedSections[section] && (
        <div style={{ paddingTop: '0.75rem' }}>
          {children}
        </div>
      )}
    </div>
  )

  return (
    <div style={{
      width: '100%',
      maxWidth: '320px',
      backgroundColor: 'var(--background)',
      borderRadius: '8px',
      padding: '1.5rem',
      border: '1px solid #e5e7eb',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
          Filtry
        </h2>
        {getActiveFiltersCount() > 0 && (
          <button
            onClick={clearAllFilters}
            style={{
              padding: '0.25rem 0.75rem',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: '#fee2e2',
              color: '#991b1b',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: '600',
            }}
          >
            Wyczyść ({getActiveFiltersCount()})
          </button>
        )}
      </div>

      {/* Categories */}
      <FilterSection title="Kategorie" section="categories">
        <div style={{ marginBottom: '0.75rem' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            fontSize: '0.875rem',
          }}>
            <input
              type="checkbox"
              checked={filters.includeSubcategories}
              onChange={(e) => updateFilter('includeSubcategories', e.target.checked)}
            />
            Uwzględnij podkategorie
          </label>
        </div>
        <div style={{
          maxHeight: '200px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}>
          {categories.slice(0, 10).map((category) => (
            <label
              key={category.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              <input
                type="checkbox"
                checked={filters.categoryIds?.includes(category.id) || false}
                onChange={() => toggleArrayValue('categoryIds', category.id)}
              />
              {category.icon} {category.name}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Machine Brands */}
      <FilterSection title="Marka maszyny" section="machineBrands">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          maxHeight: '200px',
          overflowY: 'auto',
        }}>
          {filterOptions?.machineBrands.map((brand) => (
            <label
              key={brand}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              <input
                type="checkbox"
                checked={filters.machineBrands?.includes(brand) || false}
                onChange={() => toggleArrayValue('machineBrands', brand)}
              />
              {brand}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Availability */}
      <FilterSection title="Dostępność" section="availability">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}>
          {filterOptions?.availability.map((option) => (
            <label
              key={option.value}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              <input
                type="checkbox"
                checked={filters.availability?.includes(option.value) || false}
                onChange={() => toggleArrayValue('availability', option.value)}
              />
              {option.label}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Zakres cen" section="price">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem', display: 'block' }}>
              Cena minimalna:
            </label>
            <input
              type="number"
              value={filters.minPrice || ''}
              onChange={(e) => updateFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)}
              placeholder="0"
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '0.875rem',
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem', display: 'block' }}>
              Cena maksymalna:
            </label>
            <input
              type="number"
              value={filters.maxPrice || ''}
              onChange={(e) => updateFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
              placeholder="50000"
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '0.875rem',
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem', display: 'block' }}>
              Waluta:
            </label>
            <select
              value={filters.currency}
              onChange={(e) => updateFilter('currency', e.target.value as 'PLN' | 'EUR')}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '0.875rem',
              }}
            >
              <option value="PLN">PLN</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
        </div>
      </FilterSection>

      {/* Part Types (OEM vs Alternatives) */}
      <FilterSection title="Typ części" section="partTypes">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}>
          {filterOptions?.partTypes.map((option) => (
            <label
              key={option.value}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              <input
                type="checkbox"
                checked={filters.partTypes?.includes(option.value) || false}
                onChange={() => toggleArrayValue('partTypes', option.value)}
              />
              {option.label}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Manufacturers */}
      <FilterSection title="Producent" section="manufacturers">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          maxHeight: '200px',
          overflowY: 'auto',
        }}>
          {filterOptions?.manufacturers.map((manufacturer) => (
            <label
              key={manufacturer}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              <input
                type="checkbox"
                checked={filters.manufacturers?.includes(manufacturer) || false}
                onChange={() => toggleArrayValue('manufacturers', manufacturer)}
              />
              {manufacturer}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Quality/Rating */}
      <FilterSection title="Jakość & Oceny" section="quality">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem', display: 'block' }}>
              Minimalna ocena:
            </label>
            <select
              value={filters.minRating || ''}
              onChange={(e) => updateFilter('minRating', e.target.value ? Number(e.target.value) : undefined)}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '0.875rem',
              }}
            >
              <option value="">Wszystkie</option>
              <option value="4">4+ gwiazdki</option>
              <option value="4.5">4.5+ gwiazdki</option>
              <option value="5">5 gwiazdek</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem', display: 'block' }}>
              Minimalna liczba recenzji:
            </label>
            <input
              type="number"
              value={filters.minReviews || ''}
              onChange={(e) => updateFilter('minReviews', e.target.value ? Number(e.target.value) : undefined)}
              placeholder="0"
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '0.875rem',
              }}
            />
          </div>
        </div>
      </FilterSection>

      {/* Sort */}
      <FilterSection title="Sortowanie" section="sort">
        <select
          value={filters.sortBy}
          onChange={(e) => updateFilter('sortBy', e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            fontSize: '0.875rem',
          }}
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
          style={{
            width: '100%',
            padding: '0.75rem',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: '#3b82f6',
            color: 'white',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600',
            marginTop: '1rem',
          }}
        >
          Zastosuj filtry
        </button>
      )}

      {/* Active Filters Summary */}
      {getActiveFiltersCount() > 0 && (
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem',
          backgroundColor: '#eff6ff',
          borderRadius: '6px',
          fontSize: '0.75rem',
          color: '#1e40af',
        }}>
          Aktywne filtry: <strong>{getActiveFiltersCount()}</strong>
        </div>
      )}
    </div>
  )
}
