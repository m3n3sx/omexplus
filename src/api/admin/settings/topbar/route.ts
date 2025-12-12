import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa"

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
      filters: { key: "topbar", category: "topbar" }
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
        key: "topbar",
        category: "topbar",
        value: data,
        description: "Topbar navigation settings"
      })
    }
    
    res.json({ settings: settings.value, message: "Topbar settings updated successfully" })
  } catch (error) {
    console.error("Error updating topbar settings:", error)
    res.status(500).json({ message: "Internal server error", error: error.message })
  }
}
