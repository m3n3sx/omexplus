import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { OMEX_PRODUCT_MODULE } from "../../../../../modules/omex-product"
import { OMEX_PRICING_MODULE } from "../../../../../modules/omex-pricing"
import { OMEX_INVENTORY_MODULE } from "../../../../../modules/omex-inventory"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const productService = req.scope.resolve(OMEX_PRODUCT_MODULE)
  const pricingService = req.scope.resolve(OMEX_PRICING_MODULE)
  const inventoryService = req.scope.resolve(OMEX_INVENTORY_MODULE)

  const { id } = req.params
  const { product_id, quantity } = req.body

  if (!product_id || !quantity) {
    return res.status(400).json({
      error: {
        code: 'MISSING_FIELDS',
        message: 'Product ID and quantity are required',
      },
    })
  }

  try {
    // Get product
    const product = await productService.retrieveProduct(product_id)

    if (!product) {
      return res.status(404).json({
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: `Product ${product_id} not found`,
        },
      })
    }

    // Check minimum order quantity
    if (product.min_order_qty && quantity < product.min_order_qty) {
      return res.status(400).json({
        error: {
          code: 'MIN_ORDER_QTY_NOT_MET',
          message: `Minimum order quantity is ${product.min_order_qty}`,
        },
      })
    }

    // Check stock availability
    const stock = await inventoryService.getTotalStock(product_id)
    if (stock < quantity) {
      return res.status(400).json({
        error: {
          code: 'INSUFFICIENT_STOCK',
          message: `Only ${stock} units available`,
        },
      })
    }

    // Get price (customer type from session)
    const customerType = 'retail' // Default
    const price = await pricingService.getPrice(product_id, customerType, quantity)

    // Add item to cart
    const lineItem = {
      id: `item_${Date.now()}`,
      cart_id: id,
      product_id,
      quantity,
      unit_price: price.amount,
      total: price.amount * quantity,
      created_at: new Date(),
    }

    res.json({ line_item: lineItem })
  } catch (error: any) {
    res.status(400).json({
      error: {
        code: 'ADD_TO_CART_ERROR',
        message: error.message,
      },
    })
  }
}
