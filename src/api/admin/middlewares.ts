import { defineMiddlewares } from "@medusajs/medusa"
import { authenticate } from "@medusajs/medusa"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/*",
      middlewares: [
        // Handle CORS preflight requests
        (req, res, next) => {
          if (req.method === "OPTIONS") {
            res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*")
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
            res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-publishable-api-key")
            res.setHeader("Access-Control-Allow-Credentials", "true")
            res.status(204).end()
            return
          }
          next()
        },
        // Skip authentication for custom-orders endpoints
        (req, res, next) => {
          if (req.url?.startsWith("/admin/custom-orders")) {
            return next()
          }
          return authenticate("user", ["session", "bearer", "api-key"], {
            allowUnregistered: false,
          })(req, res, next)
        },
      ],
    },
  ],
})
