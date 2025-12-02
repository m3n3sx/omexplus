import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ShippingService } from "../../../../services/shipping-service";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const shippingService = new ShippingService({
      inpost: {
        apiKey: process.env.INPOST_API_KEY || "",
        apiSecret: process.env.INPOST_API_SECRET || "",
        orgId: process.env.INPOST_ORG_ID || "",
      },
      dpd: {
        apiKey: process.env.DPD_API_KEY || "",
        login: process.env.DPD_LOGIN || "",
        password: process.env.DPD_PASSWORD || "",
      },
      dhl: {
        apiKey: process.env.DHL_API_KEY || "",
        accountNumber: process.env.DHL_ACCOUNT_NUMBER || "",
      },
    });

    const providers = shippingService.getAvailableProviders();

    const methods = [
      // InPost methods
      {
        id: "inpost_paczkomat_24_7",
        name: "InPost Paczkomat 24/7",
        provider: "inpost",
        price: 4.99,
        delivery_days: 2,
        currency: "USD",
      },
      {
        id: "inpost_courier",
        name: "InPost Courier",
        provider: "inpost",
        price: 7.99,
        delivery_days: 2,
        currency: "USD",
      },
      {
        id: "inpost_parcel_locker",
        name: "InPost Standard Locker",
        provider: "inpost",
        price: 3.99,
        delivery_days: 2,
        currency: "USD",
      },
      // DPD methods
      {
        id: "dpd_economy",
        name: "DPD Economy",
        provider: "dpd",
        price: 6.99,
        delivery_days: 3,
        currency: "USD",
      },
      {
        id: "dpd_express",
        name: "DPD Express",
        provider: "dpd",
        price: 12.99,
        delivery_days: 1,
        currency: "USD",
      },
      // DHL methods
      {
        id: "dhl_parcel",
        name: "DHL Parcel",
        provider: "dhl",
        price: 8.99,
        delivery_days: 3,
        currency: "USD",
      },
      {
        id: "dhl_express",
        name: "DHL Express",
        provider: "dhl",
        price: 14.99,
        delivery_days: 1,
        currency: "USD",
      },
    ].filter((method) => providers.includes(method.provider));

    res.json({ methods });
  } catch (error) {
    console.error("Failed to fetch shipping methods:", error);
    res.status(500).json({
      error: "Failed to fetch shipping methods",
      message: error.message,
    });
  }
}
