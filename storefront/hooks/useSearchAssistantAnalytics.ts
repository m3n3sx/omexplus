import { useCallback } from 'react'

interface AnalyticsEvent {
  action: string
  data: any
  timestamp?: string
}

export function useSearchAssistantAnalytics() {
  const trackEvent = useCallback(async (event: AnalyticsEvent) => {
    try {
      await fetch('/api/search-assistant-analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...event,
          timestamp: event.timestamp || new Date().toISOString()
        })
      })
    } catch (error) {
      console.error('Analytics tracking failed:', error)
    }
  }, [])

  const trackLaunch = useCallback((data: any) => {
    trackEvent({
      action: 'launch_from_assistant',
      data
    })
  }, [trackEvent])

  const trackReturn = useCallback((data: any) => {
    trackEvent({
      action: 'return_to_assistant',
      data
    })
  }, [trackEvent])

  const trackHelp = useCallback((step: number, context: any) => {
    trackEvent({
      action: 'request_help',
      data: { step, context }
    })
  }, [trackEvent])

  const trackSelection = useCallback((partId: string, partData: any) => {
    trackEvent({
      action: 'part_selected',
      data: { partId, partData }
    })
  }, [trackEvent])

  const trackStepComplete = useCallback((step: number, data: any) => {
    trackEvent({
      action: 'step_complete',
      data: { step, ...data }
    })
  }, [trackEvent])

  const getPopularPatterns = useCallback(async () => {
    try {
      const response = await fetch('/api/search-assistant-analytics?action=patterns')
      return await response.json()
    } catch (error) {
      console.error('Failed to get patterns:', error)
      return { success: false, patterns: [] }
    }
  }, [])

  const getHelpInsights = useCallback(async () => {
    try {
      const response = await fetch('/api/search-assistant-analytics?action=help-insights')
      return await response.json()
    } catch (error) {
      console.error('Failed to get insights:', error)
      return { success: false, insights: null }
    }
  }, [])

  return {
    trackEvent,
    trackLaunch,
    trackReturn,
    trackHelp,
    trackSelection,
    trackStepComplete,
    getPopularPatterns,
    getHelpInsights
  }
}
