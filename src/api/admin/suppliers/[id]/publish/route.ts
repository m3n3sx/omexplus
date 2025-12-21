import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

/**
 * POST /admin/suppliers/:id/publish
 * Włącza/wyłącza widoczność produktów dostawcy w sklepie
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const knex = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION)
    const { id } = req.params
    const { publish = true } = req.body as any

    const supplier = await knex("supplier").where("id", id).first()
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" })
    }

    // Update supplier
    await knex("supplier").where("id", id).update({
      show_in_store: publish,
      updated_at: new Date(),
    })

    // Update all products
    await knex("supplier_product").where("supplier_id", id).update({
      is_active: publish,
      updated_at: new Date(),
    })

    res.json({
      success: true,
      show_in_store: publish,
      message: publish ? "Produkty widoczne w sklepie" : "Produkty ukryte",
    })
  } catch (error: any) {
    console.error("Publish error:", error)
    res.status(500).json({ message: error.message })
  }
}
