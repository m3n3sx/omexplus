import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const knex = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION)
    
    // Pobierz firmy B2B z tabeli b2b_company
    const companies = await knex("b2b_company")
      .select("*")
      .orderBy("created_at", "desc")

    res.json({
      companies,
      count: companies.length
    })
  } catch (error: any) {
    console.error("Error fetching B2B companies:", error)
    
    // Jeśli tabela nie istnieje, zwróć pustą listę
    if (error.message?.includes("does not exist")) {
      return res.json({ companies: [], count: 0 })
    }
    
    res.status(500).json({
      error: error.message || "Failed to fetch B2B companies"
    })
  }
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const knex = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION)
    const data = req.body as any

    if (!data.name) {
      return res.status(400).json({ message: "Nazwa firmy jest wymagana" })
    }

    // Sprawdź czy tabela istnieje, jeśli nie - utwórz
    const tableExists = await knex.schema.hasTable("b2b_company")
    if (!tableExists) {
      await knex.schema.createTable("b2b_company", (table) => {
        table.string("id").primary()
        table.string("name").notNullable()
        table.string("nip")
        table.string("regon")
        table.string("krs")
        table.string("contact_email")
        table.string("contact_phone")
        table.string("address_line_1")
        table.string("address_line_2")
        table.string("city")
        table.string("postal_code")
        table.string("country_code").defaultTo("PL")
        table.integer("payment_terms").defaultTo(14)
        table.integer("credit_limit").defaultTo(0)
        table.decimal("discount_percentage", 5, 2).defaultTo(0)
        table.text("notes")
        table.boolean("is_active").defaultTo(true)
        table.jsonb("metadata").defaultTo("{}")
        table.timestamp("created_at").defaultTo(knex.fn.now())
        table.timestamp("updated_at").defaultTo(knex.fn.now())
      })
      console.log("✅ Created b2b_company table")
    }

    const id = `b2b_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`

    const company = {
      id,
      name: data.name,
      nip: data.nip || null,
      regon: data.regon || null,
      krs: data.krs || null,
      contact_email: data.contact_email || null,
      contact_phone: data.contact_phone || null,
      address_line_1: data.address_line_1 || null,
      address_line_2: data.address_line_2 || null,
      city: data.city || null,
      postal_code: data.postal_code || null,
      country_code: data.country_code || "PL",
      payment_terms: data.payment_terms || 14,
      credit_limit: data.credit_limit || 0,
      discount_percentage: data.discount_percentage || 0,
      notes: data.notes || null,
      is_active: true,
      metadata: JSON.stringify(data.metadata || {}),
      created_at: new Date(),
      updated_at: new Date(),
    }

    await knex("b2b_company").insert(company)

    res.status(201).json({ company, id })
  } catch (error: any) {
    console.error("Error creating B2B company:", error)
    res.status(500).json({
      message: error.message || "Błąd podczas tworzenia firmy"
    })
  }
}
