import { NextRequest, NextResponse } from 'next/server'

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'https://ooxo.pl'
const STORE_URL = process.env.NEXT_PUBLIC_STORE_URL || 'https://ooxo.pl'

interface MedusaProduct {
  id: string
  title: string
  handle: string
  subtitle?: string
  description?: string
  status: string
  thumbnail?: string
  images?: Array<{ url: string }>
  variants?: Array<{
    id: string
    sku?: string
    prices?: Array<{ amount: number; currency_code: string }>
    inventory_quantity?: number
  }>
  categories?: Array<{ name: string; handle: string }>
  collection?: { title: string }
  metadata?: {
    brand?: string
    ean?: string
    condition?: string
  }
}

function escapeXml(unsafe: string): string {
  if (!unsafe) return ''
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim()
}

export async function GET(request: NextRequest) {
  try {
    // Fetch all products from Medusa
    const response = await fetch(
      `${MEDUSA_URL}/store/products?limit=1000&expand=variants,images,categories,collection`,
      {
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 3600 },
      }
    )

    if (!response.ok) {
      throw new Error(`Medusa API error: ${response.status}`)
    }

    const data = await response.json()
    const products: MedusaProduct[] = (data.products || []).filter(
      (p: MedusaProduct) => p.status === 'published'
    )

    // Generate XML feed items
    const feedItems = products.map((product) => {
      const variant = product.variants?.[0]
      const priceData = variant?.prices?.find(p => p.currency_code === 'pln') || variant?.prices?.[0]
      const price = priceData ? (priceData.amount / 100).toFixed(2) : '0'
      const currency = priceData?.currency_code?.toUpperCase() || 'PLN'
      
      const category = product.categories?.[0]?.name || product.collection?.title || 'Części do maszyn'
      const description = escapeXml(stripHtml(product.subtitle || product.description || product.title).substring(0, 5000))
      const title = escapeXml(product.title.substring(0, 150))
      const imageUrl = product.thumbnail || `${STORE_URL}/images/default-product.png`
      const productUrl = `${STORE_URL}/pl/products/${product.handle}`
      const availability = (variant?.inventory_quantity || 0) > 0 ? 'in_stock' : 'out_of_stock'
      const brand = product.metadata?.brand || 'OMEX'
      const condition = product.metadata?.condition || 'new'
      const sku = variant?.sku || product.id

      // Additional images
      const additionalImages = (product.images || [])
        .slice(0, 10)
        .map(img => `      <g:additional_image_link><![CDATA[${img.url}]]></g:additional_image_link>`)
        .join('\n')

      return `
    <item>
      <g:id><![CDATA[${product.id}]]></g:id>
      <g:title><![CDATA[${title}]]></g:title>
      <g:description><![CDATA[${description}]]></g:description>
      <g:link><![CDATA[${productUrl}]]></g:link>
      <g:image_link><![CDATA[${imageUrl}]]></g:image_link>
${additionalImages}
      <g:availability>${availability}</g:availability>
      <g:price>${price} ${currency}</g:price>
      <g:google_product_category>Hardware > Machinery > Industrial Machinery</g:google_product_category>
      <g:product_type><![CDATA[${category}]]></g:product_type>
      <g:brand><![CDATA[${brand}]]></g:brand>
      <g:mpn><![CDATA[${sku}]]></g:mpn>
      <g:condition>${condition}</g:condition>
      <g:identifier_exists>true</g:identifier_exists>
      ${product.metadata?.ean ? `<g:gtin><![CDATA[${product.metadata.ean}]]></g:gtin>` : ''}
      <g:shipping>
        <g:country>PL</g:country>
        <g:service>Standard</g:service>
        <g:price>0 PLN</g:price>
      </g:shipping>
    </item>`
    }).join('')

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>OMEX - Części do maszyn budowlanych</title>
    <link>${STORE_URL}</link>
    <description>Profesjonalny sklep z częściami do maszyn budowlanych. ${products.length} produktów w ofercie.</description>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${feedItems}
  </channel>
</rss>`

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  } catch (error) {
    console.error('Feed generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate feed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
