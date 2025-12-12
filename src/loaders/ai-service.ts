import { AISearchService } from "../services/ai-search.service"

/**
 * Loader to register AISearchService in Medusa DI container
 */
export default async function aiServiceLoader({ container }) {
  try {
    // Register AISearchService as a singleton
    container.register({
      aiService: {
        resolve: (cradle) => {
          return new AISearchService(cradle.manager)
        },
        options: {
          lifetime: "SINGLETON"
        }
      }
    })

    console.log("✅ AISearchService registered successfully")
  } catch (error) {
    console.error("❌ Failed to register AISearchService:", error)
    throw error
  }
}
