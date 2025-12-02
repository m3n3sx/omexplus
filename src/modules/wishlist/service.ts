import { MedusaService } from "@medusajs/framework/utils"

class WishlistService extends MedusaService({}) {
  async addToWishlist(customerId: string, productId: string) {
    return {
      id: `wishlist_${Date.now()}`,
      customerId,
      productId,
      createdAt: new Date(),
    }
  }

  async removeFromWishlist(customerId: string, productId: string) {
    return { success: true }
  }

  async getWishlist(customerId: string) {
    return []
  }
}

export default WishlistService
