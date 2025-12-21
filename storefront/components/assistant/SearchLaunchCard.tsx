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
        <svg className="w-8 h-8 text-primary-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <div className="flex-1">
          <h4 className="font-semibold text-primary-900 mb-2">
            {language === 'pl' ? 'Gotowy do wyszukiwania!' : 'Ready to Search!'}
          </h4>
          
          {/* Pre-filled data preview */}
          {(machineType || manufacturer || model || category) && (
            <div className="space-y-1 mb-3 text-sm">
              {machineType && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span className="text-neutral-700">
                    {language === 'pl' ? 'Typ:' : 'Type:'} <strong>{machineType}</strong>
                  </span>
                </div>
              )}
              {manufacturer && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span className="text-neutral-700">
                    {language === 'pl' ? 'Producent:' : 'Manufacturer:'} <strong>{manufacturer}</strong>
                  </span>
                </div>
              )}
              {model && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span className="text-neutral-700">
                    {language === 'pl' ? 'Model:' : 'Model:'} <strong>{model}</strong>
                  </span>
                </div>
              )}
              {category && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
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
