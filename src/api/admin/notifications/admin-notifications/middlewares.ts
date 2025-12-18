import { defineMiddlewares } from "@medusajs/medusa"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/notifications*",
      middlewares: [],
    },
  ],
})
