import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

/**
 * GET /store/suppliers - Lista dostawców (publiczny endpoint dla testów)
 */

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const knex = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION)
    
    const suppliers = await knex("supplier")
      .select("id", "name", "code", "city", "is_active", "is_dropship", "products_count", "orders_count", "sync_enabled", "last_sync_at", "created_at")
      .where("is_active", true)
      .orderBy("name")

    res.json({ suppliers, count: suppliers.length })
  } catch (error: any) {
    console.error("Error listing suppliers:", error)
    res.status(500).json({ message: error.message })
  }
}
