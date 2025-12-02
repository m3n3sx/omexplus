import { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function createPublishableApiKey(container: MedusaContainer) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  try {
    logger.info("Creating publishable API key...")

    // Check if key already exists
    const existingKeys = await query.graph({
      entity: "publishable_api_key",
      fields: ["id", "title"],
    })

    if (existingKeys && existingKeys.data.length > 0) {
      logger.info(`Publishable API key already exists: ${existingKeys.data[0].id}`)
      logger.info(`Title: ${existingKeys.data[0].title}`)
      return
    }

    // Create new publishable API key
    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)
    
    // Generate a key
    const keyValue = `pk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`

    // Insert into database
    const knex = container.resolve(ContainerRegistrationKeys.PG_CONNECTION)
    
    const [apiKey] = await knex("publishable_api_key")
      .insert({
        id: `pak_${Math.random().toString(36).substring(2, 15)}`,
        created_by: "system",
        title: "Storefront",
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning("*")

    logger.info("✅ Publishable API key created successfully!")
    logger.info(`ID: ${apiKey.id}`)
    logger.info(`Title: ${apiKey.title}`)
    logger.info(`\nAdd this to your storefront/.env.local:`)
    logger.info(`NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${apiKey.id}`)

  } catch (error) {
    logger.error("Error creating publishable API key:", error)
    throw error
  }
}
