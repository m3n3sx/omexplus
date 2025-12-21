"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export type AccentColor = 'blue' | 'green' | 'purple' | 'orange' | 'rose'
export type ThemeMode = 'light' | 'dark'

const THEME_KEY = 'omex_theme_mode'
const ACCENT_KEY = 'omex_accent_color'

interface ThemeContextType {
  mode: ThemeMode
  accent: AccentColor
  setMode: (mode: ThemeMode) => void
  setAccent: (accent: AccentColor) => void
  isDark: boolean
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('light')
  const [accent, setAccentState] = useState<AccentColor>('blue')
  const [mounted, setMounted] = useState(false)

  // Initialize from localStorage
  useEffect(() => {
    const storedMode = localStorage.getItem(THEME_KEY) as ThemeMode
    const storedAccent = localStorage.getItem(ACCENT_KEY) as AccentColor
    
    if (storedMode && ['light', 'dark'].includes(storedMode)) {
      setModeState(storedMode)
    }
    if (storedAccent && ['blue', 'green', 'purple', 'orange', 'rose'].includes(storedAccent)) {
      setAccentState(storedAccent)
    }
    setMounted(true)
  }, [])

  // Apply theme to DOM using data-theme attribute
  useEffect(() => {
    if (!mounted) return
    
    const root = document.documentElement
    root.setAttribute('data-theme', mode)
    root.setAttribute('data-accent', accent)
    
    console.log('[Theme] Applied:', { mode, accent })
  }, [mode, accent, mounted])

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode)
    localStorage.setItem(THEME_KEY, newMode)
  }

  const setAccent = (newAccent: AccentColor) => {
    setAccentState(newAccent)
    localStorage.setItem(ACCENT_KEY, newAccent)
  }

  if (!mounted) {
    return null
  }

  return (
    <ThemeContext.Provider value={{ 
      mode, 
      accent, 
      setMode, 
      setAccent, 
      isDark: mode === 'dark' 
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return {
    theme: { mode: context.mode, accent: context.accent },
    setMode: context.setMode,
    setAccent: context.setAccent,
    isDark: context.isDark
  }
}
