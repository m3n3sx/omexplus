import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getDbConnection } from "../../../lib/db"

type Locale = 'pl' | 'en' | 'de' | 'uk'

const SUPPORTED_LOCALES: Locale[] = ['pl', 'en', 'de', 'uk']

// GET /public/translations - pobierz tłumaczenia
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const { type, entity_id, locale } = req.query as {
      type?: 'product' | 'category'
      entity_id?: string
      locale?: Locale
    }

    const client = await getDbConnection()
    let result: any = {}

    if (type === 'product' && entity_id) {
      if (locale) {
        const queryResult = await client.query(
          `SELECT * FROM product_translation WHERE product_id = $1 AND locale = $2 LIMIT 1`,
          [entity_id, locale]
        )
        result = { translation: queryResult.rows[0] || null }
      } else {
        const queryResult = await client.query(
          `SELECT * FROM product_translation WHERE product_id = $1 ORDER BY locale`,
          [entity_id]
        )
        result = { translations: queryResult.rows }
      }
    } else if (type === 'category' && entity_id) {
      if (locale) {
        const queryResult = await client.query(
          `SELECT * FROM category_translation WHERE category_id = $1 AND locale = $2 LIMIT 1`,
          [entity_id, locale]
        )
        result = { translation: queryResult.rows[0] || null }
      } else {
        const queryResult = await client.query(
          `SELECT * FROM category_translation WHERE category_id = $1 ORDER BY locale`,
          [entity_id]
        )
        result = { translations: queryResult.rows }
      }
    } else {
      result = {
        supported_locales: SUPPORTED_LOCALES,
        default_locale: 'pl',
        fallback_locale: 'en',
      }
    }

    client.release()
    res.json(result)
  } catch (error: any) {
    console.error('Translations GET error:', error)
    res.status(500).json({ error: error.message })
  }
}

// POST /public/translations - utwórz/aktualizuj tłumaczenie
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const { type, entity_id, locale, data } = req.body as {
      type: 'product' | 'category'
      entity_id: string
      locale: Locale
      data: any
    }

    if (!type || !entity_id || !locale || !data) {
      res.status(400).json({ 
        error: "Missing required fields: type, entity_id, locale, data" 
      })
      return
    }

    if (!SUPPORTED_LOCALES.includes(locale)) {
      res.status(400).json({ 
        error: `Invalid locale. Supported: ${SUPPORTED_LOCALES.join(', ')}` 
      })
      return
    }

    const client = await getDbConnection()
    let result

    if (type === 'product') {
      const existing = await client.query(
        `SELECT id FROM product_translation WHERE product_id = $1 AND locale = $2`,
        [entity_id, locale]
      )

      if (existing.rows.length > 0) {
        const updateResult = await client.query(
          `UPDATE product_translation 
           SET title = COALESCE($3, title),
               description = COALESCE($4, description),
               subtitle = COALESCE($5, subtitle),
               material = COALESCE($6, material),
               is_auto_translated = COALESCE($7, is_auto_translated),
               updated_at = NOW()
           WHERE product_id = $1 AND locale = $2
           RETURNING *`,
          [entity_id, locale, data.title, data.description, data.subtitle, data.material, data.is_auto_translated]
        )
        result = updateResult.rows[0]
      } else {
        const insertResult = await client.query(
          `INSERT INTO product_translation (id, product_id, locale, title, description, subtitle, material, is_auto_translated, created_at, updated_at)
           VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
           RETURNING *`,
          [entity_id, locale, data.title, data.description, data.subtitle, data.material, data.is_auto_translated || false]
        )
        result = insertResult.rows[0]
      }
    } else if (type === 'category') {
      const existing = await client.query(
        `SELECT id FROM category_translation WHERE category_id = $1 AND locale = $2`,
        [entity_id, locale]
      )

      if (existing.rows.length > 0) {
        const updateResult = await client.query(
          `UPDATE category_translation 
           SET name = COALESCE($3, name),
               description = COALESCE($4, description),
               is_auto_translated = COALESCE($5, is_auto_translated),
               updated_at = NOW()
           WHERE category_id = $1 AND locale = $2
           RETURNING *`,
          [entity_id, locale, data.name, data.description, data.is_auto_translated]
        )
        result = updateResult.rows[0]
      } else {
        const insertResult = await client.query(
          `INSERT INTO category_translation (id, category_id, locale, name, description, is_auto_translated, created_at, updated_at)
           VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW(), NOW())
           RETURNING *`,
          [entity_id, locale, data.name, data.description, data.is_auto_translated || false]
        )
        result = insertResult.rows[0]
      }
    } else {
      client.release()
      res.status(400).json({ error: "Invalid type. Use 'product' or 'category'" })
      return
    }

    client.release()
    res.json({ translation: result })
  } catch (error: any) {
    console.error('Translations POST error:', error)
    res.status(500).json({ error: error.message })
  }
}


// DELETE /public/translations - usuń tłumaczenie
export async function DELETE(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const { type, entity_id, locale } = req.body as {
      type: 'product' | 'category'
      entity_id: string
      locale: Locale
    }

    if (!type || !entity_id || !locale) {
      res.status(400).json({ 
        error: "Missing required fields: type, entity_id, locale" 
      })
      return
    }

    const client = await getDbConnection()
    let deleted = false

    if (type === 'product') {
      const result = await client.query(
        `DELETE FROM product_translation WHERE product_id = $1 AND locale = $2 RETURNING id`,
        [entity_id, locale]
      )
      deleted = result.rows.length > 0
    } else if (type === 'category') {
      const result = await client.query(
        `DELETE FROM category_translation WHERE category_id = $1 AND locale = $2 RETURNING id`,
        [entity_id, locale]
      )
      deleted = result.rows.length > 0
    } else {
      client.release()
      res.status(400).json({ error: "Invalid type" })
      return
    }

    client.release()
    res.json({ deleted })
  } catch (error: any) {
    console.error('Translations DELETE error:', error)
    res.status(500).json({ error: error.message })
  }
}
