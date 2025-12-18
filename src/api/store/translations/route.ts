import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { OMEX_TRANSLATION_MODULE } from "../../../modules/omex-translation"

type Locale = 'pl' | 'en' | 'de' | 'uk'

// GET /store/translations - get translations for storefront
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const translationModule = req.scope.resolve(OMEX_TRANSLATION_MODULE)
    const { type, entity_id, locale } = req.query as {
      type?: 'product' | 'category'
      entity_id?: string
      locale?: Locale
    }

    if (!type || !entity_id) {
      return res.status(400).json({ 
        error: "Missing required params: type, entity_id" 
      })
    }

    // Default to Polish if no locale specified
    const targetLocale = locale || 'pl'

    let translation
    if (type === 'product') {
      translation = await translationModule.getProductTranslation(entity_id, targetLocale)
    } else if (type === 'category') {
      translation = await translationModule.getCategoryTranslation(entity_id, targetLocale)
    } else {
      return res.status(400).json({ error: "Invalid type" })
    }

    res.json({ translation })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

// POST /store/translations/batch - get multiple translations at once
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const translationModule = req.scope.resolve(OMEX_TRANSLATION_MODULE)
    const { type, entity_ids, locale } = req.body as {
      type: 'product' | 'category'
      entity_ids: string[]
      locale?: Locale
    }

    if (!type || !entity_ids || !Array.isArray(entity_ids)) {
      return res.status(400).json({ 
        error: "Missing required fields: type, entity_ids (array)" 
      })
    }

    const targetLocale = locale || 'pl'
    const translations: Record<string, any> = {}

    for (const entityId of entity_ids) {
      try {
        if (type === 'product') {
          translations[entityId] = await translationModule.getProductTranslation(entityId, targetLocale)
        } else if (type === 'category') {
          translations[entityId] = await translationModule.getCategoryTranslation(entityId, targetLocale)
        }
      } catch (e) {
        translations[entityId] = null
      }
    }

    res.json({ translations, locale: targetLocale })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
