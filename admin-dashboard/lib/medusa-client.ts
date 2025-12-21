import Medusa from "@medusajs/medusa-js"

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "https://api.ooxo.pl"

export const medusaClient = new Medusa({ 
  baseUrl: MEDUSA_BACKEND_URL, 
  maxRetries: 3,
  apiKey: typeof window !== "undefined" ? localStorage.getItem("medusa_admin_token") || undefined : undefined,
})

export default medusaClient
