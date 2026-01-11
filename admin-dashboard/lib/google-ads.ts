// Google Ads API Integration
// Requires: google-ads-api package and OAuth credentials

const GOOGLE_ADS_CUSTOMER_ID = process.env.GOOGLE_ADS_CUSTOMER_ID || '751-186-138'
const GOOGLE_ADS_DEVELOPER_TOKEN = process.env.GOOGLE_ADS_DEVELOPER_TOKEN
const GOOGLE_ADS_CLIENT_ID = process.env.GOOGLE_ADS_CLIENT_ID
const GOOGLE_ADS_CLIENT_SECRET = process.env.GOOGLE_ADS_CLIENT_SECRET
const GOOGLE_ADS_REFRESH_TOKEN = process.env.GOOGLE_ADS_REFRESH_TOKEN

export interface AdsData {
  overview: {
    spend: number
    spendTrend: number
    impressions: number
    impressionsTrend: number
    clicks: number
    clicksTrend: number
    ctr: number
    conversions: number
    conversionsTrend: number
    costPerConversion: number
    roas: number
  }
  campaigns: Array<{
    id: string
    name: string
    status: 'active' | 'paused' | 'ended'
    spend: number
    clicks: number
    impressions: number
    conversions: number
    roas: number
  }>
}

export async function getAdsData(dateRange: '7d' | '30d' | '90d' = '7d'): Promise<AdsData> {
  // Check if we have all required credentials
  if (!GOOGLE_ADS_DEVELOPER_TOKEN || !GOOGLE_ADS_CLIENT_ID || !GOOGLE_ADS_REFRESH_TOKEN) {
    console.log('Google Ads credentials not configured, using mock data')
    return getMockAdsData()
  }

  try {
    const { GoogleAdsApi } = await import('google-ads-api')
    
    const client = new GoogleAdsApi({
      client_id: GOOGLE_ADS_CLIENT_ID,
      client_secret: GOOGLE_ADS_CLIENT_SECRET || '',
      developer_token: GOOGLE_ADS_DEVELOPER_TOKEN,
    })

    const customer = client.Customer({
      customer_id: GOOGLE_ADS_CUSTOMER_ID.replace(/-/g, ''),
      refresh_token: GOOGLE_ADS_REFRESH_TOKEN,
    })

    const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90
    const today = new Date()
    const startDate = new Date(today.getTime() - days * 24 * 60 * 60 * 1000)
    const previousStartDate = new Date(startDate.getTime() - days * 24 * 60 * 60 * 1000)

    const formatDate = (d: Date) => d.toISOString().split('T')[0]

    // Get current period metrics
    const currentMetrics = await customer.query(`
      SELECT
        metrics.cost_micros,
        metrics.impressions,
        metrics.clicks,
        metrics.conversions,
        metrics.conversions_value
      FROM customer
      WHERE segments.date BETWEEN '${formatDate(startDate)}' AND '${formatDate(today)}'
    `)

    // Get previous period metrics for trends
    const previousMetrics = await customer.query(`
      SELECT
        metrics.cost_micros,
        metrics.impressions,
        metrics.clicks,
        metrics.conversions
      FROM customer
      WHERE segments.date BETWEEN '${formatDate(previousStartDate)}' AND '${formatDate(startDate)}'
    `)

    // Get campaigns
    const campaignsData = await customer.query(`
      SELECT
        campaign.id,
        campaign.name,
        campaign.status,
        metrics.cost_micros,
        metrics.clicks,
        metrics.impressions,
        metrics.conversions,
        metrics.conversions_value
      FROM campaign
      WHERE segments.date BETWEEN '${formatDate(startDate)}' AND '${formatDate(today)}'
      ORDER BY metrics.cost_micros DESC
      LIMIT 10
    `)

    // Parse current metrics
    const current = currentMetrics[0] || {}
    const previous = previousMetrics[0] || {}

    const spend = (current.metrics?.cost_micros || 0) / 1000000
    const prevSpend = (previous.metrics?.cost_micros || 1) / 1000000
    const impressions = current.metrics?.impressions || 0
    const prevImpressions = previous.metrics?.impressions || 1
    const clicks = current.metrics?.clicks || 0
    const prevClicks = previous.metrics?.clicks || 1
    const conversions = current.metrics?.conversions || 0
    const prevConversions = previous.metrics?.conversions || 1
    const conversionsValue = current.metrics?.conversions_value || 0

    const calcTrend = (curr: number, prev: number) =>
      prev > 0 ? Math.round(((curr - prev) / prev) * 100 * 10) / 10 : 0

    // Parse campaigns
    const campaigns = campaignsData.map((row: any) => {
      const campaignSpend = (row.metrics?.cost_micros || 0) / 1000000
      const campaignConversionsValue = row.metrics?.conversions_value || 0
      return {
        id: row.campaign?.id || '',
        name: row.campaign?.name || 'Unknown',
        status: mapCampaignStatus(row.campaign?.status),
        spend: Math.round(campaignSpend * 100) / 100,
        clicks: row.metrics?.clicks || 0,
        impressions: row.metrics?.impressions || 0,
        conversions: Math.round(row.metrics?.conversions || 0),
        roas: campaignSpend > 0 ? Math.round((campaignConversionsValue / campaignSpend) * 10) / 10 : 0,
      }
    })

    return {
      overview: {
        spend: Math.round(spend * 100) / 100,
        spendTrend: calcTrend(spend, prevSpend),
        impressions,
        impressionsTrend: calcTrend(impressions, prevImpressions),
        clicks,
        clicksTrend: calcTrend(clicks, prevClicks),
        ctr: impressions > 0 ? Math.round((clicks / impressions) * 100 * 100) / 100 : 0,
        conversions: Math.round(conversions),
        conversionsTrend: calcTrend(conversions, prevConversions),
        costPerConversion: conversions > 0 ? Math.round((spend / conversions) * 100) / 100 : 0,
        roas: spend > 0 ? Math.round((conversionsValue / spend) * 10) / 10 : 0,
      },
      campaigns,
    }
  } catch (error) {
    console.error('Error fetching Google Ads data:', error)
    return getMockAdsData()
  }
}

