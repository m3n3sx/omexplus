import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { OMEX_TRANSLATION_MODULE } from "../../../modules/omex-translation"
import { TranslationService, translationService } from "../../../services/translation.service"

type Locale = 'pl' | 'en' | 'de' | 'uk'

// GET /admin/translations - list all translations or filter by entity
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const translationModule = req.scope.resolve(OMEX_TRANSLATION_MODULE)
    const { type, entity_id, locale } = req.query as {
      type?: 'product' | 'category'
      entity_id?: string
      locale?: Locale
    }

    let result: any = { products: [], categories: [] }

    if (type === 'product' && entity_id) {
      if (locale) {
        const translation = await translationModule.getProductTranslation(entity_id, locale)
        result = { translation }
      } else {
        const translations = await translationModule.getProductTranslations(entity_id)
        result = { translations }
      }
    } else if (type === 'category' && entity_id) {
      if (locale) {
        const translation = await translationModule.getCategoryTranslation(entity_id, locale)
        result = { translation }
      } else {
        const translations = await translationModule.getCategoryTranslations(entity_id)
        result = { translations }
      }
    } else {
      // Return supported locales info
      result = {
        supported_locales: translationModule.getSupportedLocales(),
        default_locale: translationModule.getDefaultLocale(),
        fallback_locale: translationModule.getFallbackLocale(),
      }
    }

    res.json(result)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

// POST /admin/translations - create or update translation
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const translationModule = req.scope.resolve(OMEX_TRANSLATION_MODULE)
    const { type, entity_id, locale, data } = req.body as {
      type: 'product' | 'category'
      entity_id: string
      locale: Locale
      data: any
    }

    if (!type || !entity_id || !locale || !data) {
      return res.status(400).json({ 
        error: "Missing required fields: type, entity_id, locale, data" 
      })
    }

    let result
    if (type === 'product') {
      result = await translationModule.upsertProductTranslation(entity_id, locale, data)
    } else if (type === 'category') {
      result = await translationModule.upsertCategoryTranslation(entity_id, locale, data)
    } else {
      return res.status(400).json({ error: "Invalid type. Use 'product' or 'category'" })
    }

    res.json({ translation: result })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

// DELETE /admin/translations - delete translation
export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  try {
    const translationModule = req.scope.resolve(OMEX_TRANSLATION_MODULE)
    const { type, entity_id, locale } = req.body as {
      type: 'product' | 'category'
      entity_id: string
      locale: Locale
    }

    if (!type || !entity_id || !locale) {
      return res.status(400).json({ 
        error: "Missing required fields: type, entity_id, locale" 
      })
    }

    let deleted
    if (type === 'product') {
      deleted = await translationModule.deleteProductTranslation(entity_id, locale)
    } else if (type === 'category') {
      deleted = await translationModule.deleteCategoryTranslation(entity_id, locale)
    } else {
      return res.status(400).json({ error: "Invalid type" })
    }

    res.json({ deleted })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
