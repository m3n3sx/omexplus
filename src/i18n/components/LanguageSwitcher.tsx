import { useState, useEffect } from 'react'

interface Language {
  name: string
  nativeName: string
  flag: string
}

export function LanguageSwitcher() {
  const [languages, setLanguages] = useState<Record<string, Language>>({})
  const [currentLocale, setCurrentLocale] = useState('pl')

  useEffect(() => {
    // Pobierz dostępne języki
    fetch('/store/i18n/languages')
      .then(res => res.json())
      .then(data => {
        setLanguages(data.languages)
        // Pobierz aktualny język z cookie lub localStorage
        const savedLocale = localStorage.getItem('locale') || 'pl'
        setCurrentLocale(savedLocale)
      })
  }, [])

  const changeLanguage = async (locale: string) => {
    try {
      await fetch('/store/i18n/locale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale })
      })
      
      localStorage.setItem('locale', locale)
      setCurrentLocale(locale)
      window.location.reload()
    } catch (error) {
      console.error('Failed to change language:', error)
    }
  }

  return (
    <select 
      value={currentLocale} 
      onChange={(e) => changeLanguage(e.target.value)}
      className="border rounded px-3 py-2"
    >
      {Object.entries(languages).map(([code, lang]) => (
        <option key={code} value={code}>
          {lang.flag} {lang.nativeName}
        </option>
      ))}
    </select>
  )
}
