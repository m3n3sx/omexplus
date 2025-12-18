import { TransactionBaseService } from '@medusajs/medusa';
import Stripe from 'stripe';
import { Logger } from '@medusajs/medusa';

interface PaymentMetadata {
  cart_id?: string;
  customer_id?: string;
  order_id?: string;
  [key: string]: any;
}

interface CreatePaymentIntentParams {
  amount: number;
  currency: string;
  metadata?: PaymentMetadata;
  customer_email?: string;
}

class PaymentService extends TransactionBaseService {
  protected stripe_: Stripe;
  protected logger_: Logger;

  constructor(container: any) {
    super(container);
    this.stripe_ = container.stripe;
    this.logger_ = container.logger;
  }

  /**
   * Create a Stripe PaymentIntent
   */
  async createPaymentIntent(params: CreatePaymentIntentParams): Promise<{
    clientSecret: string;
    paymentIntentId: string;
  }> {
    try {
      const { amount, currency, metadata, customer_email } = params;

      // Validate amount
      if (amount <= 0) {
        throw new Error('Payment amount must be greater than 0');
      }

      const paymentIntent = await this.stripe_.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        metadata: metadata || {},
        receipt_email: customer_email,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      this.logger_.info(`PaymentIntent created: ${paymentIntent.id}`);

      return {
        clientSecret: paymentIntent.client_secret!,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error) {
      this.logger_.error('Failed to create PaymentIntent:', error);
      throw new Error(`Payment intent creation failed: ${error.message}`);
    }
  }

  /**
   * Confirm a PaymentIntent (charge the card)
   */
  async confirmPaymentIntent(
    paymentIntentId: string,
    paymentMethodId?: string
  ): Promise<{
    status: string;
    chargeId?: string;
  }> {
    try {
      const confirmParams: any = {};
      if (paymentMethodId) {
        confirmParams.payment_method = paymentMethodId;
      }

      const paymentIntent = await this.stripe_.paymentIntents.confirm(
        paymentIntentId,
        confirmParams
      );

      this.logger_.info(`PaymentIntent confirmed: ${paymentIntent.id}, status: ${paymentIntent.status}`);

      return {
        status: paymentIntent.status,
        chargeId: paymentIntent.latest_charge as string,
      };
    } catch (error) {
      this.logger_.error('Failed to confirm PaymentIntent:', error);
      
      // Handle specific Stripe errors
      if (error.type === 'StripeCardError') {
        throw new Error(`Card declined: ${error.message}`);
      } else if (error.type === 'StripeAuthenticationError') {
        throw new Error('3D Secure authentication required');
      }
      
      throw new Error(`Payment confirmation failed: ${error.message}`);
    }
  }

  /**
   * Capture a payment (for authorized payments)
   */
  async capturePayment(paymentIntentId: string, amount?: number): Promise<{
    status: string;
    capturedAmount: number;
  }> {
    try {
      const captureParams: any = {};
      if (amount) {
        captureParams.amount_to_capture = Math.round(amount * 100);
      }

      const paymentIntent = await this.stripe_.paymentIntents.capture(
        paymentIntentId,
        captureParams
      );

      this.logger_.info(`Payment captured: ${paymentIntent.id}`);

      return {
        status: paymentIntent.status,
        capturedAmount: paymentIntent.amount_received / 100,
      };
    } catch (error) {
      this.logger_.error('Failed to capture payment:', error);
      throw new Error(`Payment capture failed: ${error.message}`);
    }
  }

  /**
   * Refund a payment
   */
  async refundPayment(
    paymentIntentId: string,
    amount?: number,
    reason?: string
  ): Promise<{
    refundId: string;
    status: string;
    amount: number;
  }> {
    try {
      const refundParams: any = {
        payment_intent: paymentIntentId,
      };

      if (amount) {
        refundParams.amount = Math.round(amount * 100);
      }

      if (reason) {
        refundParams.reason = reason;
      }

      const refund = await this.stripe_.refunds.create(refundParams);

      this.logger_.info(`Refund created: ${refund.id}`);

      return {
        refundId: refund.id,
        status: refund.status,
        amount: refund.amount / 100,
      };
    } catch (error) {
      this.logger_.error('Failed to create refund:', error);
      throw new Error(`Refund failed: ${error.message}`);
    }
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(paymentIntentId: string): Promise<{
    status: string;
    amount: number;
    currency: string;
    chargeId?: string;
  }> {
    try {
      const paymentIntent = await this.stripe_.paymentIntents.retrieve(
        paymentIntentId
      );

      return {
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        chargeId: paymentIntent.latest_charge as string,
      };
    } catch (error) {
      this.logger_.error('Failed to retrieve payment status:', error);
      throw new Error(`Failed to get payment status: ${error.message}`);
    }
  }

  /**
   * Cancel a PaymentIntent
   */
  async cancelPaymentIntent(paymentIntentId: string): Promise<void> {
    try {
      await this.stripe_.paymentIntents.cancel(paymentIntentId);
      this.logger_.info(`PaymentIntent cancelled: ${paymentIntentId}`);
    } catch (error) {
      this.logger_.error('Failed to cancel PaymentIntent:', error);
      throw new Error(`Payment cancellation failed: ${error.message}`);
    }
  }
}

export default PaymentService;
