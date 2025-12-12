'use client'

import { useSearchAssistant } from '@/contexts/SearchAssistantContext'

interface QuickSearchButtonsProps {
  language?: string
}

const quickSearches = [
  {
    id: 'excavator',
    icon: '🚜',
    labelEn: 'Excavator Parts',
    labelPl: 'Części do koparek',
    data: { machineType: 'excavator' }
  },
  {
    id: 'loader',
    icon: '🏗️',
    labelEn: 'Loader Parts',
    labelPl: 'Części do ładowarek',
    data: { machineType: 'loader' }
  },
  {
    id: 'bulldozer',
    icon: '🚧',
    labelEn: 'Bulldozer Parts',
    labelPl: 'Części do spychaczy',
    data: { machineType: 'bulldozer' }
  },
  {
    id: 'hydraulics',
    icon: '💧',
    labelEn: 'Hydraulic Parts',
    labelPl: 'Części hydrauliczne',
    data: { category: 'hydraulics' }
  },
  {
    id: 'engine',
    icon: '⚙️',
    labelEn: 'Engine Parts',
    labelPl: 'Części silnika',
    data: { category: 'engine' }
  },
  {
    id: 'electrical',
    icon: '⚡',
    labelEn: 'Electrical Parts',
    labelPl: 'Części elektryczne',
    data: { category: 'electrical' }
  }
]

export function QuickSearchButtons({ language = 'en' }: QuickSearchButtonsProps) {
  const { launchSearchFromAssistant } = useSearchAssistant()

  const handleQuickSearch = (search: typeof quickSearches[0]) => {
    launchSearchFromAssistant(search.data)
  }

  return (
    <div className="my-4">
      <p className="text-sm text-neutral-600 mb-3">
        {language === 'pl' ? 'Szybkie wyszukiwanie:' : 'Quick search:'}
      </p>
      <div className="grid grid-cols-2 gap-2">
        {quickSearches.map((search) => (
          <button
            key={search.id}
            onClick={() => handleQuickSearch(search)}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-neutral-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all text-left"
          >
            <span className="text-xl">{search.icon}</span>
            <span className="text-sm font-medium text-neutral-900">
              {language === 'pl' ? search.labelPl : search.labelEn}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
