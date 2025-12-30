/**
 * AI Enrichment API for Machine Data
 * POST /admin/machines/:id/enrich - Enrich machine data using AI
 */

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getDbConnection } from "../../../../../lib/db"

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const callGemini = async (apiKey: string, prompt: string, retries = 3): Promise<any> => {
  // Use Gemini 2.0 Flash with Google Search grounding for real-time data
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`
  
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          tools: [{
            googleSearch: {}
          }],
          generationConfig: {
            maxOutputTokens: 8192
          }
        })
      })

      if (response.status === 429) {
        const waitTime = 5000 * Math.pow(2, i)
        console.log(`Rate limited, waiting ${waitTime}ms`)
        await delay(waitTime)
        continue
      }

      if (!response.ok) {
        const errText = await response.text()
        console.error(`Gemini API error: ${response.status}`, errText)
        throw new Error(`Gemini API error: ${response.status}`)
      }

      const data = await response.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text
      console.log("Gemini raw response:", text?.substring(0, 500))
      
      if (text) {
        // Try to extract JSON from the response
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          try {
            return JSON.parse(jsonMatch[0])
          } catch (e) {
            console.error("JSON parse error:", e)
          }
        }
      }
      return null
    } catch (e: any) {
      console.error(`Gemini call error (attempt ${i+1}):`, e.message)
      if (i === retries - 1) throw e
      await delay(3000)
    }
  }
  return null
}

// Clean part number - return "000" if invalid
const cleanPartNumber = (val: any): string | null => {
  if (!val || typeof val !== 'string') return null
  const trimmed = val.trim()
  if (trimmed === 'null' || trimmed === '' || trimmed === '000') return null
  // If it's a long description (more than 30 chars or more than 3 words), return "000"
  if (trimmed.length > 30 || trimmed.split(' ').length > 3) return "000"
  // If contains common description words, return "000"
  const descWords = ['check', 'consult', 'needed', 'search', 'example', 'contact', 'verify', 'confirm', 'catalog', 'dealer']
  if (descWords.some(w => trimmed.toLowerCase().includes(w))) return "000"
  return trimmed
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { id } = req.params
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY not configured" })
    }

    const client = await getDbConnection()

    // Get current machine data
    const machineResult = await client.query(
      `SELECT * FROM omex.machines WHERE id = $1`,
      [id]
    )

    if (machineResult.rows.length === 0) {
      client.release()
      return res.status(404).json({ error: "Machine not found" })
    }

    const machine = machineResult.rows[0]
    const machineInfo = `${machine.manufacturer} ${machine.model_code}`

    let enrichedData: any = { specs: {}, filters: {}, engine: {}, cooling: {}, hydraulic: {}, seals: {}, pins: {}, undercarriage: {}, electrical: {}, ac: {} }

    // Stage 1: Get specifications
    try {
      enrichedData.specs = await callGemini(apiKey, `Search for technical specifications of ${machineInfo} ${machine.year_from || ''} construction machine.

Return JSON only with numeric values:
{
  "operating_weight_kg": number or null,
  "engine_power_kw": number or null,
  "engine_displacement_cc": number or null,
  "emission_standard": "string or null",
  "hydraulic_pressure_bar": number or null,
  "fuel_tank_capacity_l": number or null,
  "hydraulic_tank_capacity_l": number or null,
  "coolant_capacity_l": number or null,
  "engine_oil_capacity_l": number or null
}`) || {}
    } catch (e) {
      console.error("Specs error:", e)
    }

    await delay(2000)

    // Stage 2: Get filters
    try {
      enrichedData.filters = await callGemini(apiKey, `Search for "${machineInfo} filter part numbers OEM catalog".

Return JSON with ONLY real OEM part numbers (format like "32/925694", "600-311-3620", "P550148"). 
If you cannot find a real part number, use "000" instead of description:
{
  "engine_oil_filter": "part number or 000",
  "fuel_filter": "part number or 000",
  "fuel_water_separator": "part number or 000",
  "air_filter_outer": "part number or 000",
  "air_filter_inner": "part number or 000",
  "hydraulic_filter": "part number or 000",
  "hydraulic_return_filter": "part number or 000",
  "pilot_filter": "part number or 000",
  "cabin_filter": "part number or 000"
}`) || {}
    } catch (e) {
      console.error("Filters error:", e)
    }

    await delay(2000)

    // Stage 3: Get engine parts
    try {
      enrichedData.engine = await callGemini(apiKey, `Search for "${machineInfo} engine parts OEM part numbers".

Return JSON with ONLY real OEM part numbers. Use "000" if no real number found:
{
  "starter_motor": "part number or 000",
  "alternator": "part number or 000",
  "water_pump": "part number or 000",
  "thermostat": "part number or 000",
  "turbocharger": "part number or 000",
  "injector": "part number or 000",
  "injection_pump": "part number or 000",
  "drive_belt": "part number or 000",
  "fan_belt": "part number or 000"
}`) || {}
    } catch (e) {
      console.error("Engine error:", e)
    }

    await delay(2000)

    // Stage 4: Get cooling system
    try {
      enrichedData.cooling = await callGemini(apiKey, `Search for "${machineInfo} cooling system parts OEM numbers".

Return JSON with ONLY real OEM part numbers. Use "000" if no real number found:
{
  "radiator": "part number or 000",
  "radiator_hose_upper": "part number or 000",
  "radiator_hose_lower": "part number or 000",
  "oil_cooler": "part number or 000"
}`) || {}
    } catch (e) {
      console.error("Cooling error:", e)
    }

    await delay(2000)

    // Stage 5: Get hydraulic system
    try {
      enrichedData.hydraulic = await callGemini(apiKey, `Search for "${machineInfo} hydraulic pump motor parts OEM numbers".

Return JSON with ONLY real OEM part numbers. Use "000" if no real number found:
{
  "main_hydraulic_pump": "part number or 000",
  "pilot_pump": "part number or 000",
  "control_valve": "part number or 000",
  "swing_motor": "part number or 000",
  "travel_motor": "part number or 000",
  "final_drive": "part number or 000"
}`) || {}
    } catch (e) {
      console.error("Hydraulic error:", e)
    }

    await delay(2000)

    // Stage 6: Get seals
    try {
      enrichedData.seals = await callGemini(apiKey, `Search for "${machineInfo} cylinder seal kit OEM part numbers".

Return JSON with ONLY real OEM part numbers. Use "000" if no real number found:
{
  "bucket_cylinder_seal_kit": "part number or 000",
  "arm_cylinder_seal_kit": "part number or 000",
  "boom_cylinder_seal_kit": "part number or 000",
  "swing_motor_seal_kit": "part number or 000"
}`) || {}
    } catch (e) {
      console.error("Seals error:", e)
    }

    await delay(2000)

    // Stage 7: Get pins and bushings
    try {
      enrichedData.pins = await callGemini(apiKey, `Search for "${machineInfo} pins bushings slew bearing OEM part numbers".

Return JSON with ONLY real OEM part numbers. Use "000" if no real number found:
{
  "slew_bearing": "part number or 000",
  "boom_pin": "part number or 000",
  "arm_pin": "part number or 000",
  "bucket_pin": "part number or 000",
  "boom_bushing": "part number or 000",
  "arm_bushing": "part number or 000",
  "bucket_bushing": "part number or 000"
}`) || {}
    } catch (e) {
      console.error("Pins error:", e)
    }

    await delay(2000)

    // Stage 8: Get undercarriage
    try {
      enrichedData.undercarriage = await callGemini(apiKey, `Search for "${machineInfo} undercarriage parts OEM numbers roller sprocket idler".

Return JSON with ONLY real OEM part numbers. Use "000" if no real number found:
{
  "top_roller": "part number or 000",
  "bottom_roller": "part number or 000",
  "sprocket": "part number or 000",
  "idler": "part number or 000",
  "track_chain": "part number or 000"
}`) || {}
    } catch (e) {
      console.error("Undercarriage error:", e)
    }

    await delay(2000)

    // Stage 9: Get electrical
    try {
      enrichedData.electrical = await callGemini(apiKey, `Search for "${machineInfo} electrical sensors lights OEM part numbers".

Return JSON with ONLY real OEM part numbers. Use "000" if no real number found:
{
  "oil_pressure_sensor": "part number or 000",
  "water_temp_sensor": "part number or 000",
  "fuel_level_sensor": "part number or 000",
  "hydraulic_temp_sensor": "part number or 000",
  "work_lights": "part number or 000",
  "wiper_motor": "part number or 000",
  "wiper_blades": "part number or 000"
}`) || {}
    } catch (e) {
      console.error("Electrical error:", e)
    }

    await delay(2000)

    // Stage 10: Get AC and wear parts
    try {
      enrichedData.ac = await callGemini(apiKey, `Search for "${machineInfo} AC compressor condenser bucket teeth OEM part numbers".

Return JSON with ONLY real OEM part numbers. Use "000" if no real number found:
{
  "ac_compressor": "part number or 000",
  "condenser": "part number or 000",
  "bucket_teeth": "part number or 000",
  "bucket_adapter": "part number or 000",
  "cutting_edge": "part number or 000",
  "side_cutters": "part number or 000"
}`) || {}
    } catch (e) {
      console.error("AC/Wear error:", e)
    }

    // Log raw data for debugging
    console.log("Enriched data from Gemini:", JSON.stringify(enrichedData, null, 2))

    // Build update query
    const updates: string[] = []
    const values: any[] = []
    let paramIndex = 1

    // Specs
    const specFields = ['operating_weight_kg', 'engine_power_kw', 'engine_displacement_cc', 
      'emission_standard', 'hydraulic_pressure_bar', 'fuel_tank_capacity_l',
      'hydraulic_tank_capacity_l', 'coolant_capacity_l', 'engine_oil_capacity_l']
    
    for (const field of specFields) {
      if (enrichedData.specs[field] && enrichedData.specs[field] !== 'null' && enrichedData.specs[field] !== null) {
        console.log(`Adding spec field: ${field} = ${enrichedData.specs[field]}`)
        updates.push(`${field} = $${paramIndex++}`)
        values.push(enrichedData.specs[field])
      }
    }

    // All part categories
    const partCategories = [
      { data: enrichedData.filters, fields: ['engine_oil_filter', 'fuel_filter', 'fuel_water_separator', 'air_filter_outer', 'air_filter_inner', 'hydraulic_filter', 'hydraulic_return_filter', 'pilot_filter', 'cabin_filter'] },
      { data: enrichedData.engine, fields: ['starter_motor', 'alternator', 'water_pump', 'thermostat', 'turbocharger', 'injector', 'injection_pump', 'drive_belt', 'fan_belt'] },
      { data: enrichedData.cooling, fields: ['radiator', 'radiator_hose_upper', 'radiator_hose_lower', 'oil_cooler'] },
      { data: enrichedData.hydraulic, fields: ['main_hydraulic_pump', 'pilot_pump', 'control_valve', 'swing_motor', 'travel_motor', 'final_drive'] },
      { data: enrichedData.seals, fields: ['bucket_cylinder_seal_kit', 'arm_cylinder_seal_kit', 'boom_cylinder_seal_kit', 'swing_motor_seal_kit'] },
      { data: enrichedData.pins, fields: ['slew_bearing', 'boom_pin', 'arm_pin', 'bucket_pin', 'boom_bushing', 'arm_bushing', 'bucket_bushing'] },
      { data: enrichedData.undercarriage, fields: ['top_roller', 'bottom_roller', 'sprocket', 'idler', 'track_chain'] },
      { data: enrichedData.electrical, fields: ['oil_pressure_sensor', 'water_temp_sensor', 'fuel_level_sensor', 'hydraulic_temp_sensor', 'work_lights', 'wiper_motor', 'wiper_blades'] },
      { data: enrichedData.ac, fields: ['ac_compressor', 'condenser', 'bucket_teeth', 'bucket_adapter', 'cutting_edge', 'side_cutters'] }
    ]

    for (const category of partCategories) {
      for (const field of category.fields) {
        const cleanedValue = cleanPartNumber(category.data?.[field])
        if (cleanedValue) {
          console.log(`Adding part field: ${field} = ${cleanedValue}`)
          updates.push(`${field} = $${paramIndex++}`)
          values.push(cleanedValue)
        }
      }
    }

    console.log(`Total updates: ${updates.length}, values: ${values.length}`)

    updates.push(`updated_at = NOW()`)
    updates.push(`data_source = $${paramIndex++}`)
    values.push('ai_enriched')
    values.push(id)

    if (updates.length > 2) {
      await client.query(
        `UPDATE omex.machines SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
        values
      )
    }

    // Get updated machine
    const updatedResult = await client.query(
      `SELECT * FROM omex.machines WHERE id = $1`,
      [id]
    )

    client.release()

    res.json({
      success: true,
      machine: updatedResult.rows[0],
      enrichedFields: updates.length - 2,
      rawData: enrichedData
    })

  } catch (error: any) {
    console.error("Error enriching machine:", error)
    res.status(500).json({ error: error.message })
  }
}
