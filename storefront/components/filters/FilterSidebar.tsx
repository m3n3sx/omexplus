'use client'

import { useState } from 'react'

interface Category {
  id: string
  name: string
  count: number
}

interface Manufacturer {
  id: string
  name: string
  count: number
}

interface Filters {
  categories: string[]
  manufacturers: string[]
  priceMin: number | null
  priceMax: number | null
  inStock: boolean
}

interface FilterSidebarProps {
  categories: Category[]
  manufacturers: Manufacturer[]
  onFilterChange: (filters: Filters) => void
}

export function FilterSidebar({ 
  categories, 
  manufacturers, 
  onFilterChange 
}: FilterSidebarProps) {
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    manufacturers: [],
    priceMin: null,
    priceMax: null,
    inStock: false,
  })

  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    manufacturer: true,
    availability: true,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleCategoryChange = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter(id => id !== categoryId)
      : [...filters.categories, categoryId]
    
    const newFilters = { ...filters, categories: newCategories }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleManufacturerChange = (manufacturerId: string) => {
    const newManufacturers = filters.manufacturers.includes(manufacturerId)
      ? filters.manufacturers.filter(id => id !== manufacturerId)
      : [...filters.manufacturers, manufacturerId]
    
    const newFilters = { ...filters, manufacturers: newManufacturers }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handlePriceChange = () => {
    onFilterChange(filters)
  }

  const clearFilters = () => {
    const emptyFilters: Filters = {
      categories: [],
      manufacturers: [],
      priceMin: null,
      priceMax: null,
      inStock: false,
    }
    setFilters(emptyFilters)
    onFilterChange(emptyFilters)
  }

  return (
    <aside className="hidden lg:block w-72 bg-white border-r border-gray-200 p-6 sticky top-40 h-[calc(100vh-10rem)] overflow-y-auto" aria-label="Filtry produktów">
      <h2 className="text-xl font-bold text-gray-900 mb-6">FILTRY</h2>

      {/* Category Filter */}
      <section className="mb-6 pb-6 border-b border-gray-200">
        <button
          className="w-full flex justify-between items-center font-semibold text-gray-900 border-t-2 border-secondary pt-3 mb-3"
          onClick={() => toggleSection('category')}
          aria-expanded={expandedSections.category}
        >
          <span>Kategoria</span>
          <span aria-hidden="true">
            {expandedSections.category ? '▼' : '▶'}
          </span>
        </button>
        
        {expandedSections.category && (
          <fieldset className="space-y-2">
            <legend className="sr-only">Wybierz kategorię</legend>
            {categories.map(category => (
              <label key={category.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category.id)}
                  onChange={() => handleCategoryChange(category.id)}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-sm text-gray-700">
                  {category.name} ({category.count})
                </span>
              </label>
            ))}
          </fieldset>
        )}
      </section>

      {/* Price Filter */}
      <section className="mb-6 pb-6 border-b border-gray-200">
        <button
          className="w-full flex justify-between items-center font-semibold text-gray-900 border-t-2 border-secondary pt-3 mb-3"
          onClick={() => toggleSection('price')}
          aria-expanded={expandedSections.price}
        >
          <span>Cena</span>
          <span aria-hidden="true">
            {expandedSections.price ? '▼' : '▶'}
          </span>
        </button>
        
        {expandedSections.price && (
          <div className="space-y-3">
            <div className="flex gap-2 items-center">
              <input
                type="number"
                placeholder="Min"
                value={filters.priceMin || ''}
                onChange={(e) => setFilters({ 
                  ...filters, 
                  priceMin: e.target.value ? Number(e.target.value) : null 
                })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                aria-label="Minimalna cena"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.priceMax || ''}
                onChange={(e) => setFilters({ 
                  ...filters, 
                  priceMax: e.target.value ? Number(e.target.value) : null 
                })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                aria-label="Maksymalna cena"
              />
            </div>
            <button 
              className="w-full px-4 py-2 bg-primary text-white rounded font-semibold hover:bg-primary-dark transition-colors text-sm"
              onClick={handlePriceChange}
            >
              Zastosuj
            </button>
          </div>
        )}
      </section>

      {/* Manufacturer Filter */}
      <section className="mb-6 pb-6 border-b border-gray-200">
        <button
          className="w-full flex justify-between items-center font-semibold text-gray-900 border-t-2 border-secondary pt-3 mb-3"
          onClick={() => toggleSection('manufacturer')}
          aria-expanded={expandedSections.manufacturer}
        >
          <span>Producent</span>
          <span aria-hidden="true">
            {expandedSections.manufacturer ? '▼' : '▶'}
          </span>
        </button>
        
        {expandedSections.manufacturer && (
          <fieldset className="space-y-2">
            <legend className="sr-only">Wybierz producenta</legend>
            {manufacturers.map(manufacturer => (
              <label key={manufacturer.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
                <input
                  type="checkbox"
                  checked={filters.manufacturers.includes(manufacturer.id)}
                  onChange={() => handleManufacturerChange(manufacturer.id)}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-sm text-gray-700">
                  {manufacturer.name} ({manufacturer.count})
                </span>
              </label>
            ))}
          </fieldset>
        )}
      </section>

      {/* Availability Filter */}
      <section className="mb-6">
        <button
          className="w-full flex justify-between items-center font-semibold text-gray-900 border-t-2 border-secondary pt-3 mb-3"
          onClick={() => toggleSection('availability')}
          aria-expanded={expandedSections.availability}
        >
          <span>Dostępność</span>
          <span aria-hidden="true">
            {expandedSections.availability ? '▼' : '▶'}
          </span>
        </button>
        
        {expandedSections.availability && (
          <fieldset className="space-y-2">
            <legend className="sr-only">Wybierz dostępność</legend>
            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => {
                  const newFilters = { ...filters, inStock: e.target.checked }
                  setFilters(newFilters)
                  onFilterChange(newFilters)
                }}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className="text-sm text-gray-700">
                Tylko w magazynie
              </span>
            </label>
          </fieldset>
        )}
      </section>

      {/* Clear Filters Button */}
      <button 
        className="w-full px-4 py-3 border border-primary text-primary rounded font-semibold hover:bg-primary hover:text-white transition-all"
        onClick={clearFilters}
      >
        Wyczyść filtry
      </button>
    </aside>
  )
}
