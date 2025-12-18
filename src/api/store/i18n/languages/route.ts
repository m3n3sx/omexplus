import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { I18N_MODULE } from "../../../../modules/i18n"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const i18nService = req.scope.resolve(I18N_MODULE)
  
  const languages = await i18nService.getSupportedLanguages()
  const defaultLanguage = await i18nService.getDefaultLanguage()
  
  res.json({ 
    languages,
    defaultLanguage 
  })
}
