import { NextRequest, NextResponse } from 'next/server'
import {
  generateProductSEO,
  generateCategorySEO,
  generatePageSEO,
  improveDescription,
  generateAltTexts,
  suggestRelatedKeywords,
  generateFAQ,
} from '@/lib/ai-seo-generator'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data, options } = body

    let result: any

    switch (action) {
      case 'generateProductSEO':
        result = await generateProductSEO(data, options)
        break

      case 'generateCategorySEO':
        result = await generateCategorySEO(data, options)
        break

      case 'generatePageSEO':
        result = await generatePageSEO(data, options)
        break

      case 'improveDescription':
        result = await improveDescription(
          data.description,
          data.title,
          data.length || 'medium'
        )
        break

      case 'generateAltTexts':
        result = await generateAltTexts(data.title, data.count || 1)
        break

      case 'suggestKeywords':
        result = await suggestRelatedKeywords(data.keyword, data.count || 10)
        break

      case 'generateFAQ':
        result = await generateFAQ(data.topic, data.count || 5)
        break

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error('AI SEO API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
