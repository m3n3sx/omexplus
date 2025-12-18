/**
 * Price Rules API
 * 
 * Automatyczne reguły cenowe - oszczędza godziny pracy
 */

import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"

/**
 * GET /admin/price-rules
 * 
 * List all price rules
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const manager = req.scope.resolve("manager")
    
    const rules = await manager.query(
      `SELECT * FROM custom_price_rule ORDER BY priority DESC, created_at DESC`
    )

    res.json({
      price_rules: rules,
      count: rules.length,
    })
  } catch (error: any) {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      `Failed to fetch price rules: ${error.message}`
    )
  }
}

/**
 * POST /admin/price-rules
 * 
 * Create new price rule
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const {
    name,
    description,
    type,
    active = true,
    priority = 0,
    collection_ids,
    category_ids,
    product_ids,
    min_cost_price,
    max_cost_price,
    margin_percentage,
    margin_fixed,
    discount_percentage,
    fixed_price,
    round_to,
    round_type,
  } = req.body

  if (!name || !type) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "name and type are required"
    )
  }

  try {
    const manager = req.scope.resolve("manager")
    const id = `cpr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    await manager.query(
      `INSERT INTO custom_price_rule (
        id, name, description, type, active, priority,
        collection_ids, category_ids, product_ids,
        min_cost_price, max_cost_price,
        margin_percentage, margin_fixed,
        discount_percentage, fixed_price,
        round_to, round_type, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
      [
        id, name, description, type, active, priority,
        collection_ids ? JSON.stringify(collection_ids) : null,
        category_ids ? JSON.stringify(category_ids) : null,
        product_ids ? JSON.stringify(product_ids) : null,
        min_cost_price, max_cost_price,
        margin_percentage, margin_fixed,
        discount_percentage, fixed_price,
        round_to, round_type, null
      ]
    )

    const [rule] = await manager.query(
      `SELECT * FROM custom_price_rule WHERE id = $1`,
      [id]
    )

    res.json({
      price_rule: rule,
    })
  } catch (error: any) {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      `Failed to create price rule: ${error.message}`
    )
  }
}
