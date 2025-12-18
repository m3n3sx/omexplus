/**
 * Import machine data from CSV to database
 * Updates existing machines with technical specs and OEM part numbers
 */

const { Client } = require('pg')
const fs = require('fs')
const path = require('path')

const CSV_FILE = path.join(__dirname, 'csv/oem_verification_filled_v3.csv')

async function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n').filter(line => line.trim())
  
  // Parse header - simple split for this format
  const headers = lines[0].split(',')
  console.log('Headers:', headers.length, 'columns')
  
  // Parse data rows
  const rows = []
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',')
    const row = {}
    headers.forEach((h, idx) => {
      row[h] = values[idx] || null
    })
    rows.push(row)
  }
  
  return rows
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
    console.log('Connected to database')

    // Parse CSV
    const rows = await parseCSV(CSV_FILE)
    console.log('Parsed', rows.length, 'rows from CSV')

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

    for (const col of newColumns) {
      const colName = col.split(' ')[0]
      try {
        await client.query('ALTER TABLE omex.machines ADD COLUMN IF NOT EXISTS ' + col)
        console.log('Added column:', colName)
      } catch (err) {
        // Column might already exist
      }
    }

    // Update machines with data from CSV
    let updated = 0
    let notFound = 0

    for (const row of rows) {
      const result = await client.query(
        'UPDATE omex.machines SET ' +
        'operating_weight_kg = $3, ' +
        'engine_power_kw = $4, ' +
        'engine_displacement_cc = $5, ' +
        'emission_standard = $6, ' +
        'hydraulic_pressure_bar = $7, ' +
        'fuel_tank_capacity_l = $8, ' +
        'hydraulic_tank_capacity_l = $9, ' +
        'coolant_capacity_l = $10, ' +
        'engine_oil_capacity_l = $11, ' +
        'engine_oil_filter = $12, ' +
        'fuel_filter = $13, ' +
        'fuel_water_separator = $14, ' +
        'air_filter_outer = $15, ' +
        'air_filter_inner = $16, ' +
        'hydraulic_filter = $17, ' +
        'hydraulic_return_filter = $18, ' +
        'pilot_filter = $19, ' +
        'cabin_filter = $20, ' +
        'bucket_cylinder_seal_kit = $21, ' +
        'arm_cylinder_seal_kit = $22, ' +
        'boom_cylinder_seal_kit = $23, ' +
        'swing_motor_seal_kit = $24, ' +
        'top_roller = $25, ' +
        'bottom_roller = $26, ' +
        'sprocket = $27, ' +
        'idler = $28, ' +
        'track_link = $29, ' +
        'track_shoe = $30, ' +
        'track_pin = $31, ' +
        'track_bushing = $32, ' +
        'bucket_tooth = $33, ' +
        'tooth_adapter = $34, ' +
        'side_cutter = $35, ' +
        'cutting_edge = $36 ' +
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
          row.engine_oil_filter || null,
          row.fuel_filter || null,
          row.fuel_water_separator || null,
          row.air_filter_outer || null,
          row.air_filter_inner || null,
          row.hydraulic_filter || null,
          row.hydraulic_return_filter || null,
          row.pilot_filter || null,
          row.cabin_filter || null,
          row.bucket_cylinder_seal_kit || null,
          row.arm_cylinder_seal_kit || null,
          row.boom_cylinder_seal_kit || null,
          row.swing_motor_seal_kit || null,
          row.top_roller || null,
          row.bottom_roller || null,
          row.sprocket || null,
          row.idler || null,
          row.track_link || null,
          row.track_shoe || null,
          row.track_pin || null,
          row.track_bushing || null,
          row.bucket_tooth || null,
          row.tooth_adapter || null,
          row.side_cutter || null,
          row.cutting_edge || null
        ]
      )

      if (result.rowCount > 0) {
        updated++
      } else {
        notFound++
        console.log('Not found:', row.manufacturer, row.model_code)
      }
    }

    console.log('\\n=== IMPORT COMPLETE ===')
    console.log('Updated:', updated)
    console.log('Not found:', notFound)

    // Show sample of updated data
    const sample = await client.query(
      'SELECT manufacturer, model_code, operating_weight_kg, engine_power_kw, ' +
      'engine_oil_filter, fuel_filter, bucket_tooth ' +
      'FROM omex.machines ' +
      'WHERE engine_oil_filter IS NOT NULL ' +
      'LIMIT 10'
    )
    console.log('\\nSample updated machines:')
    console.table(sample.rows)

  } catch (err) {
    console.error('Error:', err)
  } finally {
    await client.end()
  }
}

importData()
