// CMS API client for storefront

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'

export interface CMSContent {
  id: string
  key: string
  type: string
  name: string
  description?: string
  content: any
  is_active: boolean
  sort_order: number
  locale: string
  metadata?: any
  created_at: string
  updated_at: string
}

// Cache dla CMS content
const cmsCache = new Map<string, { data: CMSContent | CMSContent[]; timestamp: number }>()
const CACHE_TTL = 60 * 1000 // 1 minuta

export async function getCMSContent(key: string, locale: string = 'pl'): Promise<CMSContent | null> {
  const cacheKey = `${key}-${locale}`
  const cached = cmsCache.get(cacheKey)
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as CMSContent
  }
  
  try {
    const res = await fetch(`${BACKEND_URL}/public/cms?key=${key}&locale=${locale}`, {
      next: { revalidate: 60 }
    })
    
    if (!res.ok) return null
    
    const data = await res.json()
    const content = data.content || null
    
    if (content) {
      cmsCache.set(cacheKey, { data: content, timestamp: Date.now() })
    }
    
    return content
  } catch (error) {
    console.error('CMS fetch error:', error)
    return null
  }
}

export async function getCMSContentByType(type: string, locale: string = 'pl'): Promise<CMSContent[]> {
  const cacheKey = `type-${type}-${locale}`
  const cached = cmsCache.get(cacheKey)
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as CMSContent[]
  }
  
  try {
    const res = await fetch(`${BACKEND_URL}/public/cms?type=${type}&locale=${locale}`, {
      next: { revalidate: 60 }
    })
    
    if (!res.ok) return []
    
    const data = await res.json()
    const contents = data.contents || []
    
    cmsCache.set(cacheKey, { data: contents, timestamp: Date.now() })
    
    return contents
  } catch (error) {
    console.error('CMS fetch error:', error)
    return []
  }
}

export async function getAllCMSContent(locale: string = 'pl'): Promise<CMSContent[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/public/cms?locale=${locale}`, {
      next: { revalidate: 60 }
    })
    
    if (!res.ok) return []
    
    const data = await res.json()
    return data.contents || []
  } catch (error) {
    console.error('CMS fetch error:', error)
    return []
  }
}

// Helper do pobierania konkretnych elementów
export const cms = {
  header: (locale?: string) => getCMSContent('main-header', locale),
  footer: (locale?: string) => getCMSContent('main-footer', locale),
  hero: (locale?: string) => getCMSContent('home-hero', locale),
  topbar: (locale?: string) => getCMSContent('topbar', locale),
}
