import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const brand = searchParams.get('brand')
    
    const url = brand 
      ? `${BACKEND_URL}/store/omex-search/machine/types?brand=${encodeURIComponent(brand)}`
      : `${BACKEND_URL}/store/omex-search/machine/types`
    
    const response = await fetch(url)
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch types' }, { status: 500 })
  }
}
