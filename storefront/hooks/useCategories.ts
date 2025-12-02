import { useState, useEffect } from 'react'
import apiClient from '../lib/api-client'

export function useCategories(locale?: string) {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const data = await apiClient.getCategories(locale)
        setCategories(data.categories || [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [locale])

  return { categories, loading, error }
}
