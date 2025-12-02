import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { tracking_number, status, event_type, timestamp, location } = req.body;

    if (!tracking_number) {
      return res.status(400).json({ error: "Missing tracking_number" });
    }

    const query = req.scope.resolve("query");

    // Find shipment by tracking number
    const result = await query(`
      SELECT * FROM shipment WHERE tracking_number = $1
    `, [tracking_number]);

    if (!result.rows || result.rows.length === 0) {
      return res.status(404).json({ error: "Shipment not found" });
    }

    const shipment = result.rows[0];

    // Update shipment status
    if (status) {
      await query(`
        UPDATE shipment SET status = $1, updated_at = NOW() WHERE id = $2
      `, [status, shipment.id]);
    }

    // Create tracking event
    await query(`
      INSERT INTO tracking_event (id, shipment_id, status, location, timestamp, description)
      VALUES (gen_random_uuid(), $1, $2, $3, $4, $5)
    `, [
      shipment.id,
      status || event_type,
      location || "",
      timestamp ? new Date(timestamp) : new Date(),
      event_type || "",
    ]);

    res.json({ success: true });
  } catch (error) {
    console.error("InPost webhook error:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
}
