/**
 * Machine Types API
 * GET /store/omex-search/machines/types
 * 
 * Returns list of machine types for a given manufacturer
 */

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getDbConnection } from "../../../../../lib/db"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { manufacturer } = req.query as Record<string, string>
    const client = await getDbConnection()

    let query = `
      SELECT DISTINCT
        CASE 
          WHEN notes ILIKE '%mini_excavator%' THEN 'Mini koparka'
          WHEN notes ILIKE '%excavator%' THEN 'Koparka'
          WHEN notes ILIKE '%wheeled_excavator%' THEN 'Koparka kołowa'
          WHEN notes ILIKE '%wheel_loader%' THEN 'Ładowarka kołowa'
          WHEN notes ILIKE '%skid_steer%' THEN 'Ładowarka kompaktowa'
          WHEN notes ILIKE '%compact_track%' THEN 'Ładowarka gąsienicowa'
          WHEN notes ILIKE '%telehandler%' THEN 'Ładowarka teleskopowa'
          WHEN notes ILIKE '%backhoe%' THEN 'Koparka-ładowarka'
          WHEN notes ILIKE '%dozer%' THEN 'Spychacz'
          WHEN notes ILIKE '%loader%' THEN 'Ładowarka'
          ELSE 'Inne'
        END as type_name,
        COUNT(*) as count
      FROM omex.machines
    `
    
    const params: any[] = []
    if (manufacturer) {
      query += ' WHERE manufacturer = $1'
      params.push(manufacturer)
    }
    
    query += ` GROUP BY type_name ORDER BY count DESC`

    const result = await client.query(query, params)
    client.release()

    // Map to standard codes
    const typeCodeMap: Record<string, string> = {
      'Mini koparka': 'MIN',
      'Koparka': 'EXC',
      'Koparka kołowa': 'WHL',
      'Ładowarka kołowa': 'WLD',
      'Ładowarka kompaktowa': 'SSL',
      'Ładowarka gąsienicowa': 'CTL',
      'Ładowarka teleskopowa': 'TEL',
      'Koparka-ładowarka': 'BHL',
      'Spychacz': 'DOZ',
      'Ładowarka': 'LDR',
      'Inne': 'OTH'
    }

    res.json({
      types: result.rows.map((r: any) => ({
        id: r.type_name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        name: r.type_name,
        code: typeCodeMap[r.type_name] || 'OTH',
        count: parseInt(r.count)
      }))
    })
  } catch (error: any) {
    console.error("Error fetching types:", error)
    res.status(500).json({ error: error.message })
  }
}
