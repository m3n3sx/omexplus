// Google Analytics Data API Integration
// Requires: @google-analytics/data package

const GA_PROPERTY_ID = process.env.GA_PROPERTY_ID || '458820636' // From G-CB30RXPQ69
const GOOGLE_APPLICATION_CREDENTIALS = process.env.GOOGLE_APPLICATION_CREDENTIALS

export interface AnalyticsData {
  overview: {
    users: number
    usersTrend: number
    sessions: number
    sessionsTrend: number
    pageViews: number
    pageViewsTrend: number
    bounceRate: number
    bounceRateTrend: number
    avgSessionDuration: string
    conversionRate: number
  }
  topPages: Array<{
    path: string
    title: string
    views: number
  }>
  trafficSources: Array<{
    source: string
    sessions: number
    percentage: number
  }>
  chartData: Array<{
    date: string
    users: number
    sessions: number
  }>
}

export async function getAnalyticsData(dateRange: '7d' | '30d' | '90d' = '7d'): Promise<AnalyticsData> {
  // If no credentials, return mock data
  if (!GOOGLE_APPLICATION_CREDENTIALS) {
    console.log('No Google credentials found, using mock data')
    return getMockAnalyticsData()
  }

  try {
    const { BetaAnalyticsDataClient } = await import('@google-analytics/data')
    const analyticsDataClient = new BetaAnalyticsDataClient()

    const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90
    const startDate = `${days}daysAgo`
    const previousStartDate = `${days * 2}daysAgo`
    const previousEndDate = `${days + 1}daysAgo`

    // Current period metrics
    const [currentResponse] = await analyticsDataClient.runReport({
      property: `properties/${GA_PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate: 'today' }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
        { name: 'bounceRate' },
        { name: 'averageSessionDuration' },
        { name: 'conversions' },
      ],
    })

    // Previous period for trends
    const [previousResponse] = await analyticsDataClient.runReport({
      property: `properties/${GA_PROPERTY_ID}`,
      dateRanges: [{ startDate: previousStartDate, endDate: previousEndDate }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
        { name: 'bounceRate' },
      ],
    })

    // Top pages
    const [pagesResponse] = await analyticsDataClient.runReport({
      property: `properties/${GA_PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate: 'today' }],
      dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }],
      metrics: [{ name: 'screenPageViews' }],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 10,
    })

    // Traffic sources
    const [sourcesResponse] = await analyticsDataClient.runReport({
      property: `properties/${GA_PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate: 'today' }],
      dimensions: [{ name: 'sessionSource' }],
      metrics: [{ name: 'sessions' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 5,
    })

    // Daily data for chart
    const [dailyResponse] = await analyticsDataClient.runReport({
      property: `properties/${GA_PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate: 'today' }],
      dimensions: [{ name: 'date' }],
      metrics: [{ name: 'activeUsers' }, { name: 'sessions' }],
      orderBys: [{ dimension: { dimensionName: 'date' }, desc: false }],
    })

    // Parse current metrics
    const currentRow = currentResponse.rows?.[0]
    const previousRow = previousResponse.rows?.[0]

    const users = parseInt(currentRow?.metricValues?.[0]?.value || '0')
    const prevUsers = parseInt(previousRow?.metricValues?.[0]?.value || '1')
    const sessions = parseInt(currentRow?.metricValues?.[1]?.value || '0')
    const prevSessions = parseInt(previousRow?.metricValues?.[1]?.value || '1')
    const pageViews = parseInt(currentRow?.metricValues?.[2]?.value || '0')
    const prevPageViews = parseInt(previousRow?.metricValues?.[2]?.value || '1')
    const bounceRate = parseFloat(currentRow?.metricValues?.[3]?.value || '0') * 100
    const prevBounceRate = parseFloat(previousRow?.metricValues?.[3]?.value || '0') * 100
    const avgDuration = parseFloat(currentRow?.metricValues?.[4]?.value || '0')
    const conversions = parseInt(currentRow?.metricValues?.[5]?.value || '0')

    // Calculate trends
    const calcTrend = (current: number, previous: number) => 
      previous > 0 ? Math.round(((current - previous) / previous) * 100 * 10) / 10 : 0

    // Parse top pages
    const topPages = (pagesResponse.rows || []).map(row => ({
      path: row.dimensionValues?.[0]?.value || '/',
      title: row.dimensionValues?.[1]?.value || 'Unknown',
      views: parseInt(row.metricValues?.[0]?.value || '0'),
    }))

    // Parse traffic sources
    const totalSessions = (sourcesResponse.rows || []).reduce(
      (sum, row) => sum + parseInt(row.metricValues?.[0]?.value || '0'), 0
    )
    const trafficSources = (sourcesResponse.rows || []).map(row => {
      const sourceSessions = parseInt(row.metricValues?.[0]?.value || '0')
      return {
        source: row.dimensionValues?.[0]?.value || 'Unknown',
        sessions: sourceSessions,
        percentage: Math.round((sourceSessions / totalSessions) * 100 * 10) / 10,
      }
    })

    // Parse daily chart data
    const chartData = (dailyResponse.rows || []).slice(-7).map(row => {
      const dateStr = row.dimensionValues?.[0]?.value || ''
      const formattedDate = dateStr ? 
        `${dateStr.slice(6, 8)} ${getMonthName(dateStr.slice(4, 6))}` : ''
      return {
        date: formattedDate,
        users: parseInt(row.metricValues?.[0]?.value || '0'),
        sessions: parseInt(row.metricValues?.[1]?.value || '0'),
      }
    })

    return {
      overview: {
        users,
        usersTrend: calcTrend(users, prevUsers),
        sessions,
        sessionsTrend: calcTrend(sessions, prevSessions),
        pageViews,
        pageViewsTrend: calcTrend(pageViews, prevPageViews),
        bounceRate: Math.round(bounceRate * 10) / 10,
        bounceRateTrend: calcTrend(bounceRate, prevBounceRate),
        avgSessionDuration: formatDuration(avgDuration),
        conversionRate: sessions > 0 ? Math.round((conversions / sessions) * 100 * 10) / 10 : 0,
      },
      topPages,
      trafficSources,
      chartData,
    }
  } catch (error) {
    console.error('Error fetching Analytics data:', error)
    return getMockAnalyticsData()
  }
}

