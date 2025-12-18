const { Client } = require('pg')

const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost/medusa_db'
})

async function checkStructure() {
  try {
    await client.connect()
    
    // Check fulfillment table structure
    const result = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'fulfillment'
      ORDER BY ordinal_position
    `)
    
    console.log('Fulfillment table columns:')
    result.rows.forEach(row => {
      console.log(`  ${row.column_name}: ${row.data_type}`)
    })
    
    // Check order_fulfillment link table
    const linkResult = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'order_fulfillment'
      ORDER BY ordinal_position
    `)
    
    console.log('\nOrder_fulfillment table columns:')
    linkResult.rows.forEach(row => {
      console.log(`  ${row.column_name}: ${row.data_type}`)
    })
    
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await client.end()
  }
}

checkStructure()
