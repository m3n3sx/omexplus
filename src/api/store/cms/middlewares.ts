import { defineMiddlewares } from "@medusajs/medusa"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/cms",
      middlewares: [
        (req, res, next) => {
          // Skip publishable API key requirement for CMS content
          // These are public endpoints
          next()
        },
      ],
    },
    {
      matcher: "/store/cms/*",
      middlewares: [
        (req, res, next) => {
          // Skip publishable API key requirement for CMS pages and menus
          // These are public endpoints
          next()
        },
      ],
    },
  ],
})
