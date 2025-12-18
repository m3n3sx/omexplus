/**
 * Import machine data from multiple CSV files to database
 */

const { Client } = require('pg')
const fs = require('fs')
const path = require('path')

// Files to import
const DISPLACEMENT_FILE = path.join(__dirname, 'csv/oem_verification_filled_v3.csv')
const OEM_FILE = path.join(__dirname, 'csv/maszyny_budowlane_comprehensive_data.csv')

function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n').filter(line => line.trim())
  
  // Check if file uses quotes
  const hasQuotes = lines[0].includes('"')
  
  let headers
  if (hasQuotes) {
    headers = parseQuotedLine(lines[0])
  } else {
    headers = lines[0].split(',')
  }
  
  console.log('File:', path.basename(filePath))
  console.log('Headers:', headers.length, 'columns')
  
  const rows = []
  for (let i = 1; i < lines.length; i++) {
    let values
    if (hasQuotes) {
      values = parseQuotedLine(lines[i])
    } else {
      values = lines[i].split(',')
    }
    
    const row = {}
    headers.forEach((h, idx) => {
      row[h] = values[idx] || null
    })
    rows.push(row)
  }
  
  console.log('Rows:', rows.length)
  return rows
}

function parseQuotedLine(line) {
  const result = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  result.push(current.trim())
  return result
}

