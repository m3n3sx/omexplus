import Medusa from "@medusajs/medusa-js"

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "pk_c70e4aeb4dfff475873e37bbeb633670a95b4246e07eb7fa7e10beecfdf66cf0"

export const medusaClient = new Medusa({
  baseUrl: BACKEND_URL,
  maxRetries: 3,
  publishableApiKey: PUBLISHABLE_API_KEY,
})

// Configure axios to send credentials (cookies) with every request
if (typeof window !== 'undefined' && medusaClient.client.axiosClient) {
  medusaClient.client.axiosClient.defaults.withCredentials = true
  // Add publishable API key to all requests
  medusaClient.client.axiosClient.defaults.headers.common['x-publishable-api-key'] = PUBLISHABLE_API_KEY
}

export default medusaClient
