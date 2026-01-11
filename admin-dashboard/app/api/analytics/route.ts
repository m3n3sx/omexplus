import { NextRequest, NextResponse } from 'next/server'
import { getAnalyticsData } from '@/lib/google-analytics'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const dateRange = (searchParams.get('range') || '7d') as '7d' | '30d' | '90d'
    
    const data = await getAnalyticsData(dateRange)
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}
