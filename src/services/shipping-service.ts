import { OrderDTO } from "@medusajs/framework/types";
import { InPostShippingProvider } from "./shipping-inpost";
import { DPDShippingProvider } from "./shipping-dpd";
import { DHLShippingProvider } from "./shipping-dhl";
import {
  ShippingProviderBase,
  ShippingAddress,
  ParcelDimensions,
  ShippingRate,
  ShipmentData,
  TrackingInfo,
} from "./shipping-base";

export interface ShippingServiceConfig {
  inpost?: {
    apiKey: string;
    apiSecret: string;
    orgId: string;
  };
  dpd?: {
    apiKey: string;
    login: string;
    password: string;
  };
  dhl?: {
    apiKey: string;
    accountNumber: string;
  };
}

export class ShippingService {
  private providers: Map<string, ShippingProviderBase> = new Map();

  constructor(config: ShippingServiceConfig) {
    if (config.inpost) {
      this.providers.set("inpost", new InPostShippingProvider(config.inpost));
    }
    if (config.dpd) {
      this.providers.set("dpd", new DPDShippingProvider(config.dpd));
    }
    if (config.dhl) {
      this.providers.set("dhl", new DHLShippingProvider(config.dhl));
    }
  }

  private selectProvider(destination: ShippingAddress, method?: string): string {
    const country = destination.country?.toUpperCase() || "";

    // InPost for Poland
    if (country === "PL" || country === "POL") {
      return "inpost";
    }

    // DPD for EU countries
    const euCountries = ["DE", "FR", "IT", "ES", "NL", "BE", "AT", "CZ", "SK", "HU", "RO", "BG"];
    if (euCountries.includes(country)) {
      return "dpd";
    }

    // DHL for global
    return "dhl";
  }

  async getRates(
    origin: ShippingAddress,
    destination: ShippingAddress,
    parcel: ParcelDimensions
  ): Promise<ShippingRate[]> {
    const allRates: ShippingRate[] = [];

    try {
      // Get rates from all available providers
      for (const [providerName, provider] of this.providers) {
        try {
          const rates = await provider.calculateRate(origin, destination, parcel);
          allRates.push(...rates);
        } catch (error) {
          console.error(`Failed to get rates from ${providerName}:`, error);
        }
      }

      // Sort by price
      return allRates.sort((a, b) => a.price - b.price);
    } catch (error) {
      console.error("Failed to get shipping rates:", error);
      throw new Error("Unable to calculate shipping rates");
    }
  }

  async createShipment(
    order: OrderDTO,
    shippingMethod: string,
    parcel: ParcelDimensions,
    providerName?: string
  ): Promise<ShipmentData> {
    try {
      // Auto-select provider if not specified
      if (!providerName && order.shipping_address) {
        providerName = this.selectProvider(order.shipping_address, shippingMethod);
      }

      if (!providerName) {
        throw new Error("Unable to determine shipping provider");
      }

      const provider = this.providers.get(providerName);
      if (!provider) {
        throw new Error(`Shipping provider ${providerName} not configured`);
      }

      return await provider.createShipment(order, shippingMethod, parcel);
    } catch (error) {
      console.error("Failed to create shipment:", error);
      throw error;
    }
  }

  async getLabel(shipmentId: string, providerName: string): Promise<string> {
    const provider = this.providers.get(providerName);
    if (!provider) {
      throw new Error(`Shipping provider ${providerName} not configured`);
    }

    return await provider.generateLabel(shipmentId);
  }

  async track(trackingNumber: string, providerName: string): Promise<TrackingInfo> {
    const provider = this.providers.get(providerName);
    if (!provider) {
      throw new Error(`Shipping provider ${providerName} not configured`);
    }

    return await provider.trackShipment(trackingNumber);
  }

  async cancelShipment(shipmentId: string, providerName: string): Promise<boolean> {
    const provider = this.providers.get(providerName);
    if (!provider) {
      throw new Error(`Shipping provider ${providerName} not configured`);
    }

    return await provider.cancelShipment(shipmentId);
  }

  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }
}
