import { useState, useEffect } from "react";

interface TrackingEvent {
  timestamp: string;
  status: string;
  location: string;
  description: string;
}

interface TrackingInfo {
  tracking_number: string;
  status: string;
  events: TrackingEvent[];
}

export function useTracking(trackingNumber: string | null, autoRefresh = true) {
  const [tracking, setTracking] = useState<TrackingInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTracking = async () => {
    if (!trackingNumber) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/shipments/${trackingNumber}/tracking`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch tracking information");
      }

      const data = await response.json();
      setTracking(data.tracking);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setTracking(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (trackingNumber) {
      fetchTracking();

      // Auto-refresh every 60 seconds
      if (autoRefresh) {
        const interval = setInterval(fetchTracking, 60000);
        return () => clearInterval(interval);
      }
    }
  }, [trackingNumber, autoRefresh]);

  return {
    tracking,
    loading,
    error,
    refresh: fetchTracking,
  };
}
