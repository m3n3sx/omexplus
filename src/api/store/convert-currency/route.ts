import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { amount, from_currency, to_currency } = req.body

  if (!amount || !from_currency || !to_currency) {
    return res.status(400).json({
      error: "Missing required fields: amount, from_currency, to_currency",
    })
  }

  const pricingService = req.scope.resolve("omexPricing")

  try {
    const convertedAmount = pricingService.convertCurrency(
      parseFloat(amount),
      from_currency,
      to_currency
    )

    const formatted = pricingService.formatPrice(convertedAmount, to_currency)

    res.json({
      original_amount: parseFloat(amount),
      from_currency,
      to_currency,
      converted_amount: convertedAmount,
      formatted,
    })
  } catch (error) {
    res.status(500).json({
      error: error.message || "Failed to convert currency",
    })
  }
}
