import Medusa from "@medusajs/medusa-js"

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

export const medusaClient = new Medusa({ 
  baseUrl: MEDUSA_BACKEND_URL, 
  maxRetries: 3,
  apiKey: typeof window !== "undefined" ? localStorage.getItem("medusa_admin_token") || undefined : undefined,
})

// Update client with token when it changes
if (typeof window !== "undefined") {
  const originalSetItem = localStorage.setItem
  localStorage.setItem = function(key: string, value: string) {
    originalSetItem.apply(this, [key, value])
    if (key === "medusa_admin_token") {
      medusaClient.client.request.config.headers = {
        ...medusaClient.client.request.config.headers,
        Authorization: `Bearer ${value}`,
      }
    }
  }
}

export default medusaClient
