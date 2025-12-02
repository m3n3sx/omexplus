import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { OMEX_PRICING_MODULE } from "../../../../../../modules/omex-pricing"

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  const pricingService = req.scope.resolve(OMEX_PRICING_MODULE)

  const { id, item_id } = req.params
  const { quantity } = req.body

  if (!quantity || quantity < 1) {
    return res.status(400).json({
      error: {
        code: 'INVALID_QUANTITY',
        message: 'Quantity must be at least 1',
      },
    })
  }

  try {
    // In real implementation:
    // 1. Fetch line item
    // 2. Check min_order_qty
    // 3. Check stock
    // 4. Recalculate price based on new quantity
    // 5. Update line item

    const customerType = 'retail'
    // const price = await pricingService.getPrice(product_id, customerType, quantity)

    res.json({
      line_item: {
        id: item_id,
        quantity,
        updated_at: new Date(),
      },
    })
  } catch (error: any) {
    res.status(400).json({
      error: {
        code: 'UPDATE_ITEM_ERROR',
        message: error.message,
      },
    })
  }
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const { id, item_id } = req.params

  try {
    // Remove item from cart
    res.json({
      deleted: true,
      id: item_id,
    })
  } catch (error: any) {
    res.status(400).json({
      error: {
        code: 'DELETE_ITEM_ERROR',
        message: error.message,
      },
    })
  }
}
