import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa"

const defaultTopbarSettings = {
  phone: "+48 500 189 080",
  email: "omexsales@gmail.com",
  languages: [
    { code: "pl", name: "POLISH", flag: "🇵🇱", enabled: true },
    { code: "en", name: "ENGLISH", flag: "🇬🇧", enabled: true },
    { code: "de", name: "GERMAN", flag: "🇩🇪", enabled: false },
  ],
  currencies: [
    { code: "PLN", symbol: "zł", enabled: true },
    { code: "EUR", symbol: "€", enabled: true },
    { code: "USD", symbol: "$", enabled: false },
  ],
  links: [
    { label: "FAQ", url: "/faq", enabled: true },
    { label: "ZŁOŻONE CZĘŚCI", url: "/checkout", enabled: true },
  ]
}

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const query = req.scope.resolve("query")
  
  try {
    const { data: settings } = await query.graph({
      entity: "site_settings",
      fields: ["*"],
      filters: { key: "topbar", category: "topbar" }
    })
    
    const topbarSettings = settings && settings.length > 0 
      ? settings[0].value 
      : defaultTopbarSettings
    
    res.json({ settings: topbarSettings })
  } catch (error) {
    console.error("Error fetching topbar settings:", error)
    res.json({ settings: defaultTopbarSettings })
  }
}
