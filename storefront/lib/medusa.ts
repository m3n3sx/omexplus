import Medusa from "@medusajs/js-sdk"

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "pk_c70e4aeb4dfff475873e37bbeb633670a95b4246e07eb7fa7e10beecfdf66cf0"

// Medusa JS SDK for Medusa 2.x
export const medusaClient = new Medusa({
  baseUrl: BACKEND_URL,
  publishableKey: PUBLISHABLE_API_KEY,
})

export default medusaClient
