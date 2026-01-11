import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const { id } = req.params
    const knex = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION)
    
    const company = await knex("b2b_company").where("id", id).first()

    if (!company) {
      return res.status(404).json({ message: "Firma nie została znaleziona" })
    }

    res.json({ company })
  } catch (error: any) {
    console.error("Error fetching B2B company:", error)
    res.status(500).json({
      message: error.message || "Błąd podczas pobierania firmy"
    })
  }
}

export const PUT = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const { id } = req.params
    const knex = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION)
    const data = req.body as any

    const existing = await knex("b2b_company").where("id", id).first()
    if (!existing) {
      return res.status(404).json({ message: "Firma nie została znaleziona" })
    }

    const updates: any = {
      updated_at: new Date()
    }

    // Aktualizuj tylko podane pola
    const allowedFields = [
      "name", "nip", "regon", "krs", "contact_email", "contact_phone",
      "address_line_1", "address_line_2", "city", "postal_code", "country_code",
      "payment_terms", "credit_limit", "discount_percentage", "notes", "is_active"
    ]

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updates[field] = data[field]
      }
    }

    await knex("b2b_company").where("id", id).update(updates)

    const company = await knex("b2b_company").where("id", id).first()

    res.json({ company })
  } catch (error: any) {
    console.error("Error updating B2B company:", error)
    res.status(500).json({
      message: error.message || "Błąd podczas aktualizacji firmy"
    })
  }
}

export const DELETE = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const { id } = req.params
    const knex = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION)

    const existing = await knex("b2b_company").where("id", id).first()
    if (!existing) {
      return res.status(404).json({ message: "Firma nie została znaleziona" })
    }

    await knex("b2b_company").where("id", id).delete()

    res.json({ success: true, message: "Firma została usunięta" })
  } catch (error: any) {
    console.error("Error deleting B2B company:", error)
    res.status(500).json({
      message: error.message || "Błąd podczas usuwania firmy"
    })
  }
}
