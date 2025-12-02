import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || searchParams.get('query')
    
    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [], message: 'Query too short' })
    }
    
    const limit = searchParams.get('limit') || '10'
    
    const response = await fetch(
      `${BACKEND_URL}/store/omex-search/suggestions?q=${encodeURIComponent(query)}&limit=${limit}`
    )
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch suggestions' }, { status: 500 })
  }
}
