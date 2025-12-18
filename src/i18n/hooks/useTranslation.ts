import { useState, useEffect } from 'react'

export function useTranslation(locale: string = 'pl') {
  const [translations, setTranslations] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/store/i18n/translations?locale=${locale}`)
      .then(res => res.json())
      .then(data => {
        setTranslations(data.translations)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [locale])

  const t = (key: string, params?: Record<string, any>): string => {
    const keys = key.split('.')
    let value: any = translations

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return key
      }
    }

    if (typeof value !== 'string') return key

    if (params) {
      return Object.entries(params).reduce(
        (str, [k, v]) => str.replace(`{{${k}}}`, String(v)),
        value
      )
    }

    return value
  }

  return { t, translations, loading }
}
