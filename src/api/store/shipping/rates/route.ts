import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ShippingService } from "../../../../services/shipping-service";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { postal_code, country, weight, dimensions } = req.body;

    if (!postal_code || !country || !weight) {
      return res.status(400).json({
        error: "Missing required fields: postal_code, country, weight",
      });
    }

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

    const origin = {
      street: "Warehouse Street 1",
      city: "Warsaw",
      postal_code: "00-001",
      country: "PL",
    };

    const destination = {
      street: "",
      city: "",
      postal_code,
      country,
    };

    const parcel = {
      weight: weight || 1000,
      length: dimensions?.length || 30,
      width: dimensions?.width || 20,
      height: dimensions?.height || 10,
    };

    const rates = await shippingService.getRates(origin, destination, parcel);

    res.json({ rates });
  } catch (error) {
    console.error("Failed to calculate shipping rates:", error);
    res.status(500).json({
      error: "Failed to calculate shipping rates",
      message: error.message,
    });
  }
}
