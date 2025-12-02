import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const brand = searchParams.get('brand')
    const type = searchParams.get('type')
    
    if (!brand || !type) {
      return NextResponse.json(
        { error: 'Brand and type are required' },
        { status: 400 }
      )
    }
    
    const response = await fetch(
      `${BACKEND_URL}/store/omex-search/machine/models?brand=${encodeURIComponent(brand)}&type=${encodeURIComponent(type)}`
    )
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch models' }, { status: 500 })
  }
}
