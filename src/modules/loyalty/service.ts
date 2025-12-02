import { MedusaService } from "@medusajs/framework/utils"

class LoyaltyService extends MedusaService({}) {
  async addPoints(customerId: string, points: number, reason: string) {
    return {
      customerId,
      points,
      reason,
      createdAt: new Date(),
    }
  }

  async getPoints(customerId: string) {
    return { customerId, totalPoints: 0 }
  }

  async redeemPoints(customerId: string, points: number) {
    return { success: true, remainingPoints: 0 }
  }
}

export default LoyaltyService
