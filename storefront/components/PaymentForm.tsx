'use client';

import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface PaymentFormProps {
  amount: number;
  currency: string;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
      fontFamily: 'system-ui, -apple-system, sans-serif',
    },
    invalid: {
      color: '#9e2146',
    },
  },
  hidePostalCode: false,
};

export default function PaymentForm({
  amount,
  currency,
  onSuccess,
  onError,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardComplete, setCardComplete] = useState(false);

  const handleCardChange = (event: any) => {
    setCardComplete(event.complete);
    if (event.error) {
      setError(event.error.message);
    } else {
      setError(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (!cardComplete) {
      setError('Please complete your card details');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Create payment method
      const { error: methodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (methodError) {
        throw new Error(methodError.message);
      }

      onSuccess(paymentMethod.id);
    } catch (err: any) {
      const errorMessage = err.message || 'Payment failed. Please try again.';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="form-group">
        <label htmlFor="card-element" className="form-label">
          Card Details
        </label>
        <div className="card-element-wrapper">
          <CardElement
            id="card-element"
            options={CARD_ELEMENT_OPTIONS}
            onChange={handleCardChange}
          />
        </div>
      </div>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading || !cardComplete}
        className="submit-button"
      >
        {loading ? (
          <span>Processing...</span>
        ) : (
          <span>
            Pay {currency.toUpperCase()} {(amount / 100).toFixed(2)}
          </span>
        )}
      </button>

      <style jsx>{`
        .payment-form {
          max-width: 500px;
          margin: 0 auto;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #1a1a1a;
        }

        .card-element-wrapper {
          padding: 12px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          background: white;
        }

        .error-message {
          padding: 12px;
          margin-bottom: 1rem;
          background: #fee;
          border: 1px solid #fcc;
          border-radius: 4px;
          color: #c00;
          font-size: 14px;
        }

        .submit-button {
          width: 100%;
          padding: 14px;
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .submit-button:hover:not(:disabled) {
          background: #0051cc;
        }

        .submit-button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
      `}</style>
    </form>
  );
}
