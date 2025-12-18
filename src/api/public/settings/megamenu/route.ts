import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

const defaultMegaMenuSettings = {
  menuItems: [
    {
      id: "1",
      name: "Hydraulika & Osprzęt",
      icon: "HYD",
      slug: "hydraulika",
      priority: "⭐⭐⭐",
      salesPercent: "40%",
      subcategories: [
        "Pompy hydrauliczne",
        "Silniki hydrauliczne",
        "Zawory hydrauliczne",
        "Cylindry hydrauliczne",
      ]
    }
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
      filters: { key: "megamenu", category: "megamenu" }
    })
    
    const megaMenuSettings = settings && settings.length > 0 
      ? settings[0].value 
      : defaultMegaMenuSettings
    
    res.json(megaMenuSettings)
  } catch (error) {
    console.error("Error fetching megamenu settings:", error)
    res.json(defaultMegaMenuSettings)
  }
}
