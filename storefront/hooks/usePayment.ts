import { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

interface PaymentState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

interface CreatePaymentIntentParams {
  cart_id: string;
  amount: number;
  currency: string;
  email?: string;
  metadata?: Record<string, any>;
}

export function usePayment() {
  const stripe = useStripe();
  const elements = useElements();
  const [state, setState] = useState<PaymentState>({
    loading: false,
    error: null,
    success: false,
  });

  const createPaymentIntent = async (params: CreatePaymentIntentParams) => {
    try {
      setState({ loading: true, error: null, success: false });

      const response = await fetch('/store/checkout/payment/intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment intent');
      }

      setState({ loading: false, error: null, success: false });
      return data;
    } catch (error: any) {
      setState({ loading: false, error: error.message, success: false });
      throw error;
    }
  };

  const confirmPayment = async (clientSecret: string, billingDetails?: any) => {
    if (!stripe || !elements) {
      throw new Error('Stripe not initialized');
    }

    try {
      setState({ loading: true, error: null, success: false });

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: billingDetails,
          },
        }
      );

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent?.status === 'succeeded') {
        setState({ loading: false, error: null, success: true });
        return paymentIntent;
      }

      throw new Error('Payment failed');
    } catch (error: any) {
      setState({ loading: false, error: error.message, success: false });
      throw error;
    }
  };

  const handlePayment = async (
    params: CreatePaymentIntentParams,
    billingDetails?: any
  ) => {
    try {
      // Step 1: Create payment intent
      const { clientSecret } = await createPaymentIntent(params);

      // Step 2: Confirm payment
      const paymentIntent = await confirmPayment(clientSecret, billingDetails);

      return paymentIntent;
    } catch (error) {
      throw error;
    }
  };

  return {
    ...state,
    createPaymentIntent,
    confirmPayment,
    handlePayment,
  };
}
