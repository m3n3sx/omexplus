/**
 * Skrypt migracji produktów z WooCommerce do Medusa
 * Uruchom: npx ts-node scripts/migrate-woocommerce.ts
 */

import { Client } from "pg"
import * as fs from "fs"
import * as path from "path"
import * as https from "https"
import * as http from "http"

const DATABASE_URL = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost/medusa_db"

// Konfiguracja sklepów WooCommerce
const WOO_STORES = [
  { name: "omexplus", url: "http://localhost:4000", lang: "pl" },
  { name: "machineparts", url: "http://localhost:4001", lang: "multi" }, // PL/EN/DE
]

// Mapowanie kategorii WooCommerce -> Medusa
const CATEGORY_MAP: Record<string, string> = {
  // Sklep 4000 - omexplus
  "tuleje": "pcat_tuleje_ramienia",
  "filtry": "pcat_filtry",
  "czesci-do-silnikow": "pcat_silnik",
  "czesci-do-mostow": "pcat_mosty",
  "czesci-elektryczne": "pcat_elektryka",
  "elementy-nadwozia": "pcat_nadwozie",
  "gasienice": "pcat_podwozia",
  "hydraulika-silowa-pompy-rozdzielacze": "pcat_hydrauliczny",
  "hydraulika-silowa": "pcat_hydrauliczny",
  "kola-napedowe": "pcat_zebatki",
  "kola-napedowe-rolki": "pcat_zebatki",
  "lozyska": "pcat_lozyska_jezdny",
  "lyzki-zeby-lemiesze": "pcat_akcesoria",
  "oleje-smary": "pcat_smarowanie",
  "oleje-do-silnikow": "pcat_oleje_silnikowe",
  "pompy-do-maszyn": "pcat_pompy_hyd",
  "pozostale": "pcat_akcesoria",
  "rolki": "pcat_zebatki",
  "sworznie": "pcat_sworznie_ramienia",
  "uszczelki": "pcat_pozostale_uszczelki",
  "uszczelnienia": "pcat_pozostale_uszczelki",
  "czesci-do-carraro": "pcat_mosty",
  "czesci-do-mostow-dana-spicer": "pcat_mosty",
  "lemiesze": "pcat_akcesoria",
  "pompy-hydrauliczne": "pcat_pompy_hyd",
  "silniki-hydrauliczne": "pcat_silniki_jazdy_hyd",
  "silowniki-hydrauliczne": "pcat_silowniki_hyd",
  "zawory-hydrauliczne": "pcat_zawory_hyd",
  "rozdzielacze-hydrauliczne": "pcat_rozdzielacze_hyd",
  
  // Sklep 4001 - machineparts (wałki)
  "walki-silnika-jazdy": "pcat_czesci_silnikow_jazdy",
  "travel-motor-shafts": "pcat_czesci_silnikow_jazdy",
  "fahrmotorwellen": "pcat_czesci_silnikow_jazdy",
  "walki-silnika-obrotu": "pcat_czesci_silnikow_obrotu",
  "rotation-motor-shafts": "pcat_czesci_silnikow_obrotu",
  "swing-motorwellen": "pcat_czesci_silnikow_obrotu",
  "kola-zebate": "pcat_czesci_zwolnic",
  "gears": "pcat_czesci_zwolnic",
  "getriebe": "pcat_czesci_zwolnic",
  "pozostale": "pcat_akcesoria",
  "others": "pcat_akcesoria",
  "andere": "pcat_akcesoria",
}

// Folder na obrazki
const UPLOADS_DIR = path.join(process.cwd(), "uploads", "products")

interface WooProduct {
  id: number
  name: string
  slug: string
  type: string
  sku: string
  description: string
  short_description: string
  prices: {
    price: string
    regular_price: string
    sale_price: string
    currency_code: string
  }
  images: Array<{
    id: number
    src: string
    name: string
    alt: string
  }>
  categories: Array<{
    id: number
    name: string
    slug: string
  }>
  attributes: Array<{
    id: number
    name: string
    taxonomy: string
    terms: Array<{
      id: number
      name: string
      slug: string
    }>
  }>
  is_in_stock: boolean
}

interface MigratedProduct {
  woo_id: number
  medusa_id: string
  store: string
  lang: string
}


