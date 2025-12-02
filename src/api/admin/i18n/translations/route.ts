import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { I18N_MODULE } from "../../../../modules/i18n"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const i18nService = req.scope.resolve(I18N_MODULE)
  const { locale } = req.query
  
  const translations = await i18nService.getTranslations(locale as string)
  
  res.json({ translations })
}

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  const i18nService = req.scope.resolve(I18N_MODULE)
  const { locale, key, value } = req.body
  
  const translation = await i18nService.setTranslation(locale, key, value)
  
  res.json({ translation })
}
