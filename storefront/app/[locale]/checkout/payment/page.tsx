'use client';

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '../../../../components/PaymentForm';
import { useRouter } from 'next/navigation';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPaymentPage() {
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock cart data - replace with actual cart context
  const cartData = {
    id: 'cart_123',
    total: 9999, // $99.99 in cents
    currency: 'usd',
    email: 'customer@example.com',
  };

  useEffect(() => {
    createPaymentIntent();
  }, []);

  const createPaymentIntent = async () => {
    try {
      setLoading(true);
      const response = await fetch('/store/checkout/payment/intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart_id: cartData.id,
          amount: cartData.total,
          currency: cartData.currency,
          email: cartData.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initialize payment');
      }

      setClientSecret(data.clientSecret);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentMethodId: string) => {
    try {
      // Confirm payment on backend
      const response = await fetch('/store/checkout/payment/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentIntentId: clientSecret?.split('_secret_')[0],
          paymentMethodId,
          cart_id: cartData.id,
        }),
      });

      const data = await response.json();

      if (data.status === 'succeeded') {
        router.push('/checkout/success');
      } else {
        setError('Payment failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
  };

  if (loading) {
    return (
      <div className="checkout-container">
        <div className="loading">Loading payment...</div>
      </div>
    );
  }

  if (error && !clientSecret) {
    return (
      <div className="checkout-container">
        <div className="error">{error}</div>
        <button onClick={createPaymentIntent}>Retry</button>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1>Payment</h1>
        <div className="steps">
          <span className="step completed">1. Shipping</span>
          <span className="step completed">2. Billing</span>
          <span className="step active">3. Payment</span>
          <span className="step">4. Review</span>
        </div>
      </div>

      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentForm
            amount={cartData.total}
            currency={cartData.currency}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        </Elements>
      )}

      {error && <div className="error-banner">{error}</div>}

      <style jsx>{`
        .checkout-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }

        .checkout-header {
          margin-bottom: 2rem;
        }

        h1 {
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        .steps {
          display: flex;
          gap: 1rem;
        }

        .step {
          padding: 0.5rem 1rem;
          border-radius: 4px;
          background: #f5f5f5;
        }

        .step.completed {
          background: #d4edda;
          color: #155724;
        }

        .step.active {
          background: #0070f3;
          color: white;
        }

        .loading,
        .error {
          text-align: center;
          padding: 2rem;
        }

        .error-banner {
          margin-top: 1rem;
          padding: 1rem;
          background: #fee;
          border: 1px solid #fcc;
          border-radius: 4px;
          color: #c00;
        }
      `}</style>
    </div>
  );
}
