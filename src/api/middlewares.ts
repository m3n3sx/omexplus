import { defineMiddlewares } from "@medusajs/medusa"

export default defineMiddlewares({
  routes: [
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
