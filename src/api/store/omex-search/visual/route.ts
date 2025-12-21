/**
 * METHOD 3: Visual Search (Image Upload) with Gemini Vision
 * POST /store/omex-search/visual
 * 
 * Uses Gemini 2.0 Flash Vision to:
 * 1. Identify part type from image
 * 2. Perform OCR to read part numbers
 * 3. Suggest search terms
 * 4. Find similar products in database
 */

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { GeminiService } from "../../../../services/gemini.service"

interface VisualSearchRequest {
  image?: string // Base64 encoded image
  imageUrl?: string
  mimeType?: string
  detectOCR?: boolean
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const { image, imageUrl, mimeType = 'image/jpeg', detectOCR = true } = req.body as VisualSearchRequest

    if (!image && !imageUrl) {
      return res.status(400).json({
        error: "Image data or URL is required",
        fields: {
          image: "Base64 encoded image data (without data:image/... prefix)",
          imageUrl: "URL to image",
          mimeType: "Image MIME type (default: image/jpeg)",
          detectOCR: "Try to read part numbers (default: true)",
        },
      })
    }

    let imageBase64 = image

    // Fetch image from URL if provided
    if (imageUrl && !image) {
      try {
        const response = await fetch(imageUrl)
        const arrayBuffer = await response.arrayBuffer()
        imageBase64 = Buffer.from(arrayBuffer).toString('base64')
      } catch (fetchError) {
        return res.status(400).json({
          error: "Failed to fetch image from URL",
          message: fetchError instanceof Error ? fetchError.message : 'Unknown error'
        })
      }
    }

    if (!imageBase64) {
      return res.status(400).json({
        error: "No image data available"
      })
    }

    // Clean base64 if it has data URL prefix
    if (imageBase64.includes(',')) {
      imageBase64 = imageBase64.split(',')[1]
    }

    // Analyze image with Gemini Vision
    const gemini = new GeminiService()
    const analysis = await gemini.analyzePartImage(imageBase64, mimeType)

    // Search for products based on analysis
    const knex = req.scope.resolve("__pg_connection__")
    let products: any[] = []

    // Build search query from analysis
    const searchTerms: string[] = []
    
    if (analysis.partNumbers && analysis.partNumbers.length > 0) {
      // Priority: search by part numbers first
      searchTerms.push(...analysis.partNumbers)
    }
    
    if (analysis.suggestedSearchTerms && analysis.suggestedSearchTerms.length > 0) {
      searchTerms.push(...analysis.suggestedSearchTerms)
    }
    
    if (analysis.detectedPartType) {
      searchTerms.push(analysis.detectedPartType)
    }

    if (searchTerms.length > 0) {
      // Search products by detected terms
      const searchPattern = searchTerms.map(t => `%${t.toLowerCase()}%`)
      
      const sql = `
        SELECT DISTINCT
          p.id,
          p.title,
          p.description,
          p.handle,
          p.thumbnail,
          p.metadata,
          (
            SELECT json_agg(json_build_object(
              'id', pv.id,
              'title', pv.title,
              'sku', pv.sku,
              'prices', (
                SELECT json_agg(json_build_object(
                  'amount', pp.amount,
                  'currency_code', pp.currency_code
                ))
                FROM product_variant_price_set pvps
                JOIN price pp ON pvps.price_set_id = pp.price_set_id
                WHERE pvps.variant_id = pv.id
              )
            ))
            FROM product_variant pv
            WHERE pv.product_id = p.id
          ) as variants
        FROM product p
        LEFT JOIN product_variant pv ON p.id = pv.product_id
        WHERE p.deleted_at IS NULL
          AND (
            ${searchPattern.map((_, i) => `
              LOWER(p.title) LIKE $${i + 1}
              OR LOWER(p.description) LIKE $${i + 1}
              OR LOWER(pv.sku) LIKE $${i + 1}
              OR LOWER(p.metadata->>'part_number') LIKE $${i + 1}
            `).join(' OR ')}
          )
        GROUP BY p.id
        ORDER BY p.created_at DESC
        LIMIT 20
      `

      try {
        const result = await knex.raw(sql, searchPattern)
        products = result.rows || []
      } catch (dbError) {
        console.error('Database search error:', dbError)
      }
    }

    // Return comprehensive result
    res.json({
      success: true,
      analysis: {
        detectedPartType: analysis.detectedPartType,
        partCategory: analysis.partCategory,
        possibleBrands: analysis.possibleBrands || [],
        description: analysis.description,
        confidence: analysis.confidence,
      },
      ocr: {
        enabled: detectOCR,
        texts: analysis.ocrText || [],
        partNumbers: analysis.partNumbers || [],
      },
      search: {
        terms: searchTerms,
        suggestedSearchTerms: analysis.suggestedSearchTerms || [],
      },
      products: products,
      total: products.length,
      hasMore: false,
    })

  } catch (error: any) {
    console.error('Visual search error:', error)
    
    res.status(500).json({
      success: false,
      error: "Visual search failed",
      message: error.message,
      hint: "Make sure GEMINI_API_KEY is configured in .env"
    })
  }
}

// GET endpoint for info
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  res.json({
    endpoint: "/store/omex-search/visual",
    method: "POST",
    description: "Visual search using Gemini Vision AI",
    features: [
      "Part type identification",
      "OCR for part numbers",
      "Brand detection",
      "Search term suggestions",
      "Product matching"
    ],
    request: {
      image: "Base64 encoded image (required if no imageUrl)",
      imageUrl: "URL to image (required if no image)",
      mimeType: "image/jpeg | image/png | image/webp (default: image/jpeg)",
      detectOCR: "boolean (default: true)"
    },
    response: {
      analysis: "AI analysis results",
      ocr: "OCR results with detected part numbers",
      search: "Suggested search terms",
      products: "Matching products from database"
    }
  })
}
