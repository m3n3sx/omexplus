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

export interface DHLConfig {
  apiKey: string;
  accountNumber: string;
  baseUrl?: string;
}

export class DHLShippingProvider extends ShippingProviderBase {
  private accountNumber: string;

  constructor(config: DHLConfig) {
    super({
      apiKey: config.apiKey,
      baseUrl: config.baseUrl || "https://api.dhl.com/v1",
      providerName: "DHL",
    });
    this.accountNumber = config.accountNumber;
  }

  async calculateRate(
    origin: ShippingAddress,
    destination: ShippingAddress,
    parcel: ParcelDimensions,
    serviceType?: string
  ): Promise<ShippingRate[]> {
    const rates: ShippingRate[] = [];
    const weightSurcharge = this.calculateWeightSurcharge(parcel.weight);

    // DHL Standard
    if (!serviceType || serviceType === "standard") {
      rates.push({
        provider: "dhl",
        method: "standard",
        price: 19.99 + weightSurcharge,
        delivery_days: 3,
        currency: "PLN",
      });
    }

    // DHL Express
    if (!serviceType || serviceType === "express") {
      rates.push({
        provider: "dhl",
        method: "express",
        price: 34.99 + weightSurcharge,
        delivery_days: 1,
        currency: "PLN",
      });
    }

    // DHL Economy (międzynarodowa)
    if (!serviceType || serviceType === "economy") {
      rates.push({
        provider: "dhl",
        method: "economy",
        price: 29.99 + weightSurcharge,
        delivery_days: 5,
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

    const shipmentRequest = {
      plannedShippingDateAndTime: new Date().toISOString(),
      pickup: {
        isRequested: false,
      },
      productCode: shippingMethod === "express" ? "P" : "N",
      accounts: [
        {
          typeCode: "shipper",
          number: this.accountNumber,
        },
      ],
      customerDetails: {
        shipperDetails: {
          postalAddress: {
            postalCode: "00-001",
            cityName: "Warsaw",
            countryCode: "PL",
            addressLine1: "Warehouse Street 1",
          },
          contactInformation: {
            email: "shipping@omex.com",
            phone: "+48123456789",
            companyName: "OMEX B2B",
            fullName: "OMEX Shipping",
          },
        },
        receiverDetails: {
          postalAddress: {
            postalCode: shippingAddress.postal_code || "",
            cityName: shippingAddress.city || "",
            countryCode: shippingAddress.country_code || "",
            addressLine1: shippingAddress.address_1 || "",
            addressLine2: shippingAddress.address_2 || "",
          },
          contactInformation: {
            email: order.email || "",
            phone: shippingAddress.phone || "",
            fullName: `${shippingAddress.first_name} ${shippingAddress.last_name}`,
          },
        },
      },
      content: {
        packages: [
          {
            weight: parcel.weight / 1000,
            dimensions: {
              length: parcel.length,
              width: parcel.width,
              height: parcel.height,
            },
          },
        ],
        isCustomsDeclarable: false,
        description: "E-commerce order",
        incoterm: "DAP",
      },
      outputImageProperties: {
        imageOptions: [
          {
            typeCode: "label",
            templateName: "ECOM26_A4_001",
          },
        ],
      },
    };

    try {
      const response = await this.makeRequest("/shipments", "POST", shipmentRequest, {
        "DHL-API-Key": this.apiKey,
      });

      const shipmentId = response.shipmentTrackingNumber || response.dispatchConfirmationNumber;
      const labelUrl = response.documents?.[0]?.content || "";

      return {
        shipment_id: shipmentId,
        tracking_number: shipmentId,
        label_url: labelUrl,
        provider: "dhl",
        status: "pending",
      };
    } catch (error) {
      console.error("DHL shipment creation failed:", error);
      throw new Error(`Failed to create DHL shipment: ${error.message}`);
    }
  }

  async generateLabel(shipmentId: string): Promise<string> {
    try {
      const response = await this.makeRequest(`/shipments/${shipmentId}/label`, "GET", undefined, {
        "DHL-API-Key": this.apiKey,
      });
      return response.label_url || response.documents?.[0]?.content || "";
    } catch (error) {
      console.error("DHL label generation failed:", error);
      throw new Error(`Failed to generate DHL label: ${error.message}`);
    }
  }

  async trackShipment(trackingNumber: string): Promise<TrackingInfo> {
    try {
      const response = await this.makeRequest(`/track/shipments?trackingNumber=${trackingNumber}`, "GET", undefined, {
        "DHL-API-Key": this.apiKey,
      });

      const shipment = response.shipments?.[0];
      if (!shipment) {
        throw new Error("Shipment not found");
      }

      const events: TrackingEvent[] = (shipment.events || []).map((event: any) => ({
        timestamp: new Date(event.timestamp),
        status: event.statusCode,
        location: event.location?.address?.addressLocality || "",
        description: event.description || "",
      }));

      return {
        tracking_number: trackingNumber,
        status: shipment.status?.statusCode || "unknown",
        events,
      };
    } catch (error) {
      console.error("DHL tracking failed:", error);
      throw new Error(`Failed to track DHL shipment: ${error.message}`);
    }
  }

  async cancelShipment(shipmentId: string): Promise<boolean> {
    try {
      await this.makeRequest(`/shipments/${shipmentId}`, "DELETE", undefined, {
        "DHL-API-Key": this.apiKey,
      });
      return true;
    } catch (error) {
      console.error("DHL shipment cancellation failed:", error);
      return false;
    }
  }
}