function getMonthName(month: string): string {
  const months: Record<string, string> = {
    '01': 'Sty', '02': 'Lut', '03': 'Mar', '04': 'Kwi',
    '05': 'Maj', '06': 'Cze', '07': 'Lip', '08': 'Sie',
    '09': 'Wrz', '10': 'Paź', '11': 'Lis', '12': 'Gru',
  }
  return months[month] || month
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function getMockAnalyticsData(): AnalyticsData {
  return {
    overview: {
      users: 12453,
      usersTrend: 12.5,
      sessions: 18234,
      sessionsTrend: 8.3,
      pageViews: 45678,
      pageViewsTrend: 15.2,
      bounceRate: 42.3,
      bounceRateTrend: -3.1,
      avgSessionDuration: '2:34',
      conversionRate: 3.2,
    },
    topPages: [
      { path: '/', views: 8234, title: 'Strona główna' },
      { path: '/pl/products', views: 5123, title: 'Produkty' },
      { path: '/pl/categories/filtry', views: 3456, title: 'Filtry' },
      { path: '/pl/products/filtr-oleju-cat', views: 2345, title: 'Filtr oleju CAT' },
      { path: '/pl/kontakt', views: 1234, title: 'Kontakt' },
    ],
    trafficSources: [
      { source: 'Google Organic', sessions: 7234, percentage: 39.7 },
      { source: 'Google Ads', sessions: 4567, percentage: 25.0 },
      { source: 'Direct', sessions: 3456, percentage: 19.0 },
      { source: 'Facebook', sessions: 1890, percentage: 10.4 },
      { source: 'Referral', sessions: 1087, percentage: 6.0 },
    ],
    chartData: [
      { date: '24 Gru', users: 1234, sessions: 1567 },
      { date: '25 Gru', users: 987, sessions: 1234 },
      { date: '26 Gru', users: 1456, sessions: 1890 },
      { date: '27 Gru', users: 1678, sessions: 2123 },
      { date: '28 Gru', users: 1890, sessions: 2456 },
      { date: '29 Gru', users: 2012, sessions: 2678 },
      { date: '30 Gru', users: 2234, sessions: 2890 },
    ]
  }
}
