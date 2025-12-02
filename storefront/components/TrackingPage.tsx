"use client";

import { useTracking } from "../hooks/useTracking";
import { TrackingTimeline } from "./TrackingTimeline";

interface TrackingPageProps {
  trackingNumber: string;
  provider: string;
  orderId: string;
}

const providerLogos: Record<string, string> = {
  inpost: "📦",
  dpd: "🚚",
  dhl: "✈️",
};

const providerUrls: Record<string, string> = {
  inpost: "https://inpost.pl/sledzenie-przesylek?number=",
  dpd: "https://tracktrace.dpd.com.pl/parcelDetails?p1=",
  dhl: "https://www.dhl.com/en/express/tracking.html?AWB=",
};

export function TrackingPage({ trackingNumber, provider, orderId }: TrackingPageProps) {
  const { tracking, loading, error, refresh } = useTracking(trackingNumber);

  if (loading && !tracking) {
    return (
      <div className="tracking-page loading">
        <div className="spinner"></div>
        <p>Loading tracking information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tracking-page error">
        <h2>⚠️ Unable to Load Tracking</h2>
        <p>{error}</p>
        <button onClick={refresh}>Retry</button>
      </div>
    );
  }

  if (!tracking) {
    return (
      <div className="tracking-page empty">
        <p>No tracking information available.</p>
      </div>
    );
  }

  const externalTrackingUrl = providerUrls[provider] + trackingNumber;

  return (
    <div className="tracking-page">
      <div className="tracking-header">
        <div className="header-content">
          <h1>Track Your Shipment</h1>
          <p className="order-id">Order #{orderId}</p>
        </div>
        <button onClick={refresh} className="refresh-button">
          🔄 Refresh
        </button>
      </div>

      <div className="shipment-info">
        <div className="info-card">
          <div className="provider-badge">
            <span className="provider-icon">{providerLogos[provider]}</span>
            <span className="provider-name">{provider.toUpperCase()}</span>
          </div>
          <div className="tracking-number">
            <label>Tracking Number</label>
            <div className="number-display">
              <span>{trackingNumber}</span>
              <a
                href={externalTrackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="external-link"
              >
                Track on {provider.toUpperCase()} →
              </a>
            </div>
          </div>
        </div>
      </div>

      <TrackingTimeline events={tracking.events} currentStatus={tracking.status} />

      <style jsx>{`
        .tracking-page {
          max-width: 800px;
          margin: 0 auto;
          padding: 24px;
        }

        .tracking-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .tracking-header h1 {
          margin: 0 0 8px 0;
          font-size: 28px;
          font-weight: 700;
        }

        .order-id {
          margin: 0;
          color: #666;
          font-size: 14px;
        }

        .refresh-button {
          padding: 10px 20px;
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: background 0.2s;
        }

        .refresh-button:hover {
          background: #0051cc;
        }

        .shipment-info {
          margin-bottom: 24px;
        }

        .info-card {
          background: white;
          padding: 24px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .provider-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e0e0e0;
        }

        .provider-icon {
          font-size: 32px;
        }

        .provider-name {
          font-size: 20px;
          font-weight: 600;
        }

        .tracking-number label {
          display: block;
          font-size: 12px;
          color: #666;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .number-display {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .number-display span {
          font-size: 18px;
          font-weight: 600;
          font-family: monospace;
        }

        .external-link {
          color: #0070f3;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
        }

        .external-link:hover {
          text-decoration: underline;
        }

        .loading,
        .error,
        .empty {
          text-align: center;
          padding: 60px 20px;
        }

        .spinner {
          width: 50px;
          height: 50px;
          margin: 0 auto 20px;
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

        .error h2 {
          color: #d32f2f;
          margin-bottom: 16px;
        }

        .error button {
          margin-top: 16px;
          padding: 10px 24px;
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}
