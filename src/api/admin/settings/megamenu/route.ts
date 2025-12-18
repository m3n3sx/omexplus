import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const data = req.body
  const siteSettingsService = req.scope.resolve("siteSettings")
  const query = req.scope.resolve("query")
  
  try {
    // Sprawdź czy ustawienie już istnieje
    const { data: existing } = await query.graph({
      entity: "site_settings",
      fields: ["*"],
      filters: { key: "megamenu", category: "megamenu" }
    })
    
    let settings
    if (existing && existing.length > 0) {
      // Aktualizuj istniejące
      settings = await siteSettingsService.update(existing[0].id, {
        value: data
      })
    } else {
      // Utwórz nowe
      settings = await siteSettingsService.create({
        key: "megamenu",
        category: "megamenu",
        value: data,
        description: "Mega menu structure settings"
      })
    }
    
    res.json({ ...settings.value, message: "Mega menu settings updated successfully" })
  } catch (error) {
    console.error("Error updating megamenu settings:", error)
    res.status(500).json({ message: "Internal server error", error: error.message })
  }
}
