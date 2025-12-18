import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { orderId } = req.query
  
  // Śledzenie przesyłki
  const tracking = {
    orderId,
    status: "in_transit",
    trackingNumber: "TRACK123456",
    carrier: "DHL",
    estimatedDelivery: new Date(),
    history: [],
  }
  
  res.json({ tracking })
}
