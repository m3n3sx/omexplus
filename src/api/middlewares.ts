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
    {
      matcher: "/store/*",
      middlewares: [
        (req, res, next) => {
          // Enable credentials for CORS
          res.setHeader("Access-Control-Allow-Credentials", "true")
          
          // Get origin from request
          const origin = req.headers.origin
          
          // Check if origin is allowed
          const allowedOrigins = process.env.STORE_CORS?.split(",") || []
          if (origin && allowedOrigins.includes(origin)) {
            res.setHeader("Access-Control-Allow-Origin", origin)
          }
          
          next()
        },
      ],
    },
    {
      matcher: "/auth/*",
      middlewares: [
        (req, res, next) => {
          // Enable credentials for CORS
          res.setHeader("Access-Control-Allow-Credentials", "true")
          
          // Get origin from request
          const origin = req.headers.origin
          
          // Check if origin is allowed
          const allowedOrigins = process.env.AUTH_CORS?.split(",") || []
          if (origin && allowedOrigins.includes(origin)) {
            res.setHeader("Access-Control-Allow-Origin", origin)
          }
          
          next()
        },
      ],
    },
  ],
})
