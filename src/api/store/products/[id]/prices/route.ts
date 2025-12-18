import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { id } = req.params
  const { customer_type = 'retail', quantity = 1 } = req.query

  const pricingService = req.scope.resolve("omexPricing")

  try {
    const prices = await pricingService.getPriceInAllCurrencies(
      id,
      customer_type as 'retail' | 'b2b' | 'wholesale',
      parseInt(quantity as string)
    )

    res.json({
      product_id: id,
      customer_type,
      quantity: parseInt(quantity as string),
      prices,
    })
  } catch (error) {
    res.status(500).json({
      error: error.message || "Failed to fetch prices",
    })
  }
}
