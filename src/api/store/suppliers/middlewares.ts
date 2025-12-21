import { defineMiddlewares } from "@medusajs/medusa"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/suppliers/*",
      middlewares: [
        (req, res, next) => {
          // Skip publishable API key requirement for supplier products
          // These are public endpoints
          next()
        },
      ],
    },
  ],
})
