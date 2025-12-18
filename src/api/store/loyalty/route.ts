import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { LOYALTY_MODULE } from "../../../modules/loyalty"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const loyaltyService = req.scope.resolve(LOYALTY_MODULE)
  const customerId = req.auth_context?.actor_id
  
  const points = await loyaltyService.getPoints(customerId)
  
  res.json({ points })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const loyaltyService = req.scope.resolve(LOYALTY_MODULE)
  const customerId = req.auth_context?.actor_id
  
  const result = await loyaltyService.redeemPoints(customerId, req.body.points)
  
  res.json(result)
}
