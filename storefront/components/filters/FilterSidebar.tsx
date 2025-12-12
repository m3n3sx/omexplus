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
    <aside className="hidden lg:block w-72 bg-neutral-800 border-r border-neutral-700 p-6 sticky top-40 h-[calc(100vh-10rem)] overflow-y-auto rounded-lg" aria-label="Filtry produktów">
      <h2 className="text-xl font-bold text-neutral-100 mb-6 uppercase tracking-wide">FILTRY</h2>
      <div className="h-1 w-16 bg-secondary-500 mb-6"></div>

      {/* Category Filter */}
      <section className="mb-6 pb-6 border-b border-neutral-700">
        <button
          className="w-full flex justify-between items-center font-bold text-neutral-100 border-t-2 border-secondary-500 pt-3 mb-3 uppercase tracking-wide text-sm hover:text-secondary-500 transition-colors"
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
              <label key={category.id} className="flex items-center gap-2 cursor-pointer hover:bg-neutral-750 p-2 rounded transition-colors group">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category.id)}
                  onChange={() => handleCategoryChange(category.id)}
                  className="w-4 h-4 text-secondary-500 bg-neutral-900 border-neutral-600 rounded focus:ring-secondary-500"
                />
                <span className="text-sm text-neutral-300 group-hover:text-neutral-100">
                  {category.name} <span className="text-neutral-500">({category.count})</span>
                </span>
              </label>
            ))}
          </fieldset>
        )}
      </section>

      {/* Price Filter */}
      <section className="mb-6 pb-6 border-b border-neutral-700">
        <button
          className="w-full flex justify-between items-center font-bold text-neutral-100 border-t-2 border-secondary-500 pt-3 mb-3 uppercase tracking-wide text-sm hover:text-secondary-500 transition-colors"
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
                className="flex-1 px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-sm text-neutral-100 placeholder-neutral-500 focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                aria-label="Minimalna cena"
              />
              <span className="text-neutral-500">-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.priceMax || ''}
                onChange={(e) => setFilters({ 
                  ...filters, 
                  priceMax: e.target.value ? Number(e.target.value) : null 
                })}
                className="flex-1 px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-sm text-neutral-100 placeholder-neutral-500 focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                aria-label="Maksymalna cena"
              />
            </div>
            <button 
              className="w-full px-4 py-2 bg-secondary-500 text-neutral-900 rounded font-bold hover:bg-secondary-400 transition-colors text-sm uppercase tracking-wide"
              onClick={handlePriceChange}
            >
              Zastosuj
            </button>
          </div>
        )}
      </section>

      {/* Manufacturer Filter */}
      <section className="mb-6 pb-6 border-b border-neutral-700">
        <button
          className="w-full flex justify-between items-center font-bold text-neutral-100 border-t-2 border-secondary-500 pt-3 mb-3 uppercase tracking-wide text-sm hover:text-secondary-500 transition-colors"
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
              <label key={manufacturer.id} className="flex items-center gap-2 cursor-pointer hover:bg-neutral-750 p-2 rounded transition-colors group">
                <input
                  type="checkbox"
                  checked={filters.manufacturers.includes(manufacturer.id)}
                  onChange={() => handleManufacturerChange(manufacturer.id)}
                  className="w-4 h-4 text-secondary-500 bg-neutral-900 border-neutral-600 rounded focus:ring-secondary-500"
                />
                <span className="text-sm text-neutral-300 group-hover:text-neutral-100">
                  {manufacturer.name} <span className="text-neutral-500">({manufacturer.count})</span>
                </span>
              </label>
            ))}
          </fieldset>
        )}
      </section>

      {/* Availability Filter */}
      <section className="mb-6">
        <button
          className="w-full flex justify-between items-center font-bold text-neutral-100 border-t-2 border-secondary-500 pt-3 mb-3 uppercase tracking-wide text-sm hover:text-secondary-500 transition-colors"
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
            <label className="flex items-center gap-2 cursor-pointer hover:bg-neutral-750 p-2 rounded transition-colors group">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => {
                  const newFilters = { ...filters, inStock: e.target.checked }
                  setFilters(newFilters)
                  onFilterChange(newFilters)
                }}
                className="w-4 h-4 text-secondary-500 bg-neutral-900 border-neutral-600 rounded focus:ring-secondary-500"
              />
              <span className="text-sm text-neutral-300 group-hover:text-neutral-100">
                Tylko w magazynie
              </span>
            </label>
          </fieldset>
        )}
      </section>

      {/* Clear Filters Button */}
      <button 
        className="w-full px-4 py-3 border-2 border-secondary-500 text-secondary-500 rounded-lg font-bold hover:bg-secondary-500 hover:text-neutral-900 transition-all uppercase tracking-wide text-sm"
        onClick={clearFilters}
      >
        Wyczyść filtry
      </button>
    </aside>
  )
}
