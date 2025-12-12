'use client'

import { useTranslations } from 'next-intl'

interface SearchLaunchCardProps {
  machineType?: string
  manufacturer?: string
  model?: string
  category?: string
  onLaunch: () => void
  language?: string
}

export function SearchLaunchCard({
  machineType,
  manufacturer,
  model,
  category,
  onLaunch,
  language = 'en'
}: SearchLaunchCardProps) {
  const t = useTranslations('integration')

  return (
    <div className="bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-primary-200 rounded-lg p-4 my-3">
      <div className="flex items-start gap-3">
        <div className="text-3xl">🔍</div>
        <div className="flex-1">
          <h4 className="font-semibold text-primary-900 mb-2">
            {language === 'pl' ? 'Gotowy do wyszukiwania!' : 'Ready to Search!'}
          </h4>
          
          {/* Pre-filled data preview */}
          {(machineType || manufacturer || model || category) && (
            <div className="space-y-1 mb-3 text-sm">
              {machineType && (
                <div className="flex items-center gap-2">
                  <span className="text-primary-600">✓</span>
                  <span className="text-neutral-700">
                    {language === 'pl' ? 'Typ:' : 'Type:'} <strong>{machineType}</strong>
                  </span>
                </div>
              )}
              {manufacturer && (
                <div className="flex items-center gap-2">
                  <span className="text-primary-600">✓</span>
                  <span className="text-neutral-700">
                    {language === 'pl' ? 'Producent:' : 'Manufacturer:'} <strong>{manufacturer}</strong>
                  </span>
                </div>
              )}
              {model && (
                <div className="flex items-center gap-2">
                  <span className="text-primary-600">✓</span>
                  <span className="text-neutral-700">
                    {language === 'pl' ? 'Model:' : 'Model:'} <strong>{model}</strong>
                  </span>
                </div>
              )}
              {category && (
                <div className="flex items-center gap-2">
                  <span className="text-primary-600">✓</span>
                  <span className="text-neutral-700">
                    {language === 'pl' ? 'Kategoria:' : 'Category:'} <strong>{category}</strong>
                  </span>
                </div>
              )}
            </div>
          )}

          <button
            onClick={onLaunch}
            className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            {t('launchingSearch')} →
          </button>
        </div>
      </div>
    </div>
  )
}
