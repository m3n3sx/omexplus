'use client'

interface Product {
  id: string
  title: string
  handle: string
  subtitle?: string
  description?: string
  thumbnail?: string
  images?: Array<{ url: string }>
  variants?: Array<{ 
    prices?: Array<{ amount: number; currency_code: string }>
    inventory_quantity?: number
  }>
  metadata?: {
    brand?: string
    sku?: string
    ean?: string
  }
  collection?: { title: string }
  categories?: Array<{ name: string }>
}

interface ProductSchemaProps {
  product: Product
  locale?: string
}

export function ProductSchema({ product, locale = 'pl' }: ProductSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_STORE_URL || 'https://ooxo.pl'
  
  // Get price from variants
  const variant = product.variants?.[0]
  const priceData = variant?.prices?.find(p => p.currency_code === 'pln') || variant?.prices?.[0]
  const price = priceData ? (priceData.amount / 100).toFixed(2) : '0'
  const currency = priceData?.currency_code?.toUpperCase() || 'PLN'
  
  // Check stock
  const inStock = (variant?.inventory_quantity || 0) > 0
  
  // Get category
  const category = product.categories?.[0]?.name || product.collection?.title || 'Części do maszyn'
  
  // Get brand
  const brand = product.metadata?.brand || 'OMEX'

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.subtitle || product.description || `${product.title} - wysokiej jakości część do maszyn budowlanych`,
    sku: product.metadata?.sku || product.id,
    mpn: product.id,
    gtin13: product.metadata?.ean,
    brand: {
      '@type': 'Brand',
      name: brand,
    },
    category: category,
    image: [
      product.thumbnail,
      ...(product.images?.map(img => img.url) || []),
    ].filter(Boolean),
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/${locale}/products/${product.handle}`,
      priceCurrency: currency,
      price: price,
      availability: inStock 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'OMEX - Części do maszyn budowlanych',
        url: baseUrl,
      },
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'PLN',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'PL',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 1,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 3,
            unitCode: 'DAY',
          },
        },
      },
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      suppressHydrationWarning
    />
  )
}
