/**
 * Price Rule Detail API
 */

import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"

/**
 * GET /admin/price-rules/:id
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const { id } = req.params

  try {
    const manager = req.scope.resolve("manager")

    const [rule] = await manager.query(
      `SELECT * FROM custom_price_rule WHERE id = $1`,
      [id]
    )

    if (!rule) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Price rule with id ${id} not found`
      )
    }

    res.json({
      price_rule: rule,
    })
  } catch (error: any) {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      `Failed to fetch price rule: ${error.message}`
    )
  }
}

/**
 * POST /admin/price-rules/:id
 * 
 * Update price rule
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const { id } = req.params
  const updates = req.body

  try {
    const manager = req.scope.resolve("manager")

    // Build SET clause dynamically
    const fields: string[] = []
    const values: any[] = []
    let paramIndex = 1

    Object.entries(updates).forEach(([key, value]) => {
      if (key === 'collection_ids' || key === 'category_ids' || key === 'product_ids') {
        fields.push(`${key} = $${paramIndex}`)
        values.push(value ? JSON.stringify(value) : null)
      } else {
        fields.push(`${key} = $${paramIndex}`)
        values.push(value)
      }
      paramIndex++
    })

    fields.push(`updated_at = NOW()`)
    values.push(id)

    await manager.query(
      `UPDATE custom_price_rule SET ${fields.join(', ')} WHERE id = $${paramIndex}`,
      values
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
      `Failed to update price rule: ${error.message}`
    )
  }
}

/**
 * DELETE /admin/price-rules/:id
 */
export async function DELETE(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const { id } = req.params

  try {
    const manager = req.scope.resolve("manager")

    await manager.query(
      `DELETE FROM custom_price_rule WHERE id = $1`,
      [id]
    )

    res.json({
      success: true,
      id,
    })
  } catch (error: any) {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      `Failed to delete price rule: ${error.message}`
    )
  }
}
