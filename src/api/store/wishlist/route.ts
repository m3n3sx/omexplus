import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { WISHLIST_MODULE } from "../../../modules/wishlist"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const wishlistService = req.scope.resolve(WISHLIST_MODULE)
  const customerId = req.auth_context?.actor_id
  
  const wishlist = await wishlistService.getWishlist(customerId)
  
  res.json({ wishlist })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const wishlistService = req.scope.resolve(WISHLIST_MODULE)
  const customerId = req.auth_context?.actor_id
  
  const item = await wishlistService.addToWishlist(customerId, req.body.productId)
  
  res.json({ item })
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const wishlistService = req.scope.resolve(WISHLIST_MODULE)
  const customerId = req.auth_context?.actor_id
  
  await wishlistService.removeFromWishlist(customerId, req.body.productId)
  
  res.json({ success: true })
}
