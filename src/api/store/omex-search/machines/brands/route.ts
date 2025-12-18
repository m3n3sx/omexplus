/**
 * Machine Brands API
 * GET /store/omex-search/machines/brands
 * 
 * Returns list of all manufacturers with model counts
 */

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getDbConnection } from "../../../../../lib/db"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const client = await getDbConnection()

    const result = await client.query(`
      SELECT 
        manufacturer as name,
        manufacturer as code,
        COUNT(*) as models
      FROM omex.machines 
      GROUP BY manufacturer 
      ORDER BY COUNT(*) DESC, manufacturer
    `)

    client.release()

    res.json({
      brands: result.rows.map((r: any) => ({
        id: r.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        name: r.name,
        code: r.name,
        models: parseInt(r.models)
      }))
    })
  } catch (error: any) {
    console.error("Error fetching brands:", error)
    res.status(500).json({ error: error.message })
  }
}
