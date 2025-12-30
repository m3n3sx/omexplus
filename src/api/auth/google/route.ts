import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getDbConnection } from "../../../lib/db"

// Weryfikuj token Google
async function verifyGoogleToken(token: string): Promise<any> {
  try {
    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`)
    if (!response.ok) {
      throw new Error('Invalid token')
    }
    return await response.json()
  } catch (error) {
    console.error('Google token verification failed:', error)
    throw new Error('Failed to verify Google token')
  }
}

// POST /auth/google - Logowanie/rejestracja przez Google
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const { credential, type = 'customer' } = req.body as { credential: string; type?: 'customer' | 'admin' }
    
    if (!credential) {
      res.status(400).json({ error: 'Missing Google credential' })
      return
    }

    // Weryfikuj token Google
    const googleUser = await verifyGoogleToken(credential)
    
    if (!googleUser.email) {
      res.status(400).json({ error: 'No email in Google account' })
      return
    }

    const client = await getDbConnection()
    
    let user: any = null
    
    if (type === 'admin') {
      // Dla admin - sprawdź w tabeli users (pracownicy)
      const result = await client.query(
        `SELECT * FROM "user" WHERE email = $1`,
        [googleUser.email]
      )
      
      if (result.rows.length > 0) {
        user = result.rows[0]
      } else {
        client.release()
        res.status(403).json({ 
          error: 'Brak dostępu. Skontaktuj się z administratorem aby uzyskać dostęp do panelu.',
          email: googleUser.email
        })
        return
      }
    } else {
      // Dla klientów - sprawdź w tabeli customer
      const result = await client.query(
        `SELECT * FROM customer WHERE email = $1`,
        [googleUser.email]
      )
      
      if (result.rows.length > 0) {
        user = result.rows[0]
        // Aktualizuj dane z Google
        await client.query(
          `UPDATE customer SET 
            first_name = COALESCE(NULLIF($2, ''), first_name),
            last_name = COALESCE(NULLIF($3, ''), last_name),
            metadata = jsonb_set(COALESCE(metadata, '{}'), '{google_id}', $4::jsonb),
            updated_at = NOW()
          WHERE id = $5`,
          [
            googleUser.given_name || '',
            googleUser.family_name || '',
            JSON.stringify(googleUser.sub),
            user.id
          ]
        )
      } else {
        // Utwórz nowego klienta
        const insertResult = await client.query(
          `INSERT INTO customer (email, first_name, last_name, has_account, metadata)
           VALUES ($1, $2, $3, true, $4)
           RETURNING *`,
          [
            googleUser.email,
            googleUser.given_name || '',
            googleUser.family_name || '',
            JSON.stringify({ google_id: googleUser.sub, picture: googleUser.picture })
          ]
        )
        user = insertResult.rows[0]
      }
    }
    
    client.release()
    
    if (!user) {
      res.status(500).json({ error: 'Failed to get or create user' })
      return
    }
    
    // Generuj token sesji
    const sessionToken = Buffer.from(JSON.stringify({
      id: user.id,
      email: user.email,
      type,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 dni
    })).toString('base64')
    
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name || googleUser.given_name || '',
        last_name: user.last_name || googleUser.family_name || '',
        picture: googleUser.picture,
        role: user.role || 'customer'
      },
      token: sessionToken
    })
  } catch (error: any) {
    console.error('Google auth error:', error)
    res.status(500).json({ error: error.message || 'Authentication failed' })
  }
}
