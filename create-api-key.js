/**
 * Create Publishable API Key for Storefront
 * Run: node create-api-key.js
 */

const { MedusaApp } = require("@medusajs/framework")
const { Modules } = require("@medusajs/framework/utils")

async function createPublishableKey() {
  console.log("🔑 Creating Publishable API Key...")
  
  try {
    const { container } = await MedusaApp({
      workerMode: "shared"
    })

    const apiKeyService = container.resolve(Modules.API_KEY)
    
    // Check if key already exists
    const existingKeys = await apiKeyService.listApiKeys({
      type: "publishable"
    })
    
    if (existingKeys.length > 0) {
      console.log("✅ Publishable API key already exists:")
      console.log("   Token:", existingKeys[0].token)
      console.log("")
      console.log("Add this to storefront/.env.local:")
      console.log(`NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${existingKeys[0].token}`)
      process.exit(0)
    }
    
    // Create new key
    const apiKey = await apiKeyService.createApiKeys({
      title: "Storefront Key",
      type: "publishable",
      created_by: "system"
    })
    
    console.log("✅ Publishable API key created successfully!")
    console.log("   Token:", apiKey.token)
    console.log("")
    console.log("Add this to storefront/.env.local:")
    console.log(`NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${apiKey.token}`)
    console.log("")
    console.log("Then restart your frontend: cd storefront && npm run dev")
    
    process.exit(0)
  } catch (error) {
    console.error("❌ Error creating API key:", error.message)
    console.log("")
    console.log("Alternative: Create key manually in Medusa Admin:")
    console.log("1. Open http://localhost:9000/app")
    console.log("2. Go to Settings → API Key Management")
    console.log("3. Create new Publishable API Key")
    console.log("4. Copy token to storefront/.env.local")
    process.exit(1)
  }
}

createPublishableKey()
