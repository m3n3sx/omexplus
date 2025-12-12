import type { MedusaRequest, MedusaResponse } from '@medusajs/medusa'

interface AnalyticsEvent {
  action: string
  data: any
  timestamp: string
  sessionId?: string
}

// In-memory storage for demo (use database in production)
const analyticsStore: AnalyticsEvent[] = []
const behaviorPatterns = new Map<string, number>()

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { action, data, timestamp } = req.body

    // Store event
    const event: AnalyticsEvent = {
      action,
      data,
      timestamp,
      sessionId: data.sessionId || `session_${Date.now()}`
    }
    analyticsStore.push(event)

    // Update behavior patterns
    const patternKey = generatePatternKey(data)
    if (patternKey) {
      const currentCount = behaviorPatterns.get(patternKey) || 0
      behaviorPatterns.set(patternKey, currentCount + 1)
    }

    // Track specific actions
    switch (action) {
      case 'launch_from_assistant':
        trackLaunchFromAssistant(data)
        break
      case 'return_to_assistant':
        trackReturnToAssistant(data)
        break
      case 'request_help':
        trackHelpRequest(data)
        break
      case 'part_selected':
        trackPartSelection(data)
        break
    }

    res.json({
      success: true,
      message: 'Analytics tracked',
      eventId: event.sessionId
    })
  } catch (error) {
    console.error('Analytics tracking error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to track analytics'
    })
  }
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const action = req.query.action as string

    switch (action) {
      case 'patterns':
        return getPopularPatterns(res)
      case 'recommendations':
        return getRecommendations(req, res)
      case 'help-insights':
        return getHelpInsights(res)
      default:
        res.json({
          success: true,
          totalEvents: analyticsStore.length,
          patterns: Array.from(behaviorPatterns.entries()).slice(0, 10)
        })
    }
  } catch (error) {
    console.error('Analytics retrieval error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve analytics'
    })
  }
}

function generatePatternKey(data: any): string | null {
  if (data.machineType && data.category) {
    return `${data.machineType}:${data.category}`
  }
  if (data.manufacturer && data.category) {
    return `${data.manufacturer}:${data.category}`
  }
  return null
}

function trackLaunchFromAssistant(data: any) {
  console.log('User launched search from assistant:', data)
  // Track conversion from assistant to search
}

function trackReturnToAssistant(data: any) {
  console.log('User returned to assistant:', data)
  // Track completion and return behavior
}

function trackHelpRequest(data: any) {
  console.log('User requested help at step:', data.step)
  // Track where users get stuck
}

function trackPartSelection(data: any) {
  console.log('User selected part:', data.partId)
  // Track successful conversions
}

function getPopularPatterns(res: MedusaResponse) {
  const sorted = Array.from(behaviorPatterns.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)

  res.json({
    success: true,
    patterns: sorted.map(([pattern, count]) => {
      const [machine, category] = pattern.split(':')
      return {
        machine,
        category,
        count,
        percentage: (count / analyticsStore.length) * 100
      }
    })
  })
}

function getRecommendations(req: MedusaRequest, res: MedusaResponse) {
  const machineType = req.query.machineType as string
  const manufacturer = req.query.manufacturer as string

  // Find related patterns
  const related = Array.from(behaviorPatterns.entries())
    .filter(([pattern]) => {
      if (machineType && pattern.includes(machineType)) return true
      if (manufacturer && pattern.includes(manufacturer)) return true
      return false
    })
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  res.json({
    success: true,
    recommendations: related.map(([pattern, count]) => ({
      pattern,
      count,
      confidence: Math.min((count / 10) * 100, 100)
    }))
  })
}

function getHelpInsights(res: MedusaResponse) {
  const helpRequests = analyticsStore.filter(e => e.action === 'request_help')
  const stepCounts = new Map<number, number>()

  helpRequests.forEach(event => {
    const step = event.data.step
    stepCounts.set(step, (stepCounts.get(step) || 0) + 1)
  })

  res.json({
    success: true,
    insights: {
      totalHelpRequests: helpRequests.length,
      mostDifficultSteps: Array.from(stepCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([step, count]) => ({ step, count }))
    }
  })
}
