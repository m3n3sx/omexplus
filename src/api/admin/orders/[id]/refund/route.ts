import type { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import PaymentService from '../../../../../services/payment-service';

/**
 * POST /admin/orders/:id/refund
 * Issue a refund for an order
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { id } = req.params;
    const { amount, reason, paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        error: 'Missing required field: paymentIntentId',
      });
    }

    const paymentService: PaymentService = req.scope.resolve('paymentService');

    const result = await paymentService.refundPayment(
      paymentIntentId,
      amount,
      reason
    );

    // TODO: Update order payment status
    // const orderService = req.scope.resolve('orderService');
    // await orderService.update(id, { payment_status: 'refunded' });

    return res.status(200).json({
      refundId: result.refundId,
      status: result.status,
      amount: result.amount,
      message: 'Refund processed successfully',
    });
  } catch (error) {
    console.error('Refund error:', error);
    return res.status(500).json({
      error: error.message || 'Refund failed',
    });
  }
}
