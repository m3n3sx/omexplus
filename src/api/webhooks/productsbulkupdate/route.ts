import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"

export async function OPTIONS(req: MedusaRequest, res: MedusaResponse) {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  res.setHeader("Access-Control-Allow-Credentials", "true")
  res.status(204).end()
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const body = req.body as { productIds: string[]; updates: { status?: string; collection_id?: string } }
  const { productIds, updates } = body

  console.log("=== PRODUCTS BULK UPDATE ===")
  console.log("Product IDs:", productIds)
  console.log("Updates:", updates)

  if (!productIds || productIds.length === 0) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "productIds jest wymagany"
    )
  }

  try {
    const knex = req.scope.resolve("__pg_connection__")
    
    const setClauses: string[] = []
    const values: any[] = []
    let paramIndex = 1

    if (updates.status) {
      setClauses.push("status = $" + paramIndex)
      values.push(updates.status)
      paramIndex++
    }

    if (updates.collection_id) {
      setClauses.push("collection_id = $" + paramIndex)
      values.push(updates.collection_id)
      paramIndex++
    }

    if (setClauses.length === 0) {
      return res.json({
        success: false,
        message: "Brak danych do aktualizacji"
      })
    }

    setClauses.push("updated_at = NOW()")

    // Create placeholders for product IDs
    const idPlaceholders = productIds.map((_, i) => "$" + (paramIndex + i)).join(", ")
    values.push(...productIds)

    const updateQuery = `
      UPDATE product
      SET ${setClauses.join(", ")}
      WHERE id IN (${idPlaceholders})
      RETURNING id, title, status
    `

    console.log("SQL:", updateQuery)
    console.log("Values:", values)

    const result = await knex.raw(updateQuery, values)
    
    console.log("Updated:", result.rows?.length || 0, "products")

    res.json({
      success: true,
      updated: result.rows?.length || 0,
      products: result.rows,
      message: "Zaktualizowano " + (result.rows?.length || 0) + " produktów"
    })
  } catch (error: any) {
    console.error("Error:", error)
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Nie udało się zaktualizować produktów: " + error.message
    )
  }
}

export async function GET(_req: MedusaRequest, res: MedusaResponse) {
  res.json({ 
    status: "ok", 
    message: "Products bulk update endpoint is active"
  })
}
