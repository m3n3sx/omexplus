import { model } from "@medusajs/framework/utils"

// CMS Page Model - zarządza stronami
export const CmsPage = model.define("cms_page", {
  id: model.id().primaryKey(),
  
  // Slug URL
  slug: model.text().unique(),
  
  // Tytuł strony
  title: model.text(),
  
  // Meta description
  meta_description: model.text().nullable(),
  
  // Meta keywords
  meta_keywords: model.text().nullable(),
  
  // Zawartość strony (JSON z sekcjami)
  content: model.json(),
  
  // Template
  template: model.enum([
    "default",
    "full-width",
    "landing",
    "contact",
    "custom"
  ]).default("default"),
  
  // Status
  status: model.enum([
    "draft",
    "published",
    "archived"
  ]).default("draft"),
  
  // Język
  locale: model.text().default("pl"),
  
  // Data publikacji
  published_at: model.dateTime().nullable(),
  
  // SEO
  seo_title: model.text().nullable(),
  seo_image: model.text().nullable(),
  
  // Metadata
  metadata: model.json().nullable(),
})
