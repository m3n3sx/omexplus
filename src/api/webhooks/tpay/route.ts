/**
 * TPay Webhook Handler
 * 
 * Receives payment notifications from TPay OpenAPI
 */

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import TPayPaymentProvider, { TPayNotification } from "../../../services/payment-tpay";

const getTPayProvider = () => {
  if (!process.env.TPAY_CLIENT_ID || !process.env.TPAY_CLIENT_SECRET) {
    return null;
  }
  
  return new TPayPaymentProvider({
    clientId: process.env.TPAY_CLIENT_ID,
    clientSecret: process.env.TPAY_CLIENT_SECRET,
    sandbox: process.env.TPAY_SANDBOX === 'true',
  });
};

/**
 * POST /webhooks/tpay
 * Handle TPay payment notifications
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const tpay = getTPayProvider();
    if (!tpay) {
      console.error('TPay webhook received but TPay not configured');
      return res.status(500).send('TPay not configured');
    }

    // Parse notification from request body
    const body = req.body as Record<string, unknown>;
    
    // TPay OpenAPI sends JSON notifications
    const notification: TPayNotification = {
      tr_id: (body.tr_id || body.transactionId || '') as string,
      tr_date: (body.tr_date || body.date || '') as string,
      tr_crc: (body.tr_crc || body.hiddenDescription || '') as string,
      tr_amount: (body.tr_amount || body.amount || '0') as string,
      tr_paid: (body.tr_paid || body.paidAmount || body.amount || '0') as string,
      tr_desc: (body.tr_desc || body.description || '') as string,
      tr_status: (body.tr_status || body.status || '') as string,
      tr_error: (body.tr_error || body.errorCode || '') as string,
      tr_email: (body.tr_email || (body.payer as any)?.email || '') as string,
      md5sum: (body.md5sum || '') as string,
      test_mode: (body.test_mode || body.testMode || '') as string,
    };

    console.log('TPay notification received:', {
      tr_id: notification.tr_id,
      tr_crc: notification.tr_crc,
      tr_status: notification.tr_status,
      tr_amount: notification.tr_amount,
    });

    // Process notification
    const result = tpay.processNotification(notification);

    if (!result.valid) {
      console.error('TPay notification validation failed');
      return res.status(400).send('Invalid notification');
    }

    // Get order ID from CRC (we store order_id there)
    const orderId = result.orderId;

    if (result.status === 'paid') {
      console.log(`✅ Payment confirmed for order ${orderId}, amount: ${result.amount} PLN`);
      
      // TODO: Update order status in Medusa
      // Example:
      // const orderService = req.scope.resolve('orderService');
      // await orderService.capturePayment(orderId);
      
    } else if (result.status === 'chargeback') {
      console.log(`⚠️ Chargeback received for order ${orderId}`);
      
      // TODO: Handle chargeback
      // await orderService.update(orderId, { status: 'chargeback' });
      
    } else {
      console.log(`❌ Payment failed for order ${orderId}`);
      
      // TODO: Handle failed payment
      // await orderService.update(orderId, { payment_status: 'failed' });
    }

    // TPay expects "TRUE" response to confirm receipt
    res.send('TRUE');
  } catch (error: any) {
    console.error('TPay webhook error:', error);
    res.status(500).send('Error processing notification');
  }
}

/**
 * GET /webhooks/tpay
 * Health check for webhook endpoint
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  res.json({ 
    status: 'ok', 
    message: 'TPay webhook endpoint is active',
    configured: !!(process.env.TPAY_CLIENT_ID && process.env.TPAY_CLIENT_SECRET),
  });
}
