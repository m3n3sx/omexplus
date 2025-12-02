import { useState } from "react";

interface ShippingRate {
  id: string;
  name: string;
  provider: string;
  price: number;
  delivery_days: number;
  currency: string;
}

interface RateRequest {
  postal_code: string;
  country: string;
  weight: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

export function useShipping() {
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRates = async (request: RateRequest) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/shipping/rates`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(request),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch shipping rates");
      }

      const data = await response.json();
      
      // Transform rates to include id
      const transformedRates = data.rates.map((rate: any) => ({
        id: `${rate.provider}_${rate.method}`,
        name: `${rate.provider.toUpperCase()} ${rate.method}`,
        ...rate,
      }));

      setRates(transformedRates);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setRates([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMethods = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/shipping/methods`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch shipping methods");
      }

      const data = await response.json();
      setRates(data.methods);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setRates([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    rates,
    loading,
    error,
    fetchRates,
    fetchMethods,
  };
}
