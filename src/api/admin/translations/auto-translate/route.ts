import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { OMEX_TRANSLATION_MODULE } from "../../../../modules/omex-translation"
import { translationService } from "../../../../services/translation.service"

type Locale = 'pl' | 'en' | 'de' | 'uk'

// POST /admin/translations/auto-translate - auto translate content
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const translationModule = req.scope.resolve(OMEX_TRANSLATION_MODULE)
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
      return res.status(400).json({ 
        error: "Missing required fields: type, entity_id, source_data" 
      })
    }

    const supportedLocales = translationModule.getSupportedLocales()
    const locales = target_locales || supportedLocales.filter(l => l !== source_locale)
    
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
          
          await translationModule.upsertProductTranslation(
            entity_id,
            targetLocale,
            translatedData
          )
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
          
          await translationModule.upsertCategoryTranslation(
            entity_id,
            targetLocale,
            translatedData
          )
        }

        results[targetLocale] = { success: true, data: translatedData }
      } catch (error: any) {
        results[targetLocale] = { success: false, error: error.message }
      }
    }

    res.json({ 
      entity_id,
      type,
      source_locale,
      translations: results 
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
