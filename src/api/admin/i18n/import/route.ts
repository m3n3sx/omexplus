import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { I18N_MODULE } from "../../../../modules/i18n"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const i18nService = req.scope.resolve(I18N_MODULE)
  const { locale, translations } = req.body
  
  // Import tłumaczeń
  const result = await i18nService.importTranslations(locale, translations)
  
  res.json({ success: true, imported: result })
}
