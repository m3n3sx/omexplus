import { OrderDTO } from "@medusajs/framework/types";

export interface ShippingAddress {
  street: string;
  city: string;
  postal_code: string;
  country: string;
  state?: string;
}

export interface ParcelDimensions {
  length: number; // cm
  width: number; // cm
  height: number; // cm
  weight: number; // grams
}

export interface ShippingRate {
  provider: string;
  method: string;
  price: number;
  delivery_days: number;
  currency: string;
}

export interface ShipmentData {
  shipment_id: string;
  tracking_number: string;
  label_url: string;
  provider: string;
  status: string;
}

export interface TrackingEvent {
  timestamp: Date;
  status: string;
  location: string;
  description: string;
}

export interface TrackingInfo {
  tracking_number: string;
  status: string;
  events: TrackingEvent[];
}

export abstract class ShippingProviderBase {
  protected apiKey: string;
  protected apiSecret?: string;
  protected baseUrl: string;
  protected providerName: string;

  constructor(config: { apiKey: string; apiSecret?: string; baseUrl: string; providerName: string }) {
    this.apiKey = config.apiKey;
    this.apiSecret = config.apiSecret;
    this.baseUrl = config.baseUrl;
    this.providerName = config.providerName;
  }

  abstract calculateRate(
    origin: ShippingAddress,
    destination: ShippingAddress,
    parcel: ParcelDimensions,
    serviceType?: string
  ): Promise<ShippingRate[]>;

  abstract createShipment(
    order: OrderDTO,
    shippingMethod: string,
    parcel: ParcelDimensions
  ): Promise<ShipmentData>;

  abstract generateLabel(shipmentId: string): Promise<string>;

  abstract trackShipment(trackingNumber: string): Promise<TrackingInfo>;

  abstract cancelShipment(shipmentId: string): Promise<boolean>;

  protected async makeRequest(
    endpoint: string,
    method: string = "GET",
    data?: any,
    headers?: Record<string, string>
  ): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    const defaultHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
      ...headers,
    };

    try {
      const response = await fetch(url, {
        method,
        headers: defaultHeaders,
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`${this.providerName} API Error: ${response.status} - ${error}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`${this.providerName} API Request Failed:`, error);
      throw error;
    }
  }

  protected calculateWeightSurcharge(weight: number): number {
    const baseWeight = 5000; // 5kg in grams
    if (weight > baseWeight) {
      const extraKg = Math.ceil((weight - baseWeight) / 1000);
      return extraKg * 1.0;
    }
    return 0;
  }

  protected calculateInsurance(value: number): number {
    return Math.ceil(value / 100) * 0.5;
  }
}
