import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { OMEX_ORDER_MODULE } from "../../../../../modules/omex-order"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const orderService = req.scope.resolve(OMEX_ORDER_MODULE)
  const { id } = req.params

  try {
    const invoice = await orderService.generateInvoice(id)

    res.json(invoice)
  } catch (error: any) {
    res.status(400).json({
      error: {
        code: 'INVOICE_GENERATE_ERROR',
        message: error.message,
      },
    })
  }
}
