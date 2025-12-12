const { Pool } = require('pg')

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'medusa-my-medusa-store',
  user: 'postgres',
  password: 'supersecret',
})

async function checkCategories() {
  try {
    const result = await pool.query(`
      SELECT id, name, handle, parent_category_id
      FROM product_category
      WHERE deleted_at IS NULL AND is_active = true
      ORDER BY name ASC
    `)
    
    console.log('\n=== EXISTING CATEGORIES ===\n')
    result.rows.forEach(cat => {
      console.log(`- ${cat.name} (handle: ${cat.handle})`)
    })
    console.log(`\nTotal: ${result.rows.length} categories\n`)
    
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await pool.end()
  }
}

checkCategories()
