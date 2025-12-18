import type { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import PaymentService from '../../../../../services/payment-service';

/**
 * POST /store/checkout/payment/intent
 * Create a Stripe PaymentIntent for checkout
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { cart_id, email, amount, currency, metadata } = req.body;

    // Validate required fields
    if (!cart_id || !amount || !currency) {
      return res.status(400).json({
        error: 'Missing required fields: cart_id, amount, currency',
      });
    }

    const paymentService: PaymentService = req.scope.resolve('paymentService');

    const result = await paymentService.createPaymentIntent({
      amount,
      currency,
      customer_email: email,
      metadata: {
        cart_id,
        ...metadata,
      },
    });

    return res.status(200).json({
      clientSecret: result.clientSecret,
      paymentIntentId: result.paymentIntentId,
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to create payment intent',
    });
  }
}
