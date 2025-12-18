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

export interface DPDConfig {
  apiKey: string;
  login: string;
  password: string;
  baseUrl?: string;
}

export class DPDShippingProvider extends ShippingProviderBase {
  private login: string;
  private password: string;

  constructor(config: DPDConfig) {
    super({
      apiKey: config.apiKey,
      baseUrl: config.baseUrl || "https://www.dpd.com.pl/api",
      providerName: "DPD",
    });
    this.login = config.login;
    this.password = config.password;
  }

  async calculateRate(
    origin: ShippingAddress,
    destination: ShippingAddress,
    parcel: ParcelDimensions,
    serviceType?: string
  ): Promise<ShippingRate[]> {
    const rates: ShippingRate[] = [];
    const weightSurcharge = this.calculateWeightSurcharge(parcel.weight);

    // DPD Economy
    if (!serviceType || serviceType === "economy") {
      rates.push({
        provider: "dpd",
        method: "economy",
        price: 6.99 + weightSurcharge,
        delivery_days: 3,
        currency: "USD",
      });
    }

    // DPD Express
    if (!serviceType || serviceType === "express") {
      rates.push({
        provider: "dpd",
        method: "express",
        price: 12.99 + weightSurcharge,
        delivery_days: 1,
        currency: "USD",
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

    const shipmentRequest = {
      receiver: {
        name: `${shippingAddress.first_name} ${shippingAddress.last_name}`,
        phone: shippingAddress.phone || "",
        email: order.email || "",
        address: {
          street: shippingAddress.address_1 || "",
          city: shippingAddress.city || "",
          postal_code: shippingAddress.postal_code || "",
          country: shippingAddress.country_code || "",
        },
      },
      parcels: [
        {
          weight: parcel.weight / 1000, // kg
          length: parcel.length,
          width: parcel.width,
          height: parcel.height,
        },
      ],
      service: shippingMethod,
      reference: order.id,
      sender: {
        name: "OMEX B2B",
        phone: "+48123456789",
        email: "shipping@omex.com",
        address: {
          street: "Warehouse Street 1",
          city: "Warsaw",
          postal_code: "00-001",
          country: "PL",
        },
      },
    };

    try {
      const response = await this.makeRequest(
        "/shipments",
        "POST",
        shipmentRequest,
        {
          "X-DPD-Login": this.login,
          "X-DPD-Password": this.password,
        }
      );

      return {
        shipment_id: response.shipment_id || response.id,
        tracking_number: response.tracking_number || response.parcel_number,
        label_url: response.label_url || "",
        provider: "dpd",
        status: "pending",
      };
    } catch (error) {
      console.error("DPD shipment creation failed:", error);
      throw new Error(`Failed to create DPD shipment: ${error.message}`);
    }
  }

  async generateLabel(shipmentId: string): Promise<string> {
    try {
      const response = await this.makeRequest(
        `/shipments/${shipmentId}/label`,
        "GET",
        undefined,
        {
          "X-DPD-Login": this.login,
          "X-DPD-Password": this.password,
        }
      );
      return response.label_url || response.pdf_url || "";
    } catch (error) {
      console.error("DPD label generation failed:", error);
      throw new Error(`Failed to generate DPD label: ${error.message}`);
    }
  }

  async trackShipment(trackingNumber: string): Promise<TrackingInfo> {
    try {
      const response = await this.makeRequest(
        `/tracking/${trackingNumber}`,
        "GET",
        undefined,
        {
          "X-DPD-Login": this.login,
          "X-DPD-Password": this.password,
        }
      );

      const events: TrackingEvent[] = (response.events || []).map((event: any) => ({
        timestamp: new Date(event.timestamp),
        status: event.status,
        location: event.location || "",
        description: event.description || "",
      }));

      return {
        tracking_number: trackingNumber,
        status: response.status || "unknown",
        events,
      };
    } catch (error) {
      console.error("DPD tracking failed:", error);
      throw new Error(`Failed to track DPD shipment: ${error.message}`);
    }
  }

  async cancelShipment(shipmentId: string): Promise<boolean> {
    try {
      await this.makeRequest(
        `/shipments/${shipmentId}/cancel`,
        "POST",
        {},
        {
          "X-DPD-Login": this.login,
          "X-DPD-Password": this.password,
        }
      );
      return true;
    } catch (error) {
      console.error("DPD shipment cancellation failed:", error);
      return false;
    }
  }
}
