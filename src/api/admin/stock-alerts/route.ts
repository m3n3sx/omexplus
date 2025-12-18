/**
 * Stock Alerts API
 * 
 * Automatyczne alerty przy niskich stanach
 */

import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"

/**
 * GET /admin/stock-alerts
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const { active, variant_id } = req.query

  try {
    const query = req.scope.resolve("query")

    const filters: any = {}
    if (active !== undefined) filters.active = active === 'true'
    if (variant_id) filters.variant_id = variant_id

    const { data: alerts, metadata } = await query.graph({
      entity: "stock_alert",
      fields: ["*"],
      filters,
      pagination: {
        order: { created_at: "DESC" },
      },
    })

    res.json({
      stock_alerts: alerts,
      count: metadata.count,
    })
  } catch (error) {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      `Failed to fetch stock alerts: ${error.message}`
    )
  }
}

/**
 * POST /admin/stock-alerts
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const {
    variant_id,
    product_id,
    low_stock_threshold,
    critical_stock_threshold,
    active = true,
    alert_frequency = "once",
    actions = [],
    auto_order_enabled = false,
    auto_order_quantity,
    supplier_id,
  } = req.body

  if (!variant_id || !low_stock_threshold) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "variant_id and low_stock_threshold are required"
    )
  }

  try {
    const query = req.scope.resolve("query")

    const alert = await query.graph({
      entity: "stock_alert",
      fields: ["*"],
      data: {
        variant_id,
        product_id,
        low_stock_threshold,
        critical_stock_threshold,
        active,
        alert_frequency,
        actions: JSON.stringify(actions),
        auto_order_enabled,
        auto_order_quantity,
        supplier_id,
        created_by: req.auth?.actor_id || null,
      },
    })

    res.json({
      stock_alert: alert,
    })
  } catch (error) {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      `Failed to create stock alert: ${error.message}`
    )
  }
}
