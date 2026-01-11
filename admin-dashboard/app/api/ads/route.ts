import { NextRequest, NextResponse } from 'next/server'
import { getAdsData, pauseCampaign, enableCampaign, updateCampaignBudget } from '@/lib/google-ads'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const dateRange = (searchParams.get('range') || '7d') as '7d' | '30d' | '90d'
    
    const data = await getAdsData(dateRange)
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Ads API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ads data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, campaignId, budget } = body

    let success = false

    switch (action) {
      case 'pause':
        success = await pauseCampaign(campaignId)
        break
      case 'enable':
        success = await enableCampaign(campaignId)
        break
      case 'updateBudget':
        success = await updateCampaignBudget(campaignId, budget)
        break
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    return NextResponse.json({ success })
  } catch (error) {
    console.error('Ads API error:', error)
    return NextResponse.json(
      { error: 'Failed to perform action' },
      { status: 500 }
    )
  }
}
