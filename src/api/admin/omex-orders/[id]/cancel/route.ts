import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { OMEX_ORDER_MODULE } from "../../../../../modules/omex-order"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const orderService = req.scope.resolve(OMEX_ORDER_MODULE)
  const { id } = req.params
  const { reason } = req.body

  if (!reason) {
    return res.status(400).json({
      error: {
        code: 'REASON_REQUIRED',
        message: 'Cancellation reason is required',
      },
    })
  }

  try {
    const admin_id = req.auth_context?.actor_id || 'admin'

    const result = await orderService.cancelOrder(id, reason, admin_id)

    res.json(result)
  } catch (error: any) {
    res.status(400).json({
      error: {
        code: 'ORDER_CANCEL_ERROR',
        message: error.message,
      },
    })
  }
}
