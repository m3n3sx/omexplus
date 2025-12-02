import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  modules: [
    {
      resolve: "./src/modules/product-review",
    },
    {
      resolve: "./src/modules/wishlist",
    },
    {
      resolve: "./src/modules/loyalty",
    },
    {
      resolve: "./src/modules/cms",
    },
    {
      resolve: "./src/modules/i18n",
    },
    {
      resolve: "./src/modules/omex-product",
    },
    {
      resolve: "./src/modules/omex-category",
    },
    {
      resolve: "./src/modules/omex-translation",
    },
    {
      resolve: "./src/modules/omex-pricing",
    },
    {
      resolve: "./src/modules/omex-inventory",
    },
    {
      resolve: "./src/modules/omex-order",
    },
    {
      resolve: "./src/modules/omex-search",
    },
  ],
})
