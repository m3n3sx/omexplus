import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { OMEX_ORDER_MODULE } from "../../../modules/omex-order"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const orderService = req.scope.resolve(OMEX_ORDER_MODULE)

  const customer_id = req.auth_context?.actor_id

  if (!customer_id) {
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      },
    })
  }

  const { status, limit = 20, offset = 0 } = req.query

  try {
    const filters = {
      customer_id,
      status: status as any,
    }

    const pagination = {
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    }

    const result = await orderService.listOrders(filters, pagination)

    res.json(result)
  } catch (error: any) {
    res.status(400).json({
      error: {
        code: 'ORDER_LIST_ERROR',
        message: error.message,
      },
    })
  }
}
