import { model } from "@medusajs/framework/utils"

export const Page = model.define("page", {
  id: model.id().primaryKey(),
  title: model.text(),
  slug: model.text(),
  content: model.json(),
  metaTitle: model.text().nullable(),
  metaDescription: model.text().nullable(),
  published: model.boolean().default(false),
  publishedAt: model.dateTime().nullable(),
  createdAt: model.dateTime().default("now"),
  updatedAt: model.dateTime().default("now"),
})
