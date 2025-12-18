/**
 * Admin Dashboard Revalidation Proxy
 * 
 * Przekazuje żądania revalidacji do storefront
 */

import { NextRequest, NextResponse } from 'next/server'

const STOREFRONT_URL = process.env.NEXT_PUBLIC_STOREFRONT_URL || 'http://localhost:3000'
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tags } = body

    if (!Array.isArray(tags)) {
      return NextResponse.json(
        { error: 'Tags array required' },
        { status: 400 }
      )
    }

    // Forward to storefront revalidation endpoint
    const response = await fetch(`${STOREFRONT_URL}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tags,
        secret: REVALIDATE_SECRET,
      }),
    }).catch(() => null)

    if (response?.ok) {
      const data = await response.json()
      return NextResponse.json({
        success: true,
        storefront: data,
      })
    }

    // Even if storefront revalidation fails, return success
    // (admin changes are still saved)
    return NextResponse.json({
      success: true,
      storefront: null,
      message: 'Changes saved, storefront revalidation pending',
    })
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
