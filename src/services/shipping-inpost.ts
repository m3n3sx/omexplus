import { OrderDTO } from "@medusajs/framework/types";
import {
  ShippingProviderBase,
  ShippingAddress,
  ParcelDimensions,
  ShippingRate,
  ShipmentData,
  TrackingInfo,
  TrackingEvent,
} from "./shipping-base";

export interface InPostConfig {
  apiKey: string;
  apiSecret: string;
  orgId: string;
  baseUrl?: string;
}

export interface InPostOrganization {
  id: string;
  name: string;
  address: ShippingAddress;
}

export interface InPostShipmentRequest {
  receiver: {
    name: string;
    email: string;
    phone: string;
    address: {
      street: string;
      building_number: string;
      city: string;
      post_code: string;
      country_code: string;
    };
  };
  parcels: Array<{
    dimensions: {
      length: string;
      width: string;
      height: string;
      unit: string;
    };
    weight: {
      amount: string;
      unit: string;
    };
  }>;
  service: string;
  reference: string;
  sender: {
    name: string;
    email: string;
    phone: string;
    address: {
      street: string;
      building_number: string;
      city: string;
      post_code: string;
      country_code: string;
    };
  };
}

export class InPostShippingProvider extends ShippingProviderBase {
  private orgId: string;

  constructor(config: InPostConfig) {
    super({
      apiKey: config.apiKey,
      apiSecret: config.apiSecret,
      baseUrl: config.baseUrl || "https://api-shipx-pl.easypack24.net/v1",
      providerName: "InPost",
    });
    this.orgId = config.orgId;
  }

  async getOrganizations(): Promise<InPostOrganization[]> {
    try {
      const response = await this.makeRequest("/organizations");
      return response.items || [];
    } catch (error) {
      console.error("Failed to fetch InPost organizations:", error);
      return [];
    }
  }

  async calculateRate(
    origin: ShippingAddress,
    destination: ShippingAddress,
    parcel: ParcelDimensions,
    serviceType?: string
  ): Promise<ShippingRate[]> {
    const rates: ShippingRate[] = [];
    const weightSurcharge = this.calculateWeightSurcharge(parcel.weight);

    // InPost Paczkomat 24/7
    if (!serviceType || serviceType === "paczkomat_24_7") {
      rates.push({
        provider: "inpost",
        method: "paczkomat_24_7",
        price: 13.99 + weightSurcharge,
        delivery_days: 2,
        currency: "PLN",
      });
    }

    // InPost Courier
    if (!serviceType || serviceType === "courier") {
      rates.push({
        provider: "inpost",
        method: "courier",
        price: 18.99 + weightSurcharge,
        delivery_days: 1,
        currency: "PLN",
      });
    }

    // InPost Standard Locker
    if (!serviceType || serviceType === "parcel_locker") {
      rates.push({
        provider: "inpost",
        method: "parcel_locker",
        price: 12.99 + weightSurcharge,
        delivery_days: 3,
        currency: "PLN",
      });
    }

    return rates;
  }

  async createShipment(
    order: OrderDTO,
    shippingMethod: string,
    parcel: ParcelDimensions
  ): Promise<ShipmentData> {
    const shippingAddress = order.shipping_address;
    if (!shippingAddress) {
      throw new Error("Order missing shipping address");
    }

    const shipmentRequest: InPostShipmentRequest = {
      receiver: {
        name: `${shippingAddress.first_name} ${shippingAddress.last_name}`,
        email: order.email || "",
        phone: shippingAddress.phone || "",
        address: {
          street: shippingAddress.address_1 || "",
          building_number: shippingAddress.address_2 || "1",
          city: shippingAddress.city || "",
          post_code: shippingAddress.postal_code || "",
          country_code: shippingAddress.country_code || "PL",
        },
      },
      parcels: [
        {
          dimensions: {
            length: parcel.length.toString(),
            width: parcel.width.toString(),
            height: parcel.height.toString(),
            unit: "cm",
          },
          weight: {
            amount: (parcel.weight / 1000).toString(),
            unit: "kg",
          },
        },
      ],
      service: shippingMethod,
      reference: order.id,
      sender: {
        name: "OMEX B2B",
        email: "shipping@omex.com",
        phone: "+48123456789",
        address: {
          street: "Warehouse Street",
          building_number: "1",
          city: "Warsaw",
          post_code: "00-001",
          country_code: "PL",
        },
      },
    };

    try {
      const response = await this.makeRequest("/organizations/" + this.orgId + "/shipments", "POST", shipmentRequest);

      return {
        shipment_id: response.id,
        tracking_number: response.tracking_number,
        label_url: response.label_url || "",
        provider: "inpost",
        status: "pending",
      };
    } catch (error) {
      console.error("InPost shipment creation failed:", error);
      throw new Error(`Failed to create InPost shipment: ${error.message}`);
    }
  }

  async generateLabel(shipmentId: string): Promise<string> {
    try {
      const response = await this.makeRequest(`/shipments/${shipmentId}/label`, "GET");
      return response.label_url || response.url || "";
    } catch (error) {
      console.error("InPost label generation failed:", error);
      throw new Error(`Failed to generate InPost label: ${error.message}`);
    }
  }

  async trackShipment(trackingNumber: string): Promise<TrackingInfo> {
    try {
      const response = await this.makeRequest(`/tracking/${trackingNumber}`);

      const events: TrackingEvent[] = (response.tracking_details || []).map((detail: any) => ({
        timestamp: new Date(detail.datetime),
        status: detail.status,
        location: detail.location || "",
        description: detail.description || "",
      }));

      return {
        tracking_number: trackingNumber,
        status: response.status || "unknown",
        events,
      };
    } catch (error) {
      console.error("InPost tracking failed:", error);
      throw new Error(`Failed to track InPost shipment: ${error.message}`);
    }
  }

  async cancelShipment(shipmentId: string): Promise<boolean> {
    try {
      await this.makeRequest(`/shipments/${shipmentId}`, "DELETE");
      return true;
    } catch (error) {
      console.error("InPost shipment cancellation failed:", error);
      return false;
    }
  }
}
