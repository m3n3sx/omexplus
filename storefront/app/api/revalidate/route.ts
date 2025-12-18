/**
 * Revalidation API Route
 * 
 * Endpoint do invalidacji cache po zmianach w admin dashboard
 * Wywoływany automatycznie przez unified-admin-client
 */

import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tags, secret } = body

    // Optional: dodaj secret key dla bezpieczeństwa
    const revalidateSecret = process.env.REVALIDATE_SECRET
    if (revalidateSecret && secret !== revalidateSecret) {
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      )
    }

    // Revalidate specified tags
    if (Array.isArray(tags)) {
      for (const tag of tags) {
        revalidateTag(tag)
      }
      
      return NextResponse.json({
        revalidated: true,
        tags,
        now: Date.now(),
      })
    }

    return NextResponse.json(
      { error: 'Tags array required' },
      { status: 400 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Revalidation failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// GET endpoint do manualnej revalidacji
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tag = searchParams.get('tag')
    const secret = searchParams.get('secret')

    const revalidateSecret = process.env.REVALIDATE_SECRET
    if (revalidateSecret && secret !== revalidateSecret) {
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      )
    }

    if (tag) {
      revalidateTag(tag)
      return NextResponse.json({
        revalidated: true,
        tag,
        now: Date.now(),
      })
    }

    return NextResponse.json(
      { error: 'Tag parameter required' },
      { status: 400 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Revalidation failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
