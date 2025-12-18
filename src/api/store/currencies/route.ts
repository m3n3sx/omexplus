import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const pricingService = req.scope.resolve("omexPricing")

  try {
    const currencies = await pricingService.getSupportedCurrencies()

    res.json({
      currencies,
    })
  } catch (error) {
    res.status(500).json({
      error: error.message || "Failed to fetch currencies",
    })
  }
}
