/**
 * Machine Autocomplete API
 * GET /store/omex-search/machines/autocomplete
 * 
 * Returns autocomplete suggestions for machine search
 */

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getDbConnection } from "../../../../../lib/db"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { q, limit = '10' } = req.query as Record<string, string>

    if (!q || q.length < 2) {
      return res.json({ suggestions: [] })
    }

    const client = await getDbConnection()
    const searchTerm = '%' + q + '%'
    const limitNum = Math.min(parseInt(limit), 20)

    // Get manufacturer suggestions
    const mfgResult = await client.query(
      'SELECT DISTINCT manufacturer as value, COUNT(*) as count ' +
      'FROM omex.machines ' +
      'WHERE manufacturer ILIKE $1 ' +
      'GROUP BY manufacturer ' +
      'ORDER BY count DESC ' +
      'LIMIT $2',
      [searchTerm, 5]
    )

    // Get model suggestions
    const modelResult = await client.query(
      'SELECT DISTINCT ' +
      "manufacturer || ' ' || model_code as value, " +
      'manufacturer, model_code, year_from, year_to, engine_model, ' +
      'operating_weight_kg, engine_displacement_cc, notes ' +
      'FROM omex.machines ' +
      'WHERE model_code ILIKE $1 ' +
      "OR (manufacturer || ' ' || model_code) ILIKE $1 " +
      'OR model_family ILIKE $1 ' +
      'ORDER BY manufacturer, model_code ' +
      'LIMIT $2',
      [searchTerm, limitNum]
    )

    // Get serial number suggestions (if query looks like serial)
    let serialResult = { rows: [] as any[] }
    if (q.length >= 3 && /[A-Z0-9]/i.test(q)) {
      serialResult = await client.query(
        'SELECT DISTINCT ' +
        "manufacturer || ' ' || model_code as value, " +
        'manufacturer, model_code, serial_range_start, serial_range_end, year_from, year_to ' +
        'FROM omex.machines ' +
        'WHERE serial_range_start ILIKE $1 ' +
        'OR serial_range_end ILIKE $1 ' +
        'OR ($2 >= serial_range_start AND $2 <= serial_range_end) ' +
        'ORDER BY manufacturer, model_code ' +
        'LIMIT $3',
        [searchTerm, q.toUpperCase(), 5]
      )
    }

    // Get engine suggestions
    const engineResult = await client.query(
      'SELECT DISTINCT engine_model as value, COUNT(*) as count ' +
      'FROM omex.machines ' +
      "WHERE engine_model ILIKE $1 AND engine_model IS NOT NULL AND engine_model != '' " +
      'GROUP BY engine_model ' +
      'ORDER BY count DESC ' +
      'LIMIT $2',
      [searchTerm, 5]
    )

    client.release()

    // Combine and format suggestions
    const suggestions = [
      ...mfgResult.rows.map((r: any) => ({
        text: r.value,
        type: 'manufacturer',
        count: parseInt(r.count),
        icon: '🏭'
      })),
      ...modelResult.rows.map((r: any) => ({
        text: r.value,
        type: 'machine',
        manufacturer: r.manufacturer,
        model: r.model_code,
        years: r.year_from ? (r.year_from + '-' + (r.year_to || 'teraz')) : null,
        engine: r.engine_model,
        weight: r.operating_weight_kg ? (r.operating_weight_kg + ' kg') : null,
        displacement: r.engine_displacement_cc ? (r.engine_displacement_cc + ' cc') : null,
        notes: r.notes,
        icon: '🚜'
      })),
      ...serialResult.rows.map((r: any) => ({
        text: r.value + ' (S/N: ' + r.serial_range_start + ')',
        type: 'serial',
        manufacturer: r.manufacturer,
        model: r.model_code,
        serialRange: r.serial_range_start + ' - ' + r.serial_range_end,
        years: r.year_from ? (r.year_from + '-' + (r.year_to || 'teraz')) : null,
        icon: '🔢'
      })),
      ...engineResult.rows.map((r: any) => ({
        text: r.value,
        type: 'engine',
        count: parseInt(r.count),
        icon: '⚙️'
      }))
    ].slice(0, limitNum)

    res.json({ suggestions })
  } catch (error: any) {
    console.error("Error in machine autocomplete:", error)
    res.status(500).json({ error: error.message, suggestions: [] })
  }
}