// Pobierz obrazek i zapisz lokalnie
async function downloadImage(url: string, filename: string): Promise<string | null> {
  return new Promise((resolve) => {
    try {
      // Utwórz folder jeśli nie istnieje
      if (!fs.existsSync(UPLOADS_DIR)) {
        fs.mkdirSync(UPLOADS_DIR, { recursive: true })
      }

      const filePath = path.join(UPLOADS_DIR, filename)
      
      // Jeśli plik już istnieje, pomiń
      if (fs.existsSync(filePath)) {
        resolve(`/uploads/products/${filename}`)
        return
      }

      const protocol = url.startsWith("https") ? https : http
      const file = fs.createWriteStream(filePath)

      protocol.get(url, (response) => {
        if (response.statusCode === 200) {
          response.pipe(file)
          file.on("finish", () => {
            file.close()
            resolve(`/uploads/products/${filename}`)
          })
        } else {
          file.close()
          fs.unlinkSync(filePath)
          resolve(null)
        }
      }).on("error", () => {
        file.close()
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
        resolve(null)
      })
    } catch {
      resolve(null)
    }
  })
}

// Pobierz produkty z WooCommerce Store API
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
      console.log(`   Pobrano stronę ${page} (${products.length} produktów)`)
      
      if (products.length < perPage) break
      page++
    } catch (err) {
      console.error(`   Błąd pobierania strony ${page}:`, err)
      break
    }
  }

  return allProducts
}

// Generuj unikalny handle
function generateHandle(name: string, existingHandles: Set<string>): string {
  let handle = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ł/g, "l")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 100)

  if (!existingHandles.has(handle)) {
    existingHandles.add(handle)
    return handle
  }

  let counter = 1
  while (existingHandles.has(`${handle}-${counter}`)) {
    counter++
  }
  
  const uniqueHandle = `${handle}-${counter}`
  existingHandles.add(uniqueHandle)
  return uniqueHandle
}

// Wyczyść HTML z opisu
function cleanHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#8211;/g, "-")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

// Znajdź kategorię Medusa na podstawie kategorii WooCommerce
function findMedusaCategory(wooCategories: WooProduct["categories"]): string | null {
  for (const cat of wooCategories) {
    const slug = cat.slug.toLowerCase()
    if (CATEGORY_MAP[slug]) {
      return CATEGORY_MAP[slug]
    }
  }
  return null
}

// Wykryj język produktu na podstawie nazwy/opisu
function detectLanguage(product: WooProduct): string {
  const text = `${product.name} ${product.description}`.toLowerCase()
  
  // Niemieckie słowa kluczowe
  if (text.includes("fahrmotorwelle") || text.includes("getriebe") || 
      text.includes("zähne") || text.includes("durchmesser") ||
      text.includes("länge") || text.includes("teilenummer")) {
    return "de"
  }
  
  // Angielskie słowa kluczowe
  if (text.includes("travel motor") || text.includes("shaft") ||
      text.includes("teeth") || text.includes("diameter") ||
      text.includes("length") || text.includes("part number")) {
    return "en"
  }
  
  return "pl"
}

// Wyodrębnij numer części z nazwy produktu
function extractPartNumber(name: string): string | null {
  // Wzorce: "020560A/ 20/950730A", "167187", "G65"
  const match = name.match(/^([A-Z0-9\/-]+)/i)
  return match ? match[1].replace(/\/$/, "").trim() : null
}


