import { Metadata, ResolvingMetadata } from 'next'

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'https://ooxo.pl'
const STORE_URL = process.env.NEXT_PUBLIC_STORE_URL || 'https://ooxo.pl'

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
  }>
  categories?: Array<{ name: string }>
  collection?: { title: string }
}

async function getProduct(handle: string): Promise<Product | null> {
  try {
    const response = await fetch(
      `${MEDUSA_URL}/store/products?handle=${handle}&expand=images,variants,categories,collection`,
      { next: { revalidate: 3600 } }
    )
    if (!response.ok) return null
    const data = await response.json()
    return data.products?.[0] || null
  } catch (error) {
    console.error(`Error fetching product ${handle}:`, error)
    return null
  }
}

interface Props {
  params: Promise<{ locale: string; handle: string }>
  children: React.ReactNode
}

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string; handle: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { locale, handle } = await params
  const product = await getProduct(handle)

  if (!product) {
    return {
      title: 'Produkt nie znaleziony',
      description: 'Ten produkt nie istnieje lub został usunięty.',
    }
  }

  const price = product.variants?.[0]?.prices?.find(p => p.currency_code === 'pln') || product.variants?.[0]?.prices?.[0]
  const priceAmount = price ? (price.amount / 100).toFixed(2) : '0'
  const currency = price?.currency_code?.toUpperCase() || 'PLN'
  const category = product.categories?.[0]?.name || product.collection?.title || 'Części do maszyn'

  // Clean description (max 160 chars)
  const rawDescription = product.subtitle || product.description || ''
  const cleanDescription = rawDescription.replace(/<[^>]*>/g, '').substring(0, 140)
  const description = `${product.title} - ${cleanDescription}. Cena: ${priceAmount} ${currency}. Szybka dostawa.`

  const imageUrl = product.thumbnail || `${STORE_URL}/images/default-product.png`
  const url = `${STORE_URL}/${locale}/products/${handle}`

  return {
    title: `${product.title} | ${category}`,
    description,
    keywords: [product.title, category, 'części zamienne', 'maszyny budowlane', 'OMEX'].join(', '),
    openGraph: {
      title: product.title,
      description: product.subtitle || cleanDescription,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.title,
        },
        ...(product.images || []).slice(0, 3).map(img => ({
          url: img.url,
          width: 800,
          height: 800,
          alt: product.title,
        })),
      ],
      type: 'website',
      url,
      locale: locale === 'pl' ? 'pl_PL' : locale === 'en' ? 'en_US' : locale === 'de' ? 'de_DE' : 'uk_UA',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: product.subtitle || cleanDescription,
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
      languages: {
        'pl-PL': `${STORE_URL}/pl/products/${handle}`,
        'en-US': `${STORE_URL}/en/products/${handle}`,
        'de-DE': `${STORE_URL}/de/products/${handle}`,
        'uk-UA': `${STORE_URL}/uk/products/${handle}`,
      },
    },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
    other: {
      'product:price:amount': priceAmount,
      'product:price:currency': currency,
      'product:category': category,
    },
  }
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
