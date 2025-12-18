import { model } from "@medusajs/framework/utils"

export const Banner = model.define("banner", {
  id: model.id().primaryKey(),
  
  title: model.text(),
  image_url: model.text(),
  link_url: model.text().nullable(),
  
  position: model.enum([
    "home-hero",
    "home-secondary",
    "category-top",
    "sidebar"
  ]).default("home-hero"),
  
  is_active: model.boolean().default(true),
  priority: model.number().default(0),
  
  start_date: model.dateTime().nullable(),
  end_date: model.dateTime().nullable(),
  
  metadata: model.json().nullable(),
})
