import { model } from "@medusajs/framework/utils"

const B2BCustomerGroup = model.define("b2b_customer_group", {
  id: model.id().primaryKey(),
  name: model.text(),
  discount_percentage: model.bigNumber().nullable(),
  min_order_value: model.bigNumber().nullable(),
  payment_terms: model.text().nullable(),
  custom_catalog_ids: model.json().nullable(),
})

export default B2BCustomerGroup
