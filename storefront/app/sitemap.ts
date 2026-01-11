import { MetadataRoute } from 'next'

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'https://ooxo.pl'
const STORE_URL = process.env.NEXT_PUBLIC_STORE_URL || 'https://ooxo.pl'

interface MedusaProduct {
  id: string
  handle: string
  created_at: string
  updated_at: string
  status: string
}

interface MedusaCategory {
  id: string
  handle: string
  name: string
  updated_at?: string
}

async function getProducts(): Promise<MedusaProduct[]> {
  try {
    const response = await fetch(
      `${MEDUSA_URL}/store/products?limit=1000&fields=id,handle,created_at,updated_at,status`,
      { next: { revalidate: 3600 } }
    )
    if (!response.ok) return []
    const data = await response.json()
    return (data.products || []).filter((p: MedusaProduct) => p.status === 'published')
  } catch (error) {
    console.error('Error fetching products for sitemap:', error)
    return []
  }
}

async function getCategories(): Promise<MedusaCategory[]> {
  try {
    const response = await fetch(
      `${MEDUSA_URL}/store/product-categories?limit=100`,
      { next: { revalidate: 3600 } }
    )
    if (!response.ok) return []
    const data = await response.json()
    return data.product_categories || []
  } catch (error) {
    console.error('Error fetching categories for sitemap:', error)
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = ['pl', 'en', 'de', 'uk']
  const routes: MetadataRoute.Sitemap = []

  // Static pages
  const staticPages = [
    { path: '', priority: 1.0, changeFreq: 'daily' as const },
    { path: '/products', priority: 0.9, changeFreq: 'daily' as const },
    { path: '/categories', priority: 0.9, changeFreq: 'daily' as const },
    { path: '/o-nas', priority: 0.6, changeFreq: 'monthly' as const },
    { path: '/kontakt', priority: 0.6, changeFreq: 'monthly' as const },
    { path: '/faq', priority: 0.5, changeFreq: 'monthly' as const },
    { path: '/dostawa', priority: 0.5, changeFreq: 'monthly' as const },
    { path: '/zwroty', priority: 0.4, changeFreq: 'monthly' as const },
    { path: '/regulamin', priority: 0.3, changeFreq: 'yearly' as const },
    { path: '/polityka-prywatnosci', priority: 0.3, changeFreq: 'yearly' as const },
    { path: '/nowosci', priority: 0.8, changeFreq: 'daily' as const },
    { path: '/promocje', priority: 0.8, changeFreq: 'daily' as const },
    { path: '/bestsellery', priority: 0.8, changeFreq: 'weekly' as const },
  ]

  for (const locale of locales) {
    for (const page of staticPages) {
      routes.push({
        url: `${STORE_URL}/${locale}${page.path}`,
        changeFrequency: page.changeFreq,
        priority: page.priority,
        lastModified: new Date(),
      })
    }
  }

  // Dynamic product pages
  const products = await getProducts()
  for (const locale of locales) {
    for (const product of products) {
      routes.push({
        url: `${STORE_URL}/${locale}/products/${product.handle}`,
        changeFrequency: 'weekly',
        priority: 0.8,
        lastModified: new Date(product.updated_at || product.created_at),
      })
    }
  }

  // Dynamic category pages
  const categories = await getCategories()
  for (const locale of locales) {
    for (const category of categories) {
      routes.push({
        url: `${STORE_URL}/${locale}/categories/${category.handle}`,
        changeFrequency: 'weekly',
        priority: 0.7,
        lastModified: category.updated_at ? new Date(category.updated_at) : new Date(),
      })
    }
  }

  return routes
}
