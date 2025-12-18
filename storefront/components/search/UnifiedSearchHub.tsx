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
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      id: 'machine' as SearchMethod,
      name: 'Według Maszyny',
      description: 'Wybierz markę i model maszyny',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
    },
    {
      id: 'part-number' as SearchMethod,
      name: 'Numer Katalogowy',
      description: 'Wpisz numer OEM lub SKU',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
        </svg>
      ),
    },
    {
      id: 'visual' as SearchMethod,
      name: 'Szukaj Zdjęciem',
      description: 'Prześlij zdjęcie części',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      id: 'filters' as SearchMethod,
      name: 'Zaawansowane Filtry',
      description: 'Filtruj według kategorii, ceny, marki',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
    },
  ]

  const handleMethodSearch = (query: string, params?: any) => {
    onSearch(query, activeMethod, params)
  }

  return (
    <div className="w-full">
      {/* Method Tabs - Induxter style */}
      <div className="w-full flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {searchMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => setActiveMethod(method.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all font-heading ${
              activeMethod === method.id
                ? 'bg-primary-500 text-white'
                : 'bg-neutral-100 text-secondary-700 hover:bg-neutral-200'
            }`}
          >
            {method.icon}
            <span>{method.name}</span>
          </button>
        ))}
      </div>

      {/* Search Content - Induxter style */}
      <div className="bg-neutral-50 rounded-lg p-8">
        {/* Text Search */}
        {activeMethod === 'text' && (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-bold text-secondary-800 mb-2">
                Wyszukiwanie Tekstowe
              </h3>
              <p className="text-sm text-secondary-600 leading-relaxed">
                Wpisz nazwę części, markę maszyny, model lub opis. Np: "pompa hydrauliczna CAT 320", "filtr oleju Komatsu"
              </p>
            </div>
            <EnhancedSearchBar
              onSearch={handleMethodSearch}
              placeholder="Szukaj części (np. pompa hydrauliczna, 320-8134, filtr oleju CAT)..."
              locale={locale}
            />
            <div className="mt-6 flex flex-wrap gap-3 items-center">
              <span className="text-xs text-secondary-600 flex items-center gap-2">
                <svg className="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Popularne:
              </span>
              {['pompa hydrauliczna', 'filtr oleju', 'gąsienice gumowe', 'cylinder hydrauliczny'].map((term) => (
                <button
                  key={term}
                  onClick={() => handleMethodSearch(term)}
                  className="px-5 py-2.5 bg-white text-secondary-700 rounded-full text-xs hover:bg-primary-500 hover:text-white transition-all duration-300 border border-neutral-200 hover:border-primary-500"
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
            <div className="mb-6">
              <h3 className="text-lg font-bold text-secondary-800 mb-2">
                Wyszukiwanie według Maszyny
              </h3>
              <p className="text-sm text-secondary-600 leading-relaxed">
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
            <div className="mb-6">
              <h3 className="text-lg font-bold text-secondary-800 mb-2">
                Wyszukiwanie po Numerze Katalogowym
              </h3>
              <p className="text-sm text-secondary-600 leading-relaxed">
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
            <div className="mt-6 p-6 bg-white rounded-3xl border border-neutral-200">
              <div className="text-sm text-secondary-700 leading-relaxed flex gap-3">
                <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <strong className="font-bold text-primary-600">Wskazówka:</strong> Obsługujemy numery OEM (np. 320-8134), kody producenta (CAT, Komatsu), 
                  oraz numery zamienników. System automatycznie znajdzie wszystkie dostępne alternatywy.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Visual Search */}
        {activeMethod === 'visual' && (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-bold text-secondary-800 mb-2">
                Wyszukiwanie Wizualne
              </h3>
              <p className="text-sm text-secondary-600 leading-relaxed">
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
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-6 bg-white rounded-3xl border border-neutral-200 hover:border-primary-500 transition-all duration-300 hover:shadow-md">
                <svg className="w-10 h-10 text-primary-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div className="font-bold mb-1 text-secondary-800">Zdjęcie części</div>
                <div className="text-secondary-600 text-xs">Sfotografuj część z bliska</div>
              </div>
              <div className="p-6 bg-white rounded-3xl border border-neutral-200 hover:border-primary-500 transition-all duration-300 hover:shadow-md">
                <svg className="w-10 h-10 text-primary-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div className="font-bold mb-1 text-secondary-800">Numer na części</div>
                <div className="text-secondary-600 text-xs">OCR odczyta numer katalogowy</div>
              </div>
              <div className="p-6 bg-white rounded-3xl border border-neutral-200 hover:border-primary-500 transition-all duration-300 hover:shadow-md">
                <svg className="w-10 h-10 text-primary-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
                <div className="font-bold mb-1 text-secondary-800">Diagram</div>
                <div className="text-secondary-600 text-xs">Zdjęcie z katalogu lub schematu</div>
              </div>
            </div>
          </div>
        )}

        {/* Advanced Filters */}
        {activeMethod === 'filters' && (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-bold text-secondary-800 mb-2">
                Zaawansowane Filtry
              </h3>
              <p className="text-sm text-secondary-600 leading-relaxed">
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

      {/* Help Section - Induxter style */}
      <div className="mt-8 bg-secondary-700 rounded-lg p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2 text-white font-heading">Nie możesz znaleźć części?</h3>
            <p className="text-neutral-300 text-sm mb-6">
              Nasi eksperci pomogą Ci znaleźć dokładnie to, czego potrzebujesz. Wyślij zdjęcie, numer katalogowy lub opis - odpowiemy w 15 minut!
            </p>
            <div className="flex flex-wrap gap-3">
              <a className="px-6 py-3 bg-primary-500 text-white rounded-full font-bold hover:bg-secondary-700 hover:border hover:border-primary-500 transition-all" href="/pl/kontakt">
                Czat na żywo
              </a>
              <a className="px-6 py-3 bg-transparent border border-neutral-500 text-white rounded-full font-bold hover:border-primary-500 hover:text-primary-500 transition-all" href="/pl/kontakt">
                Wyślij zapytanie
              </a>
              <a href="tel:+48500169060" className="px-6 py-3 bg-transparent border border-neutral-500 text-white rounded-full font-bold hover:border-primary-500 hover:text-primary-500 transition-all flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +48 500 169 060
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
