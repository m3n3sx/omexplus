import { MedusaNextFunction, MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export function localeMiddleware(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  // Pobierz język z nagłówka, query lub cookie
  const locale = 
    req.query.locale as string ||
    req.headers["accept-language"]?.split(",")[0]?.split("-")[0] ||
    req.cookies?.locale ||
    "pl"
  
  // Sprawdź czy język jest wspierany
  const supportedLocales = ["pl", "en", "de", "uk"]
  req.locale = supportedLocales.includes(locale) ? locale : "pl"
  
  next()
}
