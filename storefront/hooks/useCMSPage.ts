'use client'

import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'

export interface CMSPageContent {
  id: string
  key: string
  name: string
  content: {
    elements?: any[]
    [key: string]: any
  }
  is_active: boolean
}

export function useCMSPage(pageKey: string) {
  const locale = useLocale()
  const [content, setContent] = useState<CMSPageContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchContent() {
      try {
        setLoading(true)
        setError(null)
        
        const res = await fetch(`${BACKEND_URL}/public/cms?key=${pageKey}&locale=${locale}`)
        
        if (!res.ok) {
          throw new Error('Failed to fetch CMS content')
        }
        
        const data = await res.json()
        setContent(data.content || null)
      } catch (err) {
        console.error('CMS fetch error:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        setContent(null)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [pageKey, locale])

  return { content, loading, error }
}

export default useCMSPage
