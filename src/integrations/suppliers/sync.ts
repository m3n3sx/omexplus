/**
 * Supplier Catalog Sync
 * 
 * Synchronizuj katalogi dostawców przez API
 */

export async function syncSupplierCatalog(
  supplierId: string,
  container: any
) {
  console.log(`🔄 Syncing supplier ${supplierId}...`)

  try {
    const productModuleService = container.resolve("productModuleService")
    const pricingModuleService = container.resolve("pricingModuleService")
    const inventoryModuleService = container.resolve("inventoryModuleService")

    // Get supplier config
    const supplier = await getSupplierConfig(supplierId, container)

    if (!supplier) {
      console.error(`Supplier ${supplierId} not found`)
      return { created: 0, updated: 0, errors: 0 }
    }

    console.log(`Fetching catalog from ${supplier.name}...`)

    // Fetch catalog from supplier API
    const response = await fetch(supplier.apiUrl, {
      headers: {
        'Authorization': `Bearer ${supplier.apiKey}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Supplier API returned ${response.status}`)
    }

    const catalog = await response.json()
    const products = catalog.products || []

    console.log(`Received ${products.length} products from supplier`)

    let created = 0
    let updated = 0
    let errors = 0

    for (const item of products) {
      try {
        // Find existing product by SKU
        const existing = await productModuleService.listProducts({
          handle: item.sku,
        })

        if (existing.length > 0) {
          // Update existing product
          const product = existing[0]
          const variant = product.variants?.[0]

          if (variant) {
            // Update price
            await pricingModuleService.updatePrices({
              id: variant.id,
              prices: [{
                amount: Math.round(item.price * 100),
                currency_code: item.currency || 'pln',
              }]
            })

            // Update stock
            await inventoryModuleService.updateInventoryLevels({
              inventory_item_id: variant.id,
              location_id: 'default',
              stocked_quantity: item.stock || 0,
            })

            // Update product metadata
            await productModuleService.updateProducts(product.id, {
              metadata: {
                ...product.metadata,
                supplier_id: supplierId,
                last_synced: new Date().toISOString(),
                supplier_sku: item.sku,
              }
            })

            updated++
          }
        } else {
          // Create new product
          await productModuleService.createProducts({
            title: item.name || item.title,
            handle: item.sku,
            description: item.description || '',
            status: 'published',
            variants: [{
              title: 'Default',
              sku: item.sku,
              prices: [{
                amount: Math.round(item.price * 100),
                currency_code: item.currency || 'pln',
              }],
              inventory_quantity: item.stock || 0,
            }],
            metadata: {
              supplier_id: supplierId,
              last_synced: new Date().toISOString(),
              supplier_sku: item.sku,
            }
          })

          created++
        }

        // Log progress every 10 products
        if ((created + updated) % 10 === 0) {
          console.log(`Progress: ${created} created, ${updated} updated`)
        }
      } catch (error) {
        console.error(`Error syncing ${item.sku}:`, error)
        errors++
      }
    }

    console.log(`✅ Sync completed: ${created} created, ${updated} updated, ${errors} errors`)

    // Trigger storefront revalidation
    if (typeof fetch !== 'undefined' && (created > 0 || updated > 0)) {
      const storefrontUrl = process.env.NEXT_PUBLIC_STOREFRONT_URL || 'http://localhost:3000'
      const revalidateSecret = process.env.REVALIDATE_SECRET

      fetch(`${storefrontUrl}/api/revalidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tags: ['products', 'inventory', 'pricing'],
          secret: revalidateSecret,
        }),
      }).catch(() => {
        console.log('Could not revalidate storefront (may be offline)')
      })
    }

    return { created, updated, errors }
  } catch (error) {
    console.error(`❌ Error syncing supplier ${supplierId}:`, error)
    return { created: 0, updated: 0, errors: 1 }
  }
}

async function getSupplierConfig(supplierId: string, container: any) {
  // TODO: Get from database
  // For now, return example config

  const suppliers: Record<string, any> = {
    'supplier-1': {
      id: 'supplier-1',
      name: 'Supplier One',
      apiUrl: 'https://api.supplier1.com/products',
      apiKey: process.env.SUPPLIER_1_API_KEY || 'test-key',
    },
    'supplier-2': {
      id: 'supplier-2',
      name: 'Supplier Two',
      apiUrl: 'https://api.supplier2.com/catalog',
      apiKey: process.env.SUPPLIER_2_API_KEY || 'test-key',
    },
  }

  return suppliers[supplierId] || null
}

/**
 * Sync all configured suppliers
 */
export async function syncAllSuppliers(container: any) {
  console.log("🔄 Syncing all suppliers...")

  const supplierIds = ['supplier-1', 'supplier-2'] // TODO: Get from database

  const results = []

  for (const supplierId of supplierIds) {
    const result = await syncSupplierCatalog(supplierId, container)
    results.push({
      supplier_id: supplierId,
      ...result,
    })
  }

  console.log("✅ All suppliers synced")
  return results
}
