import { defineMiddlewares } from "@medusajs/medusa"
import { authenticate } from "@medusajs/medusa"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/suppliers",
      middlewares: [
        authenticate("user", ["session", "bearer", "api-key"], {
          allowUnregistered: true,
        }),
      ],
    },
    {
      matcher: "/admin/suppliers/*",
      middlewares: [
        authenticate("user", ["session", "bearer", "api-key"], {
          allowUnregistered: true,
        }),
      ],
    },
  ],
})
