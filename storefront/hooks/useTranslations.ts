import { useState, useEffect, useCallback } from 'react'
import { useLocale } from 'next-intl'

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'

type Locale = 'pl' | 'en' | 'de' | 'uk'

interface ProductTranslation {
  id: string
  product_id: string
  locale: Locale
  title?: string
  description?: string
  subtitle?: string
  material?: string
  is_auto_translated?: boolean
}

interface CategoryTranslation {
  id: string
  category_id: string
  locale: Locale
  name?: string
  description?: string
  is_auto_translated?: boolean
}

interface TranslationCache {
  [key: string]: {
    data: any
    timestamp: number
  }
}

const cache: TranslationCache = {}
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

function getCacheKey(type: string, entityId: string, locale: string): string {
  return `${type}:${entityId}:${locale}`
}

export function useProductTranslation(productId: string, fallbackData?: { title?: string; description?: string }) {
  const locale = useLocale() as Locale
  const [translation, setTranslation] = useState<ProductTranslation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!productId) {
      setLoading(false)
      return
    }

    const cacheKey = getCacheKey('product', productId, locale)
    const cached = cache[cacheKey]
    
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      setTranslation(cached.data)
      setLoading(false)
      return
    }

    const fetchTranslation = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `${BACKEND_URL}/store/translations?type=product&entity_id=${productId}&locale=${locale}`
        )
        
        if (!response.ok) throw new Error('Failed to fetch translation')
        
        const data = await response.json()
        cache[cacheKey] = { data: data.translation, timestamp: Date.now() }
        setTranslation(data.translation)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTranslation()
  }, [productId, locale])

  // Return translated data or fallback
  return {
    title: translation?.title || fallbackData?.title || '',
    description: translation?.description || fallbackData?.description || '',
    subtitle: translation?.subtitle || '',
    material: translation?.material || '',
    isAutoTranslated: translation?.is_auto_translated || false,
    loading,
    error,
  }
}

export function useCategoryTranslation(categoryId: string, fallbackData?: { name?: string; description?: string }) {
  const locale = useLocale() as Locale
  const [translation, setTranslation] = useState<CategoryTranslation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!categoryId) {
      setLoading(false)
      return
    }

    const cacheKey = getCacheKey('category', categoryId, locale)
    const cached = cache[cacheKey]
    
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      setTranslation(cached.data)
      setLoading(false)
      return
    }

    const fetchTranslation = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `${BACKEND_URL}/store/translations?type=category&entity_id=${categoryId}&locale=${locale}`
        )
        
        if (!response.ok) throw new Error('Failed to fetch translation')
        
        const data = await response.json()
        cache[cacheKey] = { data: data.translation, timestamp: Date.now() }
        setTranslation(data.translation)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTranslation()
  }, [categoryId, locale])

  return {
    name: translation?.name || fallbackData?.name || '',
    description: translation?.description || fallbackData?.description || '',
    isAutoTranslated: translation?.is_auto_translated || false,
    loading,
    error,
  }
}

// Batch fetch translations for multiple products
export function useBatchProductTranslations(productIds: string[]) {
  const locale = useLocale() as Locale
  const [translations, setTranslations] = useState<Record<string, ProductTranslation>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!productIds.length) {
      setLoading(false)
      return
    }

    const fetchTranslations = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${BACKEND_URL}/store/translations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'product',
            entity_ids: productIds,
            locale,
          }),
        })
        
        if (!response.ok) throw new Error('Failed to fetch translations')
        
        const data = await response.json()
        setTranslations(data.translations || {})
      } catch (err) {
        console.error('Batch translation error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTranslations()
  }, [productIds.join(','), locale])

  const getTranslation = useCallback((productId: string) => {
    return translations[productId] || null
  }, [translations])

  return { translations, getTranslation, loading }
}

// Helper to get translated product data
export function getTranslatedProduct<T extends { id: string; title?: string; description?: string }>(
  product: T,
  translation: ProductTranslation | null
): T {
  if (!translation) return product
  
  return {
    ...product,
    title: translation.title || product.title,
    description: translation.description || product.description,
  }
}

// Clear translation cache
export function clearTranslationCache() {
  Object.keys(cache).forEach(key => delete cache[key])
}
