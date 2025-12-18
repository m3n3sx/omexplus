import { model } from "@medusajs/framework/utils"

export const SiteSettings = model.define("site_settings", {
  id: model.id().primaryKey(),
  
  key: model.text().unique(),
  value: model.json(),
  
  category: model.enum([
    "topbar",
    "megamenu",
    "footer",
    "general",
    "seo"
  ]).default("general"),
  
  description: model.text().nullable(),
})
