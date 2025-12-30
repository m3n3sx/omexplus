import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getDbConnection } from "../../../../lib/db"
import { translationService } from "../../../../services/translation.service"

type Locale = 'pl' | 'en' | 'de' | 'uk'

const SUPPORTED_LOCALES: Locale[] = ['pl', 'en', 'de', 'uk']

async function upsertProductTranslation(client: any, entityId: string, locale: Locale, data: any) {
  const existing = await client.query(
    `SELECT id FROM product_translation WHERE product_id = $1 AND locale = $2`,
    [entityId, locale]
  )

  if (existing.rows.length > 0) {
    const result = await client.query(
      `UPDATE product_translation 
       SET title = COALESCE($3, title),
           description = COALESCE($4, description),
           subtitle = COALESCE($5, subtitle),
           material = COALESCE($6, material),
           is_auto_translated = COALESCE($7, is_auto_translated),
           updated_at = NOW()
       WHERE product_id = $1 AND locale = $2
       RETURNING *`,
      [entityId, locale, data.title, data.description, data.subtitle, data.material, data.is_auto_translated]
    )
    return result.rows[0]
  } else {
    const result = await client.query(
      `INSERT INTO product_translation (id, product_id, locale, title, description, subtitle, material, is_auto_translated, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
       RETURNING *`,
      [entityId, locale, data.title, data.description, data.subtitle, data.material, data.is_auto_translated || false]
    )
    return result.rows[0]
  }
}

async function upsertCategoryTranslation(client: any, entityId: string, locale: Locale, data: any) {
  const existing = await client.query(
    `SELECT id FROM category_translation WHERE category_id = $1 AND locale = $2`,
    [entityId, locale]
  )

  if (existing.rows.length > 0) {
    const result = await client.query(
      `UPDATE category_translation 
       SET name = COALESCE($3, name),
           description = COALESCE($4, description),
           is_auto_translated = COALESCE($5, is_auto_translated),
           updated_at = NOW()
       WHERE category_id = $1 AND locale = $2
       RETURNING *`,
      [entityId, locale, data.name, data.description, data.is_auto_translated]
    )
    return result.rows[0]
  } else {
    const result = await client.query(
      `INSERT INTO category_translation (id, category_id, locale, name, description, is_auto_translated, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING *`,
      [entityId, locale, data.name, data.description, data.is_auto_translated || false]
    )
    return result.rows[0]
  }
}

// POST /public/translations/auto-translate
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const { 
      type, 
      entity_id, 
      source_locale = 'pl',
      target_locales,
      source_data 
    } = req.body as {
      type: 'product' | 'category'
      entity_id: string
      source_locale?: Locale
      target_locales?: Locale[]
      source_data: {
        title?: string
        name?: string
        description?: string
        subtitle?: string
        material?: string
      }
    }

    if (!type || !entity_id || !source_data) {
      res.status(400).json({ 
        error: "Missing required fields: type, entity_id, source_data" 
      })
      return
    }

    const client = await getDbConnection()
    const locales = target_locales || SUPPORTED_LOCALES.filter(l => l !== source_locale)
    
    const results: Record<string, any> = {}

    for (const targetLocale of locales) {
      if (targetLocale === source_locale) continue

      try {
        let translatedData: any = {}

        if (type === 'product') {
          const translated = await translationService.translateProduct(
            {
              title: source_data.title,
              description: source_data.description,
              subtitle: source_data.subtitle,
              material: source_data.material,
            },
            targetLocale,
            source_locale
          )
          translatedData = { ...translated, is_auto_translated: true }
          
          await upsertProductTranslation(client, entity_id, targetLocale, translatedData)
        } else if (type === 'category') {
          const translated = await translationService.translateCategory(
            {
              name: source_data.name,
              description: source_data.description,
            },
            targetLocale,
            source_locale
          )
          translatedData = { ...translated, is_auto_translated: true }
          
          await upsertCategoryTranslation(client, entity_id, targetLocale, translatedData)
        }

        results[targetLocale] = { success: true, data: translatedData }
      } catch (error: any) {
        results[targetLocale] = { success: false, error: error.message }
      }
    }

    client.release()

    res.json({ 
      entity_id,
      type,
      source_locale,
      translations: results 
    })
  } catch (error: any) {
    console.error('Auto-translate error:', error)
    res.status(500).json({ error: error.message })
  }
}
