import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { OMEX_ORDER_MODULE } from "../../../../modules/omex-order"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const orderService = req.scope.resolve(OMEX_ORDER_MODULE)

  const { id } = req.params
  const customer_id = req.auth_context?.actor_id

  if (!customer_id) {
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      },
    })
  }

  try {
    const order = await orderService.getOrder(id)

    if (!order) {
      return res.status(404).json({
        error: {
          code: 'ORDER_NOT_FOUND',
          message: `Order ${id} not found`,
        },
      })
    }

    // Verify order belongs to customer
    if (order.customer_id !== customer_id) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have access to this order',
        },
      })
    }

    // Get status history
    const history = await orderService.getStatusHistory(id)

    res.json({
      order: {
        ...order,
        status_history: history,
      },
    })
  } catch (error: any) {
    res.status(400).json({
      error: {
        code: 'ORDER_RETRIEVE_ERROR',
        message: error.message,
      },
    })
  }
}
