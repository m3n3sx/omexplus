import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getDbConnection } from "../../../lib/db"

// Upewnij się że tabela istnieje
async function ensureTable(client: any) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS app_settings (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
      key VARCHAR UNIQUE NOT NULL,
      value JSONB NOT NULL DEFAULT '{}',
      description TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `)
}

// GET /admin/settings - Pobierz ustawienia
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const client = await getDbConnection()
    await ensureTable(client)
    
    const { key } = req.query
    
    if (key) {
      const result = await client.query(
        `SELECT * FROM app_settings WHERE key = $1`,
        [key]
      )
      client.release()
      
      if (result.rows.length > 0) {
        return res.json({ settings: result.rows[0] })
      }
      return res.json({ settings: null })
    }
    
    const result = await client.query(`SELECT * FROM app_settings ORDER BY key`)
    client.release()
    
    res.json({ settings: result.rows })
  } catch (error) {
    console.error('Settings API Error:', error)
    res.status(500).json({ error: 'Failed to fetch settings' })
  }
}

// POST /admin/settings - Zapisz ustawienia
export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const client = await getDbConnection()
    await ensureTable(client)
    
    const { key, value, description } = req.body as any
    
    if (!key) {
      client.release()
      return res.status(400).json({ error: 'Key is required' })
    }
    
    const result = await client.query(
      `INSERT INTO app_settings (key, value, description)
       VALUES ($1, $2, $3)
       ON CONFLICT (key) DO UPDATE SET
         value = EXCLUDED.value,
         description = COALESCE(EXCLUDED.description, app_settings.description),
         updated_at = NOW()
       RETURNING *`,
      [key, JSON.stringify(value || {}), description || null]
    )
    
    client.release()
    res.json({ settings: result.rows[0] })
  } catch (error) {
    console.error('Settings API Error:', error)
    res.status(500).json({ error: 'Failed to save settings' })
  }
}

// DELETE /admin/settings - Usuń ustawienie
export const DELETE = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const client = await getDbConnection()
    const { key } = req.query
    
    if (!key) {
      client.release()
      return res.status(400).json({ error: 'Key is required' })
    }
    
    await client.query(`DELETE FROM app_settings WHERE key = $1`, [key])
    client.release()
    
    res.json({ success: true })
  } catch (error) {
    console.error('Settings API Error:', error)
    res.status(500).json({ error: 'Failed to delete settings' })
  }
}
