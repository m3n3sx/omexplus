'use client'

import { useState, useEffect } from 'react'
import { useSearchAssistantAnalytics } from '@/hooks/useSearchAssistantAnalytics'

interface DashboardProps {
  language?: string
}

export function SearchAssistantDashboard({ language = 'en' }: DashboardProps) {
  const [patterns, setPatterns] = useState<any[]>([])
  const [insights, setInsights] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { getPopularPatterns, getHelpInsights } = useSearchAssistantAnalytics()

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      const [patternsData, insightsData] = await Promise.all([
        getPopularPatterns(),
        getHelpInsights()
      ])

      if (patternsData.success) {
        setPatterns(patternsData.patterns || [])
      }
      if (insightsData.success) {
        setInsights(insightsData.insights)
      }
    } catch (error) {
      console.error('Failed to load dashboard:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-neutral-600">
          {language === 'pl' ? 'Ładowanie danych...' : 'Loading data...'}
        </p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">
          {language === 'pl' ? '📊 Panel Analityczny' : '📊 Analytics Dashboard'}
        </h2>
        <p className="text-neutral-600">
          {language === 'pl' 
            ? 'Monitoruj zachowania użytkowników i optymalizuj doświadczenie'
            : 'Monitor user behavior and optimize experience'}
        </p>
      </div>

      {/* Popular Patterns */}
      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          {language === 'pl' ? '🔥 Popularne wzorce wyszukiwania' : '🔥 Popular Search Patterns'}
        </h3>
        
        {patterns.length > 0 ? (
          <div className="space-y-3">
            {patterns.map((pattern, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-primary-600">#{index + 1}</span>
                  <div>
                    <div className="font-medium text-neutral-900">
                      {pattern.machine} → {pattern.category}
                    </div>
                    <div className="text-sm text-neutral-600">
                      {pattern.count} {language === 'pl' ? 'wyszukiwań' : 'searches'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary-600">
                    {pattern.percentage.toFixed(1)}%
                  </div>
                  <div className="w-24 h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-600"
                      style={{ width: `${pattern.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-neutral-500 text-center py-8">
            {language === 'pl' ? 'Brak danych' : 'No data available'}
          </p>
        )}
      </div>

      {/* Help Insights */}
      {insights && (
        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            {language === 'pl' ? '💡 Analiza próśb o pomoc' : '💡 Help Request Insights'}
          </h3>
          
          <div className="mb-4 p-4 bg-warning/10 border border-warning/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <span className="font-semibold text-neutral-900">
                {language === 'pl' ? 'Łącznie próśb o pomoc:' : 'Total help requests:'}
              </span>
              <span className="text-xl font-bold text-warning">
                {insights.totalHelpRequests}
              </span>
            </div>
            <p className="text-sm text-neutral-600">
              {language === 'pl' 
                ? 'Użytkownicy potrzebują pomocy w tych krokach:'
                : 'Users need help at these steps:'}
            </p>
          </div>

          <div className="space-y-2">
            {insights.mostDifficultSteps?.map((step: any) => (
              <div key={step.step} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-xl">📍</span>
                  <span className="font-medium text-neutral-900">
                    {language === 'pl' ? `Krok ${step.step}` : `Step ${step.step}`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-danger font-bold">{step.count}</span>
                  <span className="text-sm text-neutral-600">
                    {language === 'pl' ? 'próśb' : 'requests'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg border-2 border-primary-200 p-6">
        <h3 className="text-lg font-semibold text-primary-900 mb-3">
          {language === 'pl' ? '💡 Rekomendacje' : '💡 Recommendations'}
        </h3>
        <ul className="space-y-2 text-sm text-neutral-700">
          <li className="flex items-start gap-2">
            <span className="text-primary-600">✓</span>
            <span>
              {language === 'pl' 
                ? 'Dodaj więcej przykładów dla popularnych wzorców'
                : 'Add more examples for popular patterns'}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600">✓</span>
            <span>
              {language === 'pl' 
                ? 'Ulepsz pomoc dla trudnych kroków'
                : 'Improve help for difficult steps'}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600">✓</span>
            <span>
              {language === 'pl' 
                ? 'Rozważ automatyczne sugestie dla częstych wyszukiwań'
                : 'Consider auto-suggestions for frequent searches'}
            </span>
          </li>
        </ul>
      </div>

      {/* Refresh Button */}
      <div className="text-center">
        <button
          onClick={loadDashboardData}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          {language === 'pl' ? '🔄 Odśwież dane' : '🔄 Refresh Data'}
        </button>
      </div>
    </div>
  )
}