function mapCampaignStatus(status: string): 'active' | 'paused' | 'ended' {
  switch (status) {
    case 'ENABLED': return 'active'
    case 'PAUSED': return 'paused'
    default: return 'ended'
  }
}

function getMockAdsData(): AdsData {
  return {
    overview: {
      spend: 4567.89,
      spendTrend: 5.2,
      impressions: 234567,
      impressionsTrend: 12.3,
      clicks: 5678,
      clicksTrend: 8.9,
      ctr: 2.42,
      conversions: 123,
      conversionsTrend: 15.6,
      costPerConversion: 37.14,
      roas: 4.2,
    },
    campaigns: [
      { id: '1', name: 'Filtry CAT - Search', status: 'active', spend: 1234.56, clicks: 2345, impressions: 45000, conversions: 45, roas: 5.2 },
      { id: '2', name: 'Części Komatsu - Display', status: 'active', spend: 890.12, clicks: 1234, impressions: 67000, conversions: 23, roas: 3.8 },
      { id: '3', name: 'Remarketing - Koszyk', status: 'active', spend: 567.89, clicks: 890, impressions: 23000, conversions: 34, roas: 6.1 },
      { id: '4', name: 'Brand - OMEX', status: 'paused', spend: 234.56, clicks: 567, impressions: 12000, conversions: 12, roas: 4.5 },
      { id: '5', name: 'Promocje świąteczne', status: 'ended', spend: 1640.76, clicks: 642, impressions: 34000, conversions: 9, roas: 2.1 },
    ]
  }
}

// Campaign management functions
export async function pauseCampaign(campaignId: string): Promise<boolean> {
  if (!GOOGLE_ADS_DEVELOPER_TOKEN) {
    console.log('Mock: Pausing campaign', campaignId)
    return true
  }
  // Real implementation would use Google Ads API to pause campaign
  return true
}

export async function enableCampaign(campaignId: string): Promise<boolean> {
  if (!GOOGLE_ADS_DEVELOPER_TOKEN) {
    console.log('Mock: Enabling campaign', campaignId)
    return true
  }
  // Real implementation would use Google Ads API to enable campaign
  return true
}

export async function updateCampaignBudget(campaignId: string, newBudget: number): Promise<boolean> {
  if (!GOOGLE_ADS_DEVELOPER_TOKEN) {
    console.log('Mock: Updating budget for campaign', campaignId, 'to', newBudget)
    return true
  }
  // Real implementation would use Google Ads API to update budget
  return true
}