async function importData() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'medusa_db'
  })

  try {
    await client.connect()
    console.log('Connected to database\n')

    // Add new columns if they don't exist
    const newColumns = [
      'operating_weight_kg INTEGER',
      'engine_power_kw DECIMAL(10,2)',
      'engine_displacement_cc INTEGER',
      'emission_standard VARCHAR(50)',
      'hydraulic_pressure_bar INTEGER',
      'fuel_tank_capacity_l DECIMAL(10,2)',
      'hydraulic_tank_capacity_l DECIMAL(10,2)',
      'coolant_capacity_l DECIMAL(10,2)',
      'engine_oil_capacity_l DECIMAL(10,2)',
      'engine_oil_filter VARCHAR(100)',
      'fuel_filter VARCHAR(100)',
      'fuel_water_separator VARCHAR(100)',
      'air_filter_outer VARCHAR(100)',
      'air_filter_inner VARCHAR(100)',
      'hydraulic_filter VARCHAR(100)',
      'hydraulic_return_filter VARCHAR(100)',
      'pilot_filter VARCHAR(100)',
      'cabin_filter VARCHAR(100)',
      'bucket_cylinder_seal_kit VARCHAR(100)',
      'arm_cylinder_seal_kit VARCHAR(100)',
      'boom_cylinder_seal_kit VARCHAR(100)',
      'swing_motor_seal_kit VARCHAR(100)',
      'top_roller VARCHAR(100)',
      'bottom_roller VARCHAR(100)',
      'sprocket VARCHAR(100)',
      'idler VARCHAR(100)',
      'track_link VARCHAR(100)',
      'track_shoe VARCHAR(100)',
      'track_pin VARCHAR(100)',
      'track_bushing VARCHAR(100)',
      'bucket_tooth VARCHAR(100)',
      'tooth_adapter VARCHAR(100)',
      'side_cutter VARCHAR(100)',
      'cutting_edge VARCHAR(100)'
    ]

    console.log('Adding columns...')
    for (const col of newColumns) {
      try {
        await client.query('ALTER TABLE omex.machines ADD COLUMN IF NOT EXISTS ' + col)
      } catch (err) {}
    }
    console.log('Columns ready\n')

    // STEP 1: Import displacement data from large file
    console.log('=== STEP 1: Import displacement data ===')
    const dispRows = parseCSV(DISPLACEMENT_FILE)
    let dispUpdated = 0
    
    for (const row of dispRows) {
      if (row.engine_displacement_cc) {
        const result = await client.query(
          'UPDATE omex.machines SET ' +
          'operating_weight_kg = COALESCE($3, operating_weight_kg), ' +
          'engine_displacement_cc = COALESCE($4, engine_displacement_cc) ' +
          'WHERE manufacturer = $1 AND model_code = $2',
          [
            row.manufacturer,
            row.model_code,
            row.operating_weight_kg ? parseInt(row.operating_weight_kg) : null,
            row.engine_displacement_cc ? parseInt(parseFloat(row.engine_displacement_cc)) : null
          ]
        )
        if (result.rowCount > 0) dispUpdated++
      }
    }
    console.log('Displacement updated:', dispUpdated, '\n')

    // STEP 2: Import OEM data from comprehensive file
    console.log('=== STEP 2: Import OEM part numbers ===')
    const oemRows = parseCSV(OEM_FILE)
    let oemUpdated = 0
    
    for (const row of oemRows) {
      const result = await client.query(
        'UPDATE omex.machines SET ' +
        'operating_weight_kg = COALESCE($3, operating_weight_kg), ' +
        'engine_power_kw = COALESCE($4, engine_power_kw), ' +
        'engine_displacement_cc = COALESCE($5, engine_displacement_cc), ' +
        'emission_standard = COALESCE($6, emission_standard), ' +
        'hydraulic_pressure_bar = COALESCE($7, hydraulic_pressure_bar), ' +
        'fuel_tank_capacity_l = COALESCE($8, fuel_tank_capacity_l), ' +
        'hydraulic_tank_capacity_l = COALESCE($9, hydraulic_tank_capacity_l), ' +
        'coolant_capacity_l = COALESCE($10, coolant_capacity_l), ' +
        'engine_oil_capacity_l = COALESCE($11, engine_oil_capacity_l), ' +
        'engine_oil_filter = COALESCE(NULLIF($12, \'\'), engine_oil_filter), ' +
        'fuel_filter = COALESCE(NULLIF($13, \'\'), fuel_filter), ' +
        'fuel_water_separator = COALESCE(NULLIF($14, \'\'), fuel_water_separator), ' +
        'air_filter_outer = COALESCE(NULLIF($15, \'\'), air_filter_outer), ' +
        'air_filter_inner = COALESCE(NULLIF($16, \'\'), air_filter_inner), ' +
        'hydraulic_filter = COALESCE(NULLIF($17, \'\'), hydraulic_filter), ' +
        'bucket_cylinder_seal_kit = COALESCE(NULLIF($18, \'\'), bucket_cylinder_seal_kit), ' +
        'bucket_tooth = COALESCE(NULLIF($19, \'\'), bucket_tooth) ' +
        'WHERE manufacturer = $1 AND model_code = $2',
        [
          row.manufacturer,
          row.model_code,
          row.operating_weight_kg ? parseInt(row.operating_weight_kg) : null,
          row.engine_power_kw ? parseFloat(row.engine_power_kw) : null,
          row.engine_displacement_cc ? parseInt(row.engine_displacement_cc) : null,
          row.emission_standard || null,
          row.hydraulic_pressure_bar ? parseInt(row.hydraulic_pressure_bar) : null,
          row.fuel_tank_capacity_l ? parseFloat(row.fuel_tank_capacity_l) : null,
          row.hydraulic_tank_capacity_l ? parseFloat(row.hydraulic_tank_capacity_l) : null,
          row.coolant_capacity_l ? parseFloat(row.coolant_capacity_l) : null,
          row.engine_oil_capacity_l ? parseFloat(row.engine_oil_capacity_l) : null,
          row.engine_oil_filter || '',
          row.fuel_filter || '',
          row.fuel_water_separator || '',
          row.air_filter_outer || '',
          row.air_filter_inner || '',
          row.hydraulic_filter || '',
          row.bucket_cylinder_seal_kit || '',
          row.bucket_tooth || ''
        ]
      )
      if (result.rowCount > 0) oemUpdated++
    }
    console.log('OEM data updated:', oemUpdated, '\n')

    // Show summary
    const stats = await client.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(operating_weight_kg) as with_weight,
        COUNT(engine_displacement_cc) as with_displacement,
        COUNT(engine_oil_filter) as with_oil_filter,
        COUNT(fuel_filter) as with_fuel_filter
      FROM omex.machines
    `)
    
    console.log('=== DATABASE SUMMARY ===')
    console.log('Total machines:', stats.rows[0].total)
    console.log('With weight:', stats.rows[0].with_weight)
    console.log('With displacement:', stats.rows[0].with_displacement)
    console.log('With oil filter:', stats.rows[0].with_oil_filter)
    console.log('With fuel filter:', stats.rows[0].with_fuel_filter)

    // Sample data
    const sample = await client.query(`
      SELECT manufacturer, model_code, operating_weight_kg, 
             engine_displacement_cc, engine_oil_filter, fuel_filter
      FROM omex.machines 
      WHERE engine_oil_filter IS NOT NULL
      LIMIT 10
    `)
    console.log('\nSample machines with OEM data:')
    console.table(sample.rows)

  } catch (err) {
    console.error('Error:', err)
  } finally {
    await client.end()
  }
}

importData()
