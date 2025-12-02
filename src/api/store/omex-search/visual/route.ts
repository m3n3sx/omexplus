/**
 * METHOD 3: Visual Search (Image Upload)
 * POST /store/omex-search/visual
 */

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const advancedSearchService = req.scope.resolve("advancedSearchService")

  try {
    const { image, imageUrl, detectOCR = true } = req.body

    if (!image && !imageUrl) {
      return res.status(400).json({
        error: "Image data or URL is required",
        fields: {
          image: "Base64 encoded image data",
          imageUrl: "URL to image",
          detectOCR: "Optional: Try to read part numbers (default: true)",
        },
      })
    }

    // Convert base64 to buffer if needed
    let imageBuffer: Buffer
    if (image) {
      imageBuffer = Buffer.from(image, 'base64')
    } else if (imageUrl) {
      // Fetch image from URL
      const response = await fetch(imageUrl)
      const arrayBuffer = await response.arrayBuffer()
      imageBuffer = Buffer.from(arrayBuffer)
    }

    const result = await advancedSearchService.searchByImage({
      image: imageBuffer!,
      detectOCR,
    })

    res.json(result)
  } catch (error) {
    res.status(500).json({
      error: "Visual search failed",
      message: error.message,
    })
  }
}
