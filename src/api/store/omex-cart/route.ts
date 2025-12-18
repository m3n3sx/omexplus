import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  // Create new cart
  try {
    const cart = {
      id: `cart_${Date.now()}`,
      items: [],
      subtotal: 0,
      total: 0,
      created_at: new Date(),
    }

    res.json({ cart })
  } catch (error: any) {
    res.status(400).json({
      error: {
        code: 'CART_CREATE_ERROR',
        message: error.message,
      },
    })
  }
}
