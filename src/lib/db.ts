/**
 * Database connection utility for direct PostgreSQL queries
 * Used for custom omex schema tables
 */

import { Pool, PoolClient } from 'pg'

let pool: Pool | null = null

function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      database: 'medusa_db',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'postgres',
      port: parseInt(process.env.DB_PORT || '5432'),
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    })

    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err)
    })
  }
  return pool
}

export async function getDbConnection(): Promise<PoolClient> {
  const pool = getPool()
  return pool.connect()
}

export async function query(text: string, params?: any[]) {
  const client = await getDbConnection()
  try {
    const result = await client.query(text, params)
    return result
  } finally {
    client.release()
  }
}

export default { getDbConnection, query }
