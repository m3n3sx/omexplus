import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ShippingService } from "../../../../../services/shipping-service";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { id: shipmentId } = req.params;

    // Fetch shipment from database
    const query = req.scope.resolve("query");
    const result = await query(`
      SELECT * FROM shipment WHERE id = $1
    `, [shipmentId]);

    if (!result.rows || result.rows.length === 0) {
      return res.status(404).json({ error: "Shipment not found" });
    }

    const shipment = result.rows[0];

    // If label URL already exists, return it
    if (shipment.label_url) {
      return res.json({ label_url: shipment.label_url });
    }

    // Generate label
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

    const metadata = shipment.metadata || {};
    const labelUrl = await shippingService.getLabel(
      metadata.shipment_id || shipmentId,
      shipment.provider
    );

    // Update shipment with label URL
    await query(`
      UPDATE shipment SET label_url = $1, updated_at = NOW() WHERE id = $2
    `, [labelUrl, shipmentId]);

    res.json({ label_url: labelUrl });
  } catch (error) {
    console.error("Failed to get shipping label:", error);
    res.status(500).json({
      error: "Failed to get shipping label",
      message: error.message,
    });
  }
}
