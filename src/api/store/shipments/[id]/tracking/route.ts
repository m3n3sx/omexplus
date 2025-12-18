import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ShippingService } from "../../../../../services/shipping-service";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { id: shipmentId } = req.params;

    // Fetch shipment from database
    const query = req.scope.resolve("query");
    const result = await query(`
      SELECT * FROM shipment WHERE id = $1 OR tracking_number = $1
    `, [shipmentId]);

    if (!result.rows || result.rows.length === 0) {
      return res.status(404).json({ error: "Shipment not found" });
    }

    const shipment = result.rows[0];

    if (!shipment.tracking_number) {
      return res.status(400).json({ error: "Tracking number not available" });
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

    const trackingInfo = await shippingService.track(
      shipment.tracking_number,
      shipment.provider
    );

    // Update shipment status
    await query(`
      UPDATE shipment SET status = $1, updated_at = NOW() WHERE id = $2
    `, [trackingInfo.status, shipment.id]);

    // Save tracking events
    for (const event of trackingInfo.events) {
      await query(`
        INSERT INTO tracking_event (id, shipment_id, status, location, timestamp, description)
        VALUES (gen_random_uuid(), $1, $2, $3, $4, $5)
        ON CONFLICT DO NOTHING
      `, [
        shipment.id,
        event.status,
        event.location,
        event.timestamp,
        event.description,
      ]);
    }

    res.json({ tracking: trackingInfo });
  } catch (error) {
    console.error("Failed to track shipment:", error);
    res.status(500).json({
      error: "Failed to track shipment",
      message: error.message,
    });
  }
}
