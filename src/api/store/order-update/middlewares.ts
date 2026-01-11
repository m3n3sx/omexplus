import { defineMiddlewares } from "@medusajs/medusa"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/order-update/*",
      middlewares: [
        (req, res, next) => {
          // Skip publishable API key requirement
          // We verify Bearer token in the route handler instead
          req.publishableApiKeyScopes = null as any
          next()
        },
      ],
    },
  ],
})
