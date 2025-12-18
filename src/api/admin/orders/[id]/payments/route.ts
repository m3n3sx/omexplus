import type { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import PaymentService from '../../../../../services/payment-service';

/**
 * POST /admin/orders/:id/payments
 * Manual payment capture (admin only)
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { id } = req.params;
    const { amount, paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        error: 'Missing required field: paymentIntentId',
      });
    }

    const paymentService: PaymentService = req.scope.resolve('paymentService');

    const result = await paymentService.capturePayment(paymentIntentId, amount);

    // TODO: Update order payment status
    // const orderService = req.scope.resolve('orderService');
    // await orderService.update(id, { payment_status: 'paid' });

    return res.status(200).json({
      transactionId: paymentIntentId,
      status: result.status,
      capturedAmount: result.capturedAmount,
      message: 'Payment captured successfully',
    });
  } catch (error) {
    console.error('Payment capture error:', error);
    return res.status(500).json({
      error: error.message || 'Payment capture failed',
    });
  }
}
