/**
 * Machine Search API
 * GET /store/omex-search/machines
 * 
 * Search machines by manufacturer, model, serial number
 * Returns matching machines and compatible parts
 */

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getDbConnection } from "../../../../lib/db"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { 
      q,           // General search query
      manufacturer,
      model,
      serial,      // Serial number
      limit = '20',
      offset = '0'
    } = req.query as Record<string, string>

    const client = await getDbConnection()
    
    let whereClause = 'WHERE 1=1'
    const params: any[] = []
    let paramIndex = 1

    // Search by manufacturer
    if (manufacturer) {
      whereClause += ' AND manufacturer ILIKE $' + paramIndex++
      params.push('%' + manufacturer + '%')
    }

    // Search by model
    if (model) {
      whereClause += ' AND (model_code ILIKE $' + paramIndex + ' OR model_family ILIKE $' + paramIndex + ')'
      params.push('%' + model + '%')
      paramIndex++
    }

    // Search by serial number (check if within range)
    if (serial) {
      whereClause += ' AND (serial_range_start <= $' + paramIndex + ' AND serial_range_end >= $' + paramIndex
      whereClause += ' OR serial_range_start ILIKE $' + (paramIndex + 1)
      whereClause += ' OR serial_range_end ILIKE $' + (paramIndex + 1) + ')'
      params.push(serial.toUpperCase())
      params.push('%' + serial + '%')
      paramIndex += 2
    }

    // General search query (searches across all fields)
    if (q) {
      whereClause += ' AND (manufacturer ILIKE $' + paramIndex
      whereClause += ' OR model_code ILIKE $' + paramIndex
      whereClause += ' OR model_family ILIKE $' + paramIndex
      whereClause += ' OR engine_model ILIKE $' + paramIndex
      whereClause += ' OR serial_range_start ILIKE $' + paramIndex
      whereClause += ' OR serial_range_end ILIKE $' + paramIndex
      whereClause += ' OR notes ILIKE $' + paramIndex + ')'
      params.push('%' + q + '%')
      paramIndex++
    }

    // Get total count
    const countResult = await client.query(
      'SELECT COUNT(*) FROM omex.machines ' + whereClause,
      params
    )
    const total = parseInt(countResult.rows[0].count)

    // Get machines with pagination
    const limitIdx = paramIndex++
    const offsetIdx = paramIndex
    const result = await client.query(
      'SELECT id, manufacturer, model_code, model_family, ' +
      'serial_range_start, serial_range_end, ' +
      'year_from, year_to, engine_manufacturer, engine_model, ' +
      'operating_weight_kg, engine_power_kw, engine_displacement_cc, ' +
      'emission_standard, hydraulic_pressure_bar, ' +
      'fuel_tank_capacity_l, hydraulic_tank_capacity_l, ' +
      'engine_oil_filter, fuel_filter, hydraulic_filter, ' +
      'data_source, notes ' +
      'FROM omex.machines ' +
      whereClause +
      ' ORDER BY manufacturer, model_code' +
      ' LIMIT $' + limitIdx + ' OFFSET $' + offsetIdx,
      [...params, parseInt(limit), parseInt(offset)]
    )

    // Get unique manufacturers for filters
    const mfgResult = await client.query(
      'SELECT DISTINCT manufacturer, COUNT(*) as count ' +
      'FROM omex.machines ' +
      'GROUP BY manufacturer ' +
      'ORDER BY count DESC'
    )

    client.release()

    res.json({
      machines: result.rows,
      manufacturers: mfgResult.rows,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset),
      query: { q, manufacturer, model, serial }
    })
  } catch (error: any) {
    console.error("Error searching machines:", error)
    res.status(500).json({ error: error.message })
  }
}
