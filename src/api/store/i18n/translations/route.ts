import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { I18N_MODULE } from "../../../../modules/i18n"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const i18nService = req.scope.resolve(I18N_MODULE)
  const { locale, namespace } = req.query
  
  const translations = await i18nService.getTranslations(
    locale as string || "pl",
    namespace as string
  )
  
  res.json({ translations })
}
