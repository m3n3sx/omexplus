import { model } from "@medusajs/framework/utils"

// CMS Content Model - zarządza wszystkimi elementami frontendu
export const CmsContent = model.define("cms_content", {
  id: model.id().primaryKey(),
  
  // Identyfikator elementu (np. "header", "footer", "hero-section")
  key: model.text().unique(),
  
  // Typ elementu
  type: model.enum([
    "header",
    "footer", 
    "menu",
    "hero",
    "section",
    "banner",
    "widget",
    "text",
    "image",
    "button",
    "custom"
  ]),
  
  // Nazwa wyświetlana w panelu
  name: model.text(),
  
  // Opis elementu
  description: model.text().nullable(),
  
  // Zawartość JSON - elastyczna struktura
  content: model.json(),
  
  // Czy element jest aktywny
  is_active: model.boolean().default(true),
  
  // Kolejność wyświetlania
  sort_order: model.number().default(0),
  
  // Język (dla wielojęzyczności)
  locale: model.text().default("pl"),
  
  // Metadata
  metadata: model.json().nullable(),
})
