import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { I18N_MODULE } from "../../../../modules/i18n"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const i18nService = req.scope.resolve(I18N_MODULE)
  const { locale, format } = req.query
  
  const translations = await i18nService.getTranslations(locale as string)
  
  if (format === "csv") {
    // Eksport do CSV
    res.setHeader("Content-Type", "text/csv")
    res.setHeader("Content-Disposition", `attachment; filename=translations-${locale}.csv`)
  } else {
    // Eksport do JSON
    res.setHeader("Content-Type", "application/json")
    res.setHeader("Content-Disposition", `attachment; filename=translations-${locale}.json`)
  }
  
  res.json(translations)
}
