import type { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import Stripe from 'stripe';

/**
 * POST /webhooks/stripe
 * Handle Stripe webhook events
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const stripe: Stripe = req.scope.resolve('stripe');
  const webhookSecret: string = req.scope.resolve('stripeWebhookSecret');
  const logger = req.scope.resolve('logger');

  const sig = req.headers['stripe-signature'];

  if (!sig) {
    logger.error('Missing Stripe signature header');
    return res.status(400).json({ error: 'Missing signature' });
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      webhookSecret
    );
  } catch (error) {
    logger.error('Webhook signature verification failed:', error);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  logger.info(`Received Stripe webhook: ${event.type}`);

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        logger.info(`Payment succeeded: ${paymentIntent.id}`);
        
        // TODO: Mark order as paid
        // const orderId = paymentIntent.metadata.order_id;
        // if (orderId) {
        //   const orderService = req.scope.resolve('orderService');
        //   await orderService.update(orderId, { payment_status: 'paid' });
        // }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        logger.error(`Payment failed: ${paymentIntent.id}`);
        
        // TODO: Notify customer and mark order as failed
        // const orderId = paymentIntent.metadata.order_id;
        // if (orderId) {
        //   const orderService = req.scope.resolve('orderService');
        //   await orderService.update(orderId, { payment_status: 'failed' });
        // }
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        logger.info(`Charge refunded: ${charge.id}`);
        
        // TODO: Process refund in system
        break;
      }

      case 'charge.dispute.created': {
        const dispute = event.data.object as Stripe.Dispute;
        logger.warn(`Dispute created: ${dispute.id}`);
        
        // TODO: Alert admin about dispute
        break;
      }

      case 'payment_intent.canceled': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        logger.info(`Payment canceled: ${paymentIntent.id}`);
        break;
      }

      default:
        logger.info(`Unhandled event type: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    logger.error('Webhook processing error:', error);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}

// Disable body parsing for webhooks (Stripe needs raw body)
export const config = {
  api: {
    bodyParser: false,
  },
};
