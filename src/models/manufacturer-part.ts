import { model } from "@medusajs/framework/utils"

const ManufacturerPart = model.define("manufacturer_part", {
  id: model.id().primaryKey(),
  manufacturer_id: model.text(),
  product_id: model.text(),
  manufacturer_sku: model.text(),
  manufacturer_name: model.text().nullable(),
  part_number: model.text().nullable(),
  alternative_names: model.json().nullable(),
  catalog_page: model.number().nullable(),
  catalog_url: model.text().nullable(),
  technical_doc_url: model.text().nullable(),
  datasheet_json: model.json().nullable(),
})

export default ManufacturerPart
