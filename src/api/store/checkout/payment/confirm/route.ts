import type { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import PaymentService from '../../../../../services/payment-service';

/**
 * POST /store/checkout/payment/confirm
 * Confirm a Stripe PaymentIntent (charge the card)
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { paymentIntentId, paymentMethodId, cart_id } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        error: 'Missing required field: paymentIntentId',
      });
    }

    const paymentService: PaymentService = req.scope.resolve('paymentService');

    const result = await paymentService.confirmPaymentIntent(
      paymentIntentId,
      paymentMethodId
    );

    // If payment succeeded, create order
    if (result.status === 'succeeded') {
      // TODO: Create order from cart
      // const orderService = req.scope.resolve('orderService');
      // const order = await orderService.createFromCart(cart_id);
      
      return res.status(200).json({
        status: result.status,
        chargeId: result.chargeId,
        // orderId: order.id,
        message: 'Payment successful',
      });
    }

    // Payment requires additional action (3D Secure)
    if (result.status === 'requires_action') {
      return res.status(200).json({
        status: result.status,
        message: 'Additional authentication required',
      });
    }

    return res.status(200).json({
      status: result.status,
    });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    return res.status(500).json({
      error: error.message || 'Payment confirmation failed',
    });
  }
}
