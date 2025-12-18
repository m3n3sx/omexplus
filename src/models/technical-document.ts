import { model } from "@medusajs/framework/utils"

const TechnicalDocument = model.define("technical_document", {
  id: model.id().primaryKey(),
  manufacturer_id: model.text().nullable(),
  title: model.text(),
  document_type: model.text(),
  file_url: model.text(),
  file_size: model.number().nullable(),
  mime_type: model.text().nullable(),
  products: model.json().nullable(),
})

export default TechnicalDocument
