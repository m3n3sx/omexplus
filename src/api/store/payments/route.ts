/**
 * Payment API Routes
 * 
 * Handles payment creation for TPay and Stripe
 */

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import TPayPaymentProvider, { TPAY_PAYMENT_GROUPS } from "../../../services/payment-tpay";
import Stripe from "stripe";

// Initialize payment providers
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

const getStripeProvider = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    return null;
  }
  
  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

/**
 * GET /store/payments/methods
 * Get available payment methods
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const methods: Array<{
      id: string;
      name: string;
      description: string;
      icon?: string;
      provider: 'tpay' | 'stripe';
      available: boolean;
    }> = [];

    // TPay methods (Poland)
    const tpay = getTPayProvider();
    if (tpay) {
      methods.push(
        {
          id: 'tpay_blik',
          name: 'BLIK',
          description: 'Szybka płatność kodem BLIK',
          icon: '/images/payments/blik.svg',
          provider: 'tpay',
          available: true,
        },
        {
          id: 'tpay_transfer',
          name: 'Przelew bankowy',
          description: 'Przelew online z Twojego banku',
          icon: '/images/payments/bank.svg',
          provider: 'tpay',
          available: true,
        },
        {
          id: 'tpay_card',
          name: 'Karta płatnicza',
          description: 'Visa, Mastercard, Maestro',
          icon: '/images/payments/card.svg',
          provider: 'tpay',
          available: true,
        },
        {
          id: 'tpay_google_pay',
          name: 'Google Pay',
          description: 'Płatność przez Google Pay',
          icon: '/images/payments/gpay.svg',
          provider: 'tpay',
          available: true,
        },
        {
          id: 'tpay_apple_pay',
          name: 'Apple Pay',
          description: 'Płatność przez Apple Pay',
          icon: '/images/payments/applepay.svg',
          provider: 'tpay',
          available: true,
        },
        {
          id: 'tpay_installments',
          name: 'Raty',
          description: 'Kup teraz, zapłać później',
          icon: '/images/payments/installments.svg',
          provider: 'tpay',
          available: true,
        }
      );
    }

    // Stripe methods (international)
    const stripe = getStripeProvider();
    if (stripe) {
      methods.push({
        id: 'stripe_card',
        name: 'Credit/Debit Card',
        description: 'International card payment',
        icon: '/images/payments/stripe.svg',
        provider: 'stripe',
        available: true,
      });
    }

    res.json({ methods });
  } catch (error: any) {
    console.error('Failed to get payment methods:', error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * POST /store/payments
 * Create a new payment
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const {
      cart_id,
      order_id,
      amount,
      currency,
      method,
      customer_email,
      customer_name,
      customer_phone,
      customer_address,
      customer_city,
      customer_postal_code,
      return_url,
      blik_code,
    } = req.body as any;

    if (!amount || !currency || !method) {
      return res.status(400).json({ error: 'Missing required fields: amount, currency, method' });
    }

    const baseUrl = process.env.NEXT_PUBLIC_STORE_URL || 'https://ooxo.pl';
    const backendUrl = process.env.MEDUSA_BACKEND_URL || 'https://api.ooxo.pl';

    // TPay payments
    if (method.startsWith('tpay_')) {
      const tpay = getTPayProvider();
      if (!tpay) {
        return res.status(400).json({ error: 'TPay not configured' });
      }

      const reference = order_id || cart_id || `order_${Date.now()}`;
      
      // Map method to TPay group
      let groupId: number | undefined;
      switch (method) {
        case 'tpay_blik':
          groupId = TPAY_PAYMENT_GROUPS.BLIK;
          break;
        case 'tpay_card':
          groupId = TPAY_PAYMENT_GROUPS.CARD;
          break;
        case 'tpay_google_pay':
          groupId = TPAY_PAYMENT_GROUPS.GOOGLE_PAY;
          break;
        case 'tpay_apple_pay':
          groupId = TPAY_PAYMENT_GROUPS.APPLE_PAY;
          break;
        case 'tpay_installments':
          groupId = TPAY_PAYMENT_GROUPS.INSTALLMENTS;
          break;
      }

      const transactionParams = {
        amount,
        description: `Zamówienie ${reference} - OOXO`,
        hiddenDescription: reference,
        payer: {
          email: customer_email || 'customer@example.com',
          name: customer_name || 'Klient',
          phone: customer_phone,
          address: customer_address,
          city: customer_city,
          code: customer_postal_code,
          country: 'PL',
        },
        callbacks: {
          payerUrls: {
            success: return_url || `${baseUrl}/pl/order-success?order=${reference}`,
            error: `${baseUrl}/pl/checkout/error?order=${reference}`,
          },
          notification: {
            url: `${backendUrl}/webhooks/tpay`,
          },
        },
        pay: groupId ? { groupId } : undefined,
      };

      // Direct BLIK payment with code
      if (method === 'tpay_blik' && blik_code) {
        const result = await tpay.createBlikTransaction(transactionParams, blik_code);

        if (result.result === 'success') {
          return res.json({
            success: true,
            transaction_id: result.transactionId,
            status: result.status,
            provider: 'tpay',
            method: 'blik_direct',
          });
        } else {
          return res.status(400).json({ 
            error: result.error?.errorMessage || 'BLIK payment failed' 
          });
        }
      }

      // Standard TPay redirect payment
      const result = await tpay.createTransaction(transactionParams);

      if (result.result === 'success') {
        return res.json({
          success: true,
          redirect_url: result.transactionPaymentUrl,
          transaction_id: result.transactionId,
          provider: 'tpay',
        });
      } else {
        return res.status(400).json({ 
          error: result.error?.errorMessage || 'Payment creation failed' 
        });
      }
    }

    // Stripe payments
    if (method.startsWith('stripe_')) {
      const stripe = getStripeProvider();
      if (!stripe) {
        return res.status(400).json({ error: 'Stripe not configured' });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: currency.toLowerCase(),
        metadata: {
          cart_id: cart_id || '',
          order_id: order_id || '',
        },
        receipt_email: customer_email,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return res.json({
        success: true,
        client_secret: paymentIntent.client_secret,
        payment_intent_id: paymentIntent.id,
        provider: 'stripe',
      });
    }

    return res.status(400).json({ error: 'Unknown payment method' });
  } catch (error: any) {
    console.error('Payment creation failed:', error);
    res.status(500).json({ error: error.message });
  }
}
