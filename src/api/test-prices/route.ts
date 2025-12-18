import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    // Use query.graph which handles links between modules
    const query = req.scope.resolve("query")
    
    const { data: products } = await query.graph({
      entity: "product",
      fields: [
        "id",
        "title",
        "variants.id",
        "variants.title",
        "variants.sku",
        "variants.prices.amount",
        "variants.prices.currency_code",
      ],
      pagination: {
        take: 5
      }
    })
    
    res.json({
      count: products.length,
      products: products.map((p: any) => ({
        id: p.id,
        title: p.title,
        variant_count: p.variants?.length || 0,
        first_variant: p.variants?.[0] ? {
          id: p.variants[0].id,
          title: p.variants[0].title,
          sku: p.variants[0].sku,
          has_prices: !!p.variants[0].prices,
          price_count: p.variants[0].prices?.length || 0,
          prices: p.variants[0].prices
        } : null
      }))
    })
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
      stack: error.stack
    })
  }
}
