import { defineMiddlewares } from "@medusajs/medusa"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/webhooks/*",
      middlewares: [
        (req, res, next) => {
          // Handle CORS for all webhook endpoints
          res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*")
          res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
          res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
          res.setHeader("Access-Control-Allow-Credentials", "true")
          
          if (req.method === "OPTIONS") {
            res.status(204).end()
            return
          }
          
          next()
        },
      ],
    },
  ],
})
