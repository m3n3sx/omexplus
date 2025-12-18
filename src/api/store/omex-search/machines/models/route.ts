/**
 * Machine Models API
 * GET /store/omex-search/machines/models
 * 
 * Returns list of models for a given manufacturer and type
 */

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getDbConnection } from "../../../../../lib/db"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { manufacturer, type } = req.query as Record<string, string>
    const client = await getDbConnection()

    let query = `
      SELECT 
        id,
        model_code,
        year_from,
        year_to,
        engine_model,
        serial_range_start,
        serial_range_end,
        operating_weight_kg,
        engine_displacement_cc,
        notes
      FROM omex.machines
      WHERE 1=1
    `
    
    const params: any[] = []
    let paramIndex = 1

    if (manufacturer) {
      query += ' AND manufacturer = $' + paramIndex++
      params.push(manufacturer)
    }

    // Filter by type based on notes field
    if (type) {
      const typeMap: Record<string, string> = {
        'Mini koparka': '%mini_excavator%',
        'Koparka': '%excavator%',
        'Koparka kołowa': '%wheeled_excavator%',
        'Ładowarka kołowa': '%wheel_loader%',
        'Ładowarka kompaktowa': '%skid_steer%',
        'Ładowarka gąsienicowa': '%compact_track%',
        'Ładowarka teleskopowa': '%telehandler%',
        'Koparka-ładowarka': '%backhoe%',
        'Spychacz': '%dozer%',
        'Ładowarka': '%loader%'
      }
      
      if (typeMap[type]) {
        query += ' AND notes ILIKE $' + paramIndex++
        params.push(typeMap[type])
      }
    }

    query += ' ORDER BY model_code'

    const result = await client.query(query, params)
    client.release()

    res.json({
      models: result.rows.map((r: any) => ({
        id: r.id,
        name: r.model_code,
        code: r.model_code,
        years: r.year_from ? (r.year_from + '-' + (r.year_to || 'teraz')) : null,
        weight: r.operating_weight_kg ? (r.operating_weight_kg + ' kg') : null,
        engine: r.engine_model,
        displacement: r.engine_displacement_cc ? (r.engine_displacement_cc + ' cc') : null,
        serialRange: r.serial_range_start ? (r.serial_range_start + ' - ' + r.serial_range_end) : null
      }))
    })
  } catch (error: any) {
    console.error("Error fetching models:", error)
    res.status(500).json({ error: error.message })
  }
}
