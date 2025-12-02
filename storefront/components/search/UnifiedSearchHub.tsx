'use client'

/**
 * UnifiedSearchHub - Zaawansowana wyszukiwarka z 5 metodami
 * Główny komponent wyszukiwania na stronie głównej
 */

import { useState } from 'react'
import EnhancedSearchBar from './EnhancedSearchBar'
import MachineSelector from './MachineSelector'
import PartNumberSearch from './PartNumberSearch'
import VisualSearch from './VisualSearch'
import AdvancedFilters from './AdvancedFilters'

type SearchMethod = 'text' | 'machine' | 'part-number' | 'visual' | 'filters'

interface UnifiedSearchHubProps {
  onSearch: (query: string, method: SearchMethod, params?: any) => void
  locale?: string
}

export default function UnifiedSearchHub({ onSearch, locale = 'pl' }: UnifiedSearchHubProps) {
  const [activeMethod, setActiveMethod] = useState<SearchMethod>('text')

  const searchMethods = [
    {
      id: 'text' as SearchMethod,
      name: 'Szukaj Tekstem',
      description: 'Wpisz nazwę części, markę lub model',
      color: 'bg-blue-500',
    },
    {
      id: 'machine' as SearchMethod,
      name: 'Według Maszyny',
      description: 'Wybierz markę i model maszyny',
      color: 'bg-green-500',
    },
    {
      id: 'part-number' as SearchMethod,
      name: 'Numer Katalogowy',
      description: 'Wpisz numer OEM lub SKU',
      color: 'bg-purple-500',
    },
    {
      id: 'visual' as SearchMethod,
      name: 'Szukaj Zdjęciem',
      description: 'Prześlij zdjęcie części',
      color: 'bg-orange-500',
    },
    {
      id: 'filters' as SearchMethod,
      name: 'Zaawansowane Filtry',
      description: 'Filtruj według kategorii, ceny, marki',
      color: 'bg-red-500',
    },
  ]

  const handleMethodSearch = (query: string, params?: any) => {
    onSearch(query, activeMethod, params)
  }

  return (
    <div className="w-full">
      {/* Method Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {searchMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => setActiveMethod(method.id)}
            className={`px-4 py-3 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
              activeMethod === method.id
                ? `${method.color} text-white shadow-lg`
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-left">
              <div>{method.name}</div>
              {activeMethod === method.id && (
                <div className="text-xs opacity-90 mt-1">{method.description}</div>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Search Content */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
        {/* Text Search */}
        {activeMethod === 'text' && (
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Wyszukiwanie Tekstowe
              </h3>
              <p className="text-sm text-gray-600">
                Wpisz nazwę części, markę maszyny, model lub opis. Np: "pompa hydrauliczna CAT 320", "filtr oleju Komatsu"
              </p>
            </div>
            <EnhancedSearchBar
              onSearch={handleMethodSearch}
              placeholder="Szukaj części (np. pompa hydrauliczna, 320-8134, filtr oleju CAT)..."
              locale={locale}
            />
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-xs text-gray-500">Popularne:</span>
              {['pompa hydrauliczna', 'filtr oleju', 'gąsienice gumowe', 'cylinder hydrauliczny'].map((term) => (
                <button
                  key={term}
                  onClick={() => handleMethodSearch(term)}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Machine Search */}
        {activeMethod === 'machine' && (
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Wyszukiwanie według Maszyny
              </h3>
              <p className="text-sm text-gray-600">
                Wybierz markę, typ i model maszyny - pokażemy wszystkie dostępne części
              </p>
            </div>
            <MachineSelector
              onComplete={(params) => handleMethodSearch('machine-search', params)}
              onCancel={() => setActiveMethod('text')}
            />
          </div>
        )}

        {/* Part Number Search */}
        {activeMethod === 'part-number' && (
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Wyszukiwanie po Numerze Katalogowym
              </h3>
              <p className="text-sm text-gray-600">
                Wpisz numer OEM, SKU lub kod producenta. Znajdziemy oryginał i zamienniki.
              </p>
            </div>
            <PartNumberSearch
              onSearch={(results) => {
                if (results) {
                  handleMethodSearch('part-number-search', results)
                }
              }}
            />
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <div className="text-sm text-blue-800">
                <strong>Wskazówka:</strong> Obsługujemy numery OEM (np. 320-8134), kody producenta (CAT, Komatsu), 
                oraz numery zamienników. System automatycznie znajdzie wszystkie dostępne alternatywy.
              </div>
            </div>
          </div>
        )}

        {/* Visual Search */}
        {activeMethod === 'visual' && (
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Wyszukiwanie Wizualne
              </h3>
              <p className="text-sm text-gray-600">
                Prześlij zdjęcie części - AI rozpozna typ i znajdzie podobne produkty
              </p>
            </div>
            <VisualSearch
              onSearch={(results) => {
                if (results) {
                  handleMethodSearch('visual-search', results)
                }
              }}
            />
            <div className="mt-4 grid grid-cols-3 gap-4 text-xs text-gray-600">
              <div className="p-3 bg-gray-50 rounded-lg border-l-2 border-green-500">
                <div className="font-semibold mb-1 text-green-700">Zdjęcie części</div>
                <div>Sfotografuj część z bliska</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border-l-2 border-blue-500">
                <div className="font-semibold mb-1 text-blue-700">Numer na części</div>
                <div>OCR odczyta numer katalogowy</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border-l-2 border-purple-500">
                <div className="font-semibold mb-1 text-purple-700">Diagram</div>
                <div>Zdjęcie z katalogu lub schematu</div>
              </div>
            </div>
          </div>
        )}

        {/* Advanced Filters */}
        {activeMethod === 'filters' && (
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Zaawansowane Filtry
              </h3>
              <p className="text-sm text-gray-600">
                Precyzyjnie określ czego szukasz - kategoria, marka, cena, dostępność
              </p>
            </div>
            <AdvancedFilters
              onFilterChange={(filters) => handleMethodSearch('filter-search', filters)}
              onApply={() => {
                // Filters are already applied via onFilterChange
              }}
            />
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-4 gap-4 text-center">
        <div className="p-4 bg-white rounded-lg border">
          <div className="text-2xl font-bold text-primary-500">50,000+</div>
          <div className="text-xs text-gray-600">Części w magazynie</div>
        </div>
        <div className="p-4 bg-white rounded-lg border">
          <div className="text-2xl font-bold text-green-500">18</div>
          <div className="text-xs text-gray-600">Kategorii głównych</div>
        </div>
        <div className="p-4 bg-white rounded-lg border">
          <div className="text-2xl font-bold text-blue-500">40+</div>
          <div className="text-xs text-gray-600">Marek maszyn</div>
        </div>
        <div className="p-4 bg-white rounded-lg border">
          <div className="text-2xl font-bold text-orange-500">24-48h</div>
          <div className="text-xs text-gray-600">Dostawa</div>
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-l-4 border-blue-500">
        <h4 className="font-bold text-gray-800 mb-2 text-lg">
          Nie możesz znaleźć części?
        </h4>
        <p className="text-sm text-gray-600 mb-4">
          Nasi eksperci pomogą Ci znaleźć dokładnie to, czego potrzebujesz. 
          Wyślij zdjęcie, numer katalogowy lub opis - odpowiemy w 15 minut!
        </p>
        <div className="flex gap-3 flex-wrap">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors">
            Czat na żywo
          </button>
          <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
            Wyślij zapytanie
          </button>
          <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
            Zadzwoń: +48 123 456 789
          </button>
        </div>
      </div>
    </div>
  )
}
