/**
 * Stock Movements API
 * 
 * Audit log i historia zmian stanów magazynowych
 */

import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"

/**
 * GET /admin/stock-movements
 * 
 * Query params:
 * - variantId: filter by variant
 * - productId: filter by product
 * - reason: filter by reason
 * - from: date from
 * - to: date to
 * - limit: pagination limit
 * - offset: pagination offset
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const {
    variantId,
    productId,
    reason,
    from,
    to,
    limit = 50,
    offset = 0,
  } = req.query

  try {
    const query = req.scope.resolve("query")

    const filters: any = {}
    if (variantId) filters.variant_id = variantId
    if (productId) filters.product_id = productId
    if (reason) filters.reason = reason
    if (from) filters.created_at = { $gte: new Date(from as string) }
    if (to) filters.created_at = { ...filters.created_at, $lte: new Date(to as string) }

    const { data: movements, metadata } = await query.graph({
      entity: "stock_movement",
      fields: [
        "id",
        "variant_id",
        "product_id",
        "quantity_change",
        "quantity_before",
        "quantity_after",
        "reason",
        "notes",
        "performed_by",
        "performed_by_email",
        "location_id",
        "reference_id",
        "reference_type",
        "created_at",
      ],
      filters,
      pagination: {
        skip: parseInt(offset as string),
        take: parseInt(limit as string),
        order: { created_at: "DESC" },
      },
    })

    res.json({
      stock_movements: movements,
      count: metadata.count,
      offset: parseInt(offset as string),
      limit: parseInt(limit as string),
    })
  } catch (error) {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      `Failed to fetch stock movements: ${error.message}`
    )
  }
}

/**
 * POST /admin/stock-movements
 * 
 * Create manual stock movement (adjustment)
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const {
    variantId,
    quantityChange,
    reason,
    notes,
    locationId,
  } = req.body

  if (!variantId || quantityChange === undefined) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "variantId and quantityChange are required"
    )
  }

  if (!reason) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "reason is required"
    )
  }

  try {
    const productModuleService = req.scope.resolve("productModuleService")
    const inventoryModuleService = req.scope.resolve("inventoryModuleService")
    const query = req.scope.resolve("query")

    // Get current stock
    const variant = await productModuleService.retrieveProductVariant(variantId)
    const currentStock = variant.inventory_quantity || 0
    const newStock = currentStock + quantityChange

    // Update inventory
    await inventoryModuleService.updateInventoryLevels({
      inventory_item_id: variantId,
      location_id: locationId || 'default',
      stocked_quantity: newStock,
    })

    // Create movement record
    const movement = await query.graph({
      entity: "stock_movement",
      fields: ["*"],
      data: {
        variant_id: variantId,
        product_id: variant.product_id,
        quantity_change: quantityChange,
        quantity_before: currentStock,
        quantity_after: newStock,
        reason,
        notes: notes || null,
        performed_by: req.auth?.actor_id || null,
        performed_by_email: req.auth?.app_metadata?.email || null,
        location_id: locationId || null,
        reference_type: 'manual_adjustment',
      },
    })

    // Trigger revalidation
    if (typeof fetch !== 'undefined') {
      const storefrontUrl = process.env.NEXT_PUBLIC_STOREFRONT_URL || 'http://localhost:3000'
      const revalidateSecret = process.env.REVALIDATE_SECRET
      
      fetch(`${storefrontUrl}/api/revalidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tags: ['products', 'inventory', `product-${variant.product_id}`],
          secret: revalidateSecret,
        }),
      }).catch(() => {})
    }

    res.json({
      success: true,
      stock_movement: movement,
      new_stock: newStock,
    })
  } catch (error) {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      `Failed to create stock movement: ${error.message}`
    )
  }
}
