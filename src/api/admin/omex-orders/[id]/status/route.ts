import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { OMEX_ORDER_MODULE } from "../../../../../modules/omex-order"

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  const orderService = req.scope.resolve(OMEX_ORDER_MODULE)
  const { id } = req.params
  const { status, note } = req.body

  if (!status) {
    return res.status(400).json({
      error: {
        code: 'STATUS_REQUIRED',
        message: 'Status is required',
      },
    })
  }

  try {
    const admin_id = req.auth_context?.actor_id || 'admin'

    const result = await orderService.updateOrderStatus(
      id,
      status,
      admin_id,
      note
    )

    res.json(result)
  } catch (error: any) {
    res.status(400).json({
      error: {
        code: 'STATUS_UPDATE_ERROR',
        message: error.message,
      },
    })
  }
}
