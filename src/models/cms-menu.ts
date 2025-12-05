import { model } from "@medusajs/framework/utils"

// CMS Menu Model - zarządza menu i nawigacją
export const CmsMenu = model.define("cms_menu", {
  id: model.id().primaryKey(),
  
  // Identyfikator menu (np. "main-menu", "footer-menu")
  key: model.text().unique(),
  
  // Nazwa menu
  name: model.text(),
  
  // Pozycja menu
  position: model.enum([
    "header-main",
    "header-secondary", 
    "footer-primary",
    "footer-secondary",
    "sidebar",
    "mobile",
    "custom"
  ]),
  
  // Czy menu jest aktywne
  is_active: model.boolean().default(true),
  
  // Język
  locale: model.text().default("pl"),
})

// CMS Menu Item Model - pojedyncze pozycje menu
export const CmsMenuItem = model.define("cms_menu_item", {
  id: model.id().primaryKey(),
  
  // Relacja do menu
  menu_id: model.text(),
  
  // Rodzic (dla podmenu)
  parent_id: model.text().nullable(),
  
  // Etykieta
  label: model.text(),
  
  // URL lub ścieżka
  url: model.text(),
  
  // Typ linku
  link_type: model.enum([
    "internal",
    "external",
    "category",
    "product",
    "page",
    "custom"
  ]).default("internal"),
  
  // Ikona (opcjonalna)
  icon: model.text().nullable(),
  
  // Opis (dla mega menu)
  description: model.text().nullable(),
  
  // Czy otwierać w nowej karcie
  open_in_new_tab: model.boolean().default(false),
  
  // Kolejność
  sort_order: model.number().default(0),
  
  // Czy aktywne
  is_active: model.boolean().default(true),
  
  // CSS classes
  css_classes: model.text().nullable(),
  
  // Metadata
  metadata: model.json().nullable(),
})
