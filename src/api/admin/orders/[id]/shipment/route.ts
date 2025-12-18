import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ShippingService } from "../../../../../services/shipping-service";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { id: orderId } = req.params;
    const { shipping_method_id, weight, dimensions } = req.body;

    if (!shipping_method_id) {
      return res.status(400).json({
        error: "Missing required field: shipping_method_id",
      });
    }

    // Fetch order from database
    const orderModule = req.scope.resolve("orderModuleService");
    const order = await orderModule.retrieveOrder(orderId, {
      relations: ["shipping_address", "items"],
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Parse shipping method
    const [provider, method] = shipping_method_id.split("_", 2);

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

    const parcel = {
      weight: weight || 1000,
      length: dimensions?.length || 30,
      width: dimensions?.width || 20,
      height: dimensions?.height || 10,
    };

    const shipment = await shippingService.createShipment(
      order,
      method || shipping_method_id,
      parcel,
      provider
    );

    // Save shipment to database
    const query = req.scope.resolve("query");
    await query(`
      INSERT INTO shipment (id, order_id, provider, shipping_method, tracking_number, label_url, status, metadata)
      VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7)
    `, [
      orderId,
      shipment.provider,
      shipping_method_id,
      shipment.tracking_number,
      shipment.label_url,
      shipment.status,
      JSON.stringify({ shipment_id: shipment.shipment_id }),
    ]);

    res.json({ shipment });
  } catch (error) {
    console.error("Failed to create shipment:", error);
    res.status(500).json({
      error: "Failed to create shipment",
      message: error.message,
    });
  }
}
