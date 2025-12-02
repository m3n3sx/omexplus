import { model } from "@medusajs/framework/utils"

export const BlogPost = model.define("blog_post", {
  id: model.id().primaryKey(),
  title: model.text(),
  slug: model.text(),
  excerpt: model.text().nullable(),
  content: model.json(),
  featuredImage: model.text().nullable(),
  author: model.text(),
  tags: model.json().nullable(),
  published: model.boolean().default(false),
  publishedAt: model.dateTime().nullable(),
  createdAt: model.dateTime().default("now"),
  updatedAt: model.dateTime().default("now"),
})