async function migrateProducts() {
  console.log("🚀 Rozpoczynam migrację produktów z WooCommerce do Medusa\n")

  const client = new Client({ connectionString: DATABASE_URL })
  await client.connect()

  const existingHandles = new Set<string>()
  const migratedProducts: MigratedProduct[] = []
  
  // Pobierz istniejące handle
  const handlesResult = await client.query("SELECT handle FROM product WHERE deleted_at IS NULL")
  handlesResult.rows.forEach(row => existingHandles.add(row.handle))

  // Pobierz istniejące SKU
  const existingSkus = new Set<string>()
  const skusResult = await client.query("SELECT sku FROM product_variant WHERE sku IS NOT NULL")
  skusResult.rows.forEach(row => existingSkus.add(row.sku))

  // Pobierz istniejące kategorie
  const categoriesResult = await client.query(
    "SELECT id, handle FROM product_category WHERE deleted_at IS NULL"
  )
  const categoryMap = new Map<string, string>()
  categoriesResult.rows.forEach(row => categoryMap.set(row.id, row.handle))

  // Pobierz region i sales channel
  const regionResult = await client.query("SELECT id FROM region LIMIT 1")
  const regionId = regionResult.rows[0]?.id

  const salesChannelResult = await client.query("SELECT id FROM sales_channel LIMIT 1")
  const salesChannelId = salesChannelResult.rows[0]?.id

  // Pobierz price list
  const priceListResult = await client.query("SELECT id FROM price_list LIMIT 1")
  
  let totalMigrated = 0
  let totalErrors = 0

  for (const store of WOO_STORES) {
    console.log(`\n📦 Pobieram produkty z ${store.name} (${store.url})...`)
    
    const products = await fetchWooProducts(store.url)
    console.log(`   Znaleziono ${products.length} produktów\n`)

    // Dla sklepu wielojęzycznego - grupuj produkty po numerze części
    const productGroups = new Map<string, WooProduct[]>()
    
    if (store.lang === "multi") {
      for (const product of products) {
        const partNumber = extractPartNumber(product.name)
        if (partNumber) {
          if (!productGroups.has(partNumber)) {
            productGroups.set(partNumber, [])
          }
          productGroups.get(partNumber)!.push(product)
        } else {
          // Produkt bez numeru części - traktuj jako osobny
          productGroups.set(`single_${product.id}`, [product])
        }
      }
    } else {
      // Sklep jednojęzyczny - każdy produkt osobno
      for (const product of products) {
        productGroups.set(`single_${product.id}`, [product])
      }
    }

    console.log(`   Grup produktów do migracji: ${productGroups.size}\n`)

    let groupIndex = 0
    for (const [groupKey, groupProducts] of productGroups) {
      groupIndex++
      
      try {
        // Znajdź produkt główny (polski)
        let mainProduct = groupProducts.find(p => detectLanguage(p) === "pl") || groupProducts[0]
        const lang = detectLanguage(mainProduct)
        
        // Generuj ID i handle
        const productId = `prod_woo_${store.name}_${mainProduct.id}`
        const handle = generateHandle(mainProduct.name, existingHandles)
        
        // Wyczyść opis
        const description = cleanHtml(mainProduct.description || mainProduct.short_description || "")
        
        // Znajdź kategorię
        const categoryId = findMedusaCategory(mainProduct.categories)
        
        // Pobierz i zapisz obrazki
        const imageUrls: string[] = []
        for (const img of mainProduct.images.slice(0, 5)) { // Max 5 obrazków
          const ext = path.extname(new URL(img.src).pathname) || ".jpg"
          const filename = `${productId}_${img.id}${ext}`
          const localUrl = await downloadImage(img.src, filename)
          if (localUrl) {
            imageUrls.push(localUrl)
          }
        }

        // Utwórz produkt
        await client.query(`
          INSERT INTO product (id, title, handle, description, status, thumbnail, metadata, created_at, updated_at)
          VALUES ($1, $2, $3, $4, 'published', $5, $6, NOW(), NOW())
          ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            description = EXCLUDED.description,
            thumbnail = EXCLUDED.thumbnail,
            metadata = EXCLUDED.metadata,
            updated_at = NOW()
        `, [
          productId,
          mainProduct.name,
          handle,
          description,
          imageUrls[0] || null,
          JSON.stringify({
            woo_id: mainProduct.id,
            woo_store: store.name,
            part_number: extractPartNumber(mainProduct.name),
          })
        ])

        // Dodaj obrazki
        for (let i = 0; i < imageUrls.length; i++) {
          const imageId = `img_${productId}_${i}`
          await client.query(`
            INSERT INTO image (id, url, product_id, rank, created_at, updated_at)
            VALUES ($1, $2, $3, $4, NOW(), NOW())
            ON CONFLICT ON CONSTRAINT image_pkey DO UPDATE SET url = EXCLUDED.url, rank = EXCLUDED.rank
          `, [imageId, imageUrls[i], productId, i])
        }

        // Przypisz do kategorii
        if (categoryId) {
          await client.query(`
            INSERT INTO product_category_product (product_id, product_category_id)
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING
          `, [productId, categoryId])
        }

        // Utwórz opcje produktu z atrybutów WooCommerce
        for (const attr of mainProduct.attributes) {
          const optionId = `opt_${productId}_${attr.id}`
          await client.query(`
            INSERT INTO product_option (id, title, product_id, created_at, updated_at)
            VALUES ($1, $2, $3, NOW(), NOW())
            ON CONFLICT ON CONSTRAINT product_option_pkey DO UPDATE SET title = EXCLUDED.title
          `, [optionId, attr.name, productId])

          // Dodaj wartości opcji
          for (const term of attr.terms) {
            const valueId = `optval_${productId}_${attr.id}_${term.id}`
            await client.query(`
              INSERT INTO product_option_value (id, value, option_id, created_at, updated_at)
              VALUES ($1, $2, $3, NOW(), NOW())
              ON CONFLICT ON CONSTRAINT product_option_value_pkey DO UPDATE SET value = EXCLUDED.value
            `, [valueId, term.name, optionId])
          }
        }

        // Utwórz wariant z unikalnym SKU
        const variantId = `variant_${productId}`
        let baseSku = mainProduct.sku || extractPartNumber(mainProduct.name) || `WOO-${mainProduct.id}`
        let sku = baseSku
        
        // Sprawdź czy SKU już istnieje i dodaj suffix jeśli tak
        let skuCounter = 1
        while (existingSkus.has(sku)) {
          sku = `${baseSku}-${skuCounter}`
          skuCounter++
        }
        existingSkus.add(sku)
        
        await client.query(`
          INSERT INTO product_variant (id, title, sku, product_id, manage_inventory, allow_backorder, created_at, updated_at)
          VALUES ($1, $2, $3, $4, false, true, NOW(), NOW())
          ON CONFLICT ON CONSTRAINT product_variant_pkey DO UPDATE SET title = EXCLUDED.title, sku = EXCLUDED.sku
        `, [variantId, "Domyślny", sku, productId])

        // Dodaj cenę (jeśli jest)
        const price = parseFloat(mainProduct.prices.price) || 0
        if (price > 0) {
          // Cena w groszach
          const priceInCents = Math.round(price * 100)
          
          // Utwórz price set
          const priceSetId = `pset_${variantId}`
          await client.query(`
            INSERT INTO price_set (id, created_at, updated_at)
            VALUES ($1, NOW(), NOW())
            ON CONFLICT ON CONSTRAINT price_set_pkey DO NOTHING
          `, [priceSetId])

          // Powiąż wariant z price set
          const pvpsId = `pvps_${variantId}`
          await client.query(`
            INSERT INTO product_variant_price_set (id, variant_id, price_set_id, created_at, updated_at)
            VALUES ($1, $2, $3, NOW(), NOW())
            ON CONFLICT (variant_id, price_set_id) DO NOTHING
          `, [pvpsId, variantId, priceSetId])

          // Dodaj cenę
          const priceId = `price_${variantId}_pln`
          const rawAmount = JSON.stringify({ value: String(priceInCents), precision: 20 })
          await client.query(`
            INSERT INTO price (id, amount, raw_amount, currency_code, price_set_id, created_at, updated_at)
            VALUES ($1, $2, $3::jsonb, 'pln', $4, NOW(), NOW())
            ON CONFLICT ON CONSTRAINT price_pkey DO UPDATE SET amount = EXCLUDED.amount, raw_amount = EXCLUDED.raw_amount
          `, [priceId, priceInCents, rawAmount, priceSetId])
        }

        // Dodaj tłumaczenia dla produktów wielojęzycznych
        if (store.lang === "multi" && groupProducts.length > 1) {
          for (const langProduct of groupProducts) {
            const productLang = detectLanguage(langProduct)
            if (productLang !== "pl") {
              const transDesc = cleanHtml(langProduct.description || langProduct.short_description || "")
              
              await client.query(`
                INSERT INTO product_translation (product_id, locale, title, description, created_at, updated_at)
                VALUES ($1, $2, $3, $4, NOW(), NOW())
                ON CONFLICT (product_id, locale) DO UPDATE SET
                  title = EXCLUDED.title,
                  description = EXCLUDED.description,
                  updated_at = NOW()
              `, [productId, productLang, langProduct.name, transDesc])
            }
          }
        }

        // Powiąż z sales channel
        if (salesChannelId) {
          const pscId = `psc_${productId}`
          await client.query(`
            INSERT INTO product_sales_channel (id, product_id, sales_channel_id, created_at, updated_at)
            VALUES ($1, $2, $3, NOW(), NOW())
            ON CONFLICT (product_id, sales_channel_id) DO NOTHING
          `, [pscId, productId, salesChannelId])
        }

        totalMigrated++
        
        if (groupIndex % 50 === 0) {
          console.log(`   ✅ Zmigrowano ${groupIndex}/${productGroups.size} grup produktów`)
        }

        migratedProducts.push({
          woo_id: mainProduct.id,
          medusa_id: productId,
          store: store.name,
          lang: lang
        })

      } catch (err: any) {
        totalErrors++
        console.error(`   ❌ Błąd migracji grupy ${groupKey}:`, err.message)
      }
    }
  }

  await client.end()

  console.log(`\n🏁 Migracja zakończona!`)
  console.log(`   ✅ Zmigrowano: ${totalMigrated} produktów`)
  console.log(`   ❌ Błędy: ${totalErrors}`)
  console.log(`   📁 Obrazki zapisane w: ${UPLOADS_DIR}`)

  // Zapisz raport
  const reportPath = path.join(process.cwd(), "migration-report.json")
  fs.writeFileSync(reportPath, JSON.stringify(migratedProducts, null, 2))
  console.log(`   📄 Raport zapisany: ${reportPath}`)
}

migrateProducts().catch(console.error)
