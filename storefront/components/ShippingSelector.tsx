"use client";

import { useState, useEffect } from "react";
import { useShipping } from "../hooks/useShipping";

interface ShippingMethod {
  id: string;
  name: string;
  provider: string;
  price: number;
  delivery_days: number;
  currency: string;
}

interface ShippingSelectorProps {
  postalCode: string;
  country: string;
  weight?: number;
  onSelect: (method: ShippingMethod) => void;
  selectedMethodId?: string;
}

const providerLogos: Record<string, string> = {
  inpost: "📦",
  dpd: "🚚",
  dhl: "✈️",
};

export function ShippingSelector({
  postalCode,
  country,
  weight = 1000,
  onSelect,
  selectedMethodId,
}: ShippingSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<string | undefined>(selectedMethodId);
  const { rates, loading, error, fetchRates } = useShipping();

  useEffect(() => {
    if (postalCode && country) {
      fetchRates({ postal_code: postalCode, country, weight });
    }
  }, [postalCode, country, weight]);

  const handleSelect = (method: ShippingMethod) => {
    setSelectedMethod(method.id);
    onSelect(method);
  };

  if (loading) {
    return (
      <div className="shipping-selector loading">
        <div className="spinner"></div>
        <p>Calculating shipping rates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="shipping-selector error">
        <p className="error-message">⚠️ {error}</p>
        <button onClick={() => fetchRates({ postal_code: postalCode, country, weight })}>
          Retry
        </button>
      </div>
    );
  }

  if (!rates || rates.length === 0) {
    return (
      <div className="shipping-selector empty">
        <p>No shipping methods available for this address.</p>
      </div>
    );
  }

  return (
    <div className="shipping-selector">
      <h3>Select Shipping Method</h3>
      <div className="shipping-methods">
        {rates.map((method) => (
          <label
            key={method.id}
            className={`shipping-method ${selectedMethod === method.id ? "selected" : ""}`}
          >
            <input
              type="radio"
              name="shipping_method"
              value={method.id}
              checked={selectedMethod === method.id}
              onChange={() => handleSelect(method)}
            />
            <div className="method-info">
              <div className="method-header">
                <span className="provider-icon">{providerLogos[method.provider]}</span>
                <span className="method-name">{method.name}</span>
              </div>
              <div className="method-details">
                <span className="price">
                  ${method.price.toFixed(2)} {method.currency}
                </span>
                <span className="delivery">
                  {method.delivery_days === 1
                    ? "Next day"
                    : `${method.delivery_days} days`}
                </span>
              </div>
            </div>
          </label>
        ))}
      </div>

      <style jsx>{`
        .shipping-selector {
          padding: 20px;
          background: #f9f9f9;
          border-radius: 8px;
        }

        .shipping-selector h3 {
          margin: 0 0 16px 0;
          font-size: 18px;
          font-weight: 600;
        }

        .shipping-methods {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .shipping-method {
          display: flex;
          align-items: center;
          padding: 16px;
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .shipping-method:hover {
          border-color: #0070f3;
        }

        .shipping-method.selected {
          border-color: #0070f3;
          background: #f0f8ff;
        }

        .shipping-method input[type="radio"] {
          margin-right: 12px;
        }

        .method-info {
          flex: 1;
        }

        .method-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .provider-icon {
          font-size: 24px;
        }

        .method-name {
          font-weight: 600;
          font-size: 16px;
        }

        .method-details {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          color: #666;
        }

        .price {
          font-weight: 600;
          color: #0070f3;
        }

        .loading,
        .error,
        .empty {
          text-align: center;
          padding: 40px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          margin: 0 auto 16px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #0070f3;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .error-message {
          color: #d32f2f;
          margin-bottom: 16px;
        }

        button {
          padding: 8px 16px;
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        button:hover {
          background: #0051cc;
        }
      `}</style>
    </div>
  );
}
