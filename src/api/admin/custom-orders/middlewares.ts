import { defineMiddlewares } from "@medusajs/medusa"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/custom-orders*",
      middlewares: [],
    },
  ],
})
