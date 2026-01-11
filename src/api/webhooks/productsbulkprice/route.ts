import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"

export async function OPTIONS(req: MedusaRequest, res: MedusaResponse) {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  res.setHeader("Access-Control-Allow-Credentials", "true")
  res.status(204).end()
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const body = req.body as { updates: Array<{ variantId: string; amount: number; currencyCode: string }> }
  const { updates } = body

  console.log("=== PRODUCTS BULK PRICE UPDATE ===")
  console.log("Updates count:", updates?.length)

  if (!updates || updates.length === 0) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "updates jest wymagany"
    )
  }

  try {
    const knex = req.scope.resolve("__pg_connection__")
    
    let updatedCount = 0

    for (const update of updates) {
      const { variantId, amount, currencyCode } = update
      
      // Update price in product_variant_price_set -> price_set -> price
      // This is complex in Medusa v2, so we'll update directly in the price table
      const result = await knex.raw(`
        UPDATE price p
        SET amount = $1, updated_at = NOW()
        FROM price_set_money_amount psma
        JOIN product_variant_price_set pvps ON pvps.price_set_id = psma.price_set_id
        WHERE p.id = psma.price_id
        AND pvps.variant_id = $2
        AND p.currency_code = $3
      `, [amount, variantId, currencyCode])

      if (result.rowCount > 0) {
        updatedCount++
      }
    }

    console.log("Updated:", updatedCount, "prices")

    res.json({
      success: true,
      updated: updatedCount,
      message: "Zaktualizowano " + updatedCount + " cen"
    })
  } catch (error: any) {
    console.error("Error:", error)
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Nie udało się zaktualizować cen: " + error.message
    )
  }
}

export async function GET(_req: MedusaRequest, res: MedusaResponse) {
  res.json({ 
    status: "ok", 
    message: "Products bulk price update endpoint is active"
  })
}
