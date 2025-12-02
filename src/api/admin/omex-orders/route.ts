import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { OMEX_ORDER_MODULE } from "../../../modules/omex-order"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const orderService = req.scope.resolve(OMEX_ORDER_MODULE)

  const {
    status,
    payment_status,
    customer_id,
    date_from,
    date_to,
    limit = 20,
    offset = 0,
  } = req.query

  try {
    const filters = {
      status: status as any,
      payment_status: payment_status as any,
      customer_id: customer_id as string,
      date_from: date_from ? new Date(date_from as string) : undefined,
      date_to: date_to ? new Date(date_to as string) : undefined,
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
