import { model } from "@medusajs/framework/utils"

const Manufacturer = model.define("manufacturer", {
  id: model.id().primaryKey(),
  name: model.text(),
  name_en: model.text().nullable(),
  name_de: model.text().nullable(),
  slug: model.text().unique(),
  logo_url: model.text().nullable(),
  website_url: model.text().nullable(),
  description: model.text().nullable(),
  country: model.text().nullable(),
  contact_email: model.text().nullable(),
  contact_phone: model.text().nullable(),
  catalog_pdf_url: model.text().nullable(),
  catalog_updated_at: model.dateTime().nullable(),
  api_endpoint: model.text().nullable(),
  api_key: model.text().nullable(),
  is_active: model.boolean().default(true),
  sync_frequency: model.text().nullable(),
  last_sync_at: model.dateTime().nullable(),
  products_count: model.number().default(0),
})

export default Manufacturer
