import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"

// Handle CORS preflight
export const OPTIONS = async (req: MedusaRequest, res: MedusaResponse) => {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-publishable-api-key")
  res.setHeader("Access-Control-Allow-Credentials", "true")
  res.status(204).end()
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  // Verify authorization header
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new MedusaError(
      MedusaError.Types.UNAUTHORIZED,
      "Brak autoryzacji"
    )
  }

  const orderId = req.params.id
  const body = req.body as { status: string }
  const { status } = body

  if (!status) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Status jest wymagany"
    )
  }

  const allowedStatuses = ['pending', 'completed', 'canceled', 'draft', 'archived', 'requires_action']
  if (!allowedStatuses.includes(status)) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Nieprawidłowy status. Dozwolone: ${allowedStatuses.join(', ')}`
    )
  }

  try {
    const knex = req.scope.resolve("__pg_connection__")
    
    const updateResult = await knex.raw(`
      UPDATE "order"
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id, display_id, status, email, metadata, created_at, updated_at
    `, [status, orderId])

    if (!updateResult.rows || updateResult.rows.length === 0) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Zamówienie o ID ${orderId} nie zostało znalezione`
      )
    }

    res.json({
      order: updateResult.rows[0],
      message: `Status zamówienia został zmieniony na: ${status}`
    })
  } catch (error: any) {
    if (error instanceof MedusaError) {
      throw error
    }
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Nie udało się zaktualizować statusu: ${error.message}`
    )
  }
}
