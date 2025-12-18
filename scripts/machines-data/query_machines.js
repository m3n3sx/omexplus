const { Client } = require('pg');

async function run() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'medusa_db'
  });

  try {
    await client.connect();
    const res = await client.query(`
      SELECT manufacturer, COUNT(*) as count 
      FROM omex.machines 
      GROUP BY manufacturer 
      ORDER BY count DESC
    `);
    
    const fs = require('fs');
    fs.writeFileSync('/tmp/machines_count.json', JSON.stringify(res.rows, null, 2));
    console.log('Saved to /tmp/machines_count.json');
    console.log('Total manufacturers:', res.rows.length);
    console.log('Total machines:', res.rows.reduce((sum, r) => sum + parseInt(r.count), 0));
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

run();
