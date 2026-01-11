/**
 * Skrypt naprawy URL obrazków - zmienia lokalne ścieżki na oryginalne URL z WooCommerce
 */

import { Client } from "pg"

const DATABASE_URL = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost/medusa_db"

const WOO_STORES = [
  { name: "omexplus", url: "http://localhost:4000" },
  { name: "machineparts", url: "http://localhost:4001" },
]

interface WooProduct {
  id: number
  images: Array<{ id: number; src: string }>
}

async function fetchWooProducts(storeUrl: string): Promise<WooProduct[]> {
  const allProducts: WooProduct[] = []
  let page = 1
  const perPage = 100

  while (true) {
    const url = `${storeUrl}/wp-json/wc/store/v1/products?per_page=${perPage}&page=${page}`
    try {
      const response = await fetch(url)
      if (!response.ok) break
      const products = await response.json() as WooProduct[]
      if (products.length === 0) break
      allProducts.push(...products)
      if (products.length < perPage) break
      page++
    } catch {
      break
    }
  }
  return allProducts
}

async function fixImageUrls() {
  console.log("🔧 Naprawiam URL obrazków...\n")

  const client = new Client({ connectionString: DATABASE_URL })
  await client.connect()

  // Pobierz wszystkie obrazki z lokalnymi ścieżkami
  const imagesResult = await client.query(`
    SELECT id, url, product_id FROM image WHERE url LIKE '/uploads%'
  `)
  
  console.log(`Znaleziono ${imagesResult.rows.length} obrazków do naprawy\n`)

  // Buduj mapę: woo_id -> obrazki
  const imageMap = new Map<string, Map<number, string>>() // store_wooId -> imgId -> url

  for (const store of WOO_STORES) {
    console.log(`📦 Pobieram obrazki z ${store.name}...`)
    const products = await fetchWooProducts(store.url)
    
    for (const product of products) {
      const key = `${store.name}_${product.id}`
      const imgMap = new Map<number, string>()
      for (const img of product.images) {
        imgMap.set(img.id, img.src)
      }
      imageMap.set(key, imgMap)
    }
    console.log(`   Pobrano ${products.length} produktów\n`)
  }

  let fixed = 0
  let notFound = 0

  for (const row of imagesResult.rows) {
    // Parsuj URL: /uploads/products/prod_woo_omexplus_10611_10612.jpg
    // Format: prod_woo_{store}_{productId}_{imageId}.jpg
    const urlMatch = row.url.match(/prod_woo_(\w+)_(\d+)_(\d+)/)
    if (!urlMatch) {
      notFound++
      continue
    }

    const [, storeName, productId, imageId] = urlMatch
    const key = `${storeName}_${productId}`
    const imgMap = imageMap.get(key)
    
    if (imgMap) {
      const originalUrl = imgMap.get(parseInt(imageId))
      if (originalUrl) {
        await client.query(`UPDATE image SET url = $1 WHERE id = $2`, [originalUrl, row.id])
        fixed++
      } else {
        notFound++
      }
    } else {
      notFound++
    }

    if (fixed % 100 === 0 && fixed > 0) {
      console.log(`   ✅ Naprawiono ${fixed} obrazków...`)
    }
  }

  // Napraw też thumbnail w product
  console.log("\n🖼️ Naprawiam thumbnails produktów...")
  const thumbResult = await client.query(`
    SELECT id, thumbnail, metadata FROM product 
    WHERE thumbnail LIKE '/uploads%' AND metadata IS NOT NULL
  `)

  let thumbFixed = 0
  for (const row of thumbResult.rows) {
    const metadata = row.metadata
    if (!metadata?.woo_store || !metadata?.woo_id) continue

    const key = `${metadata.woo_store}_${metadata.woo_id}`
    const imgMap = imageMap.get(key)
    
    if (imgMap && imgMap.size > 0) {
      // Weź pierwszy obrazek jako thumbnail
      const firstUrl = imgMap.values().next().value
      if (firstUrl) {
        await client.query(`UPDATE product SET thumbnail = $1 WHERE id = $2`, [firstUrl, row.id])
        thumbFixed++
      }
    }
  }

  await client.end()

  console.log(`\n🏁 Zakończono!`)
  console.log(`   ✅ Naprawiono obrazków: ${fixed}`)
  console.log(`   ✅ Naprawiono thumbnails: ${thumbFixed}`)
  console.log(`   ⚠️ Nie znaleziono: ${notFound}`)
}

fixImageUrls().catch(console.error)
