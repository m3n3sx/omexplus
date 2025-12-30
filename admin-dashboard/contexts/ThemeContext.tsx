"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export type AccentColor = 'blue' | 'green' | 'purple' | 'orange' | 'rose' | 'cyan' | 'amber' | 'emerald' | 'indigo' | 'pink'
export type ThemeMode = 'light' | 'dark' | 'system'
export type SidebarStyle = 'default' | 'compact' | 'minimal'
export type FontSize = 'small' | 'medium' | 'large'
export type BorderRadius = 'none' | 'small' | 'medium' | 'large' | 'full'
export type DensityMode = 'comfortable' | 'compact' | 'spacious'

const THEME_KEY = 'omex_theme_mode'
const ACCENT_KEY = 'omex_accent_color'
const SIDEBAR_KEY = 'omex_sidebar_style'
const FONT_SIZE_KEY = 'omex_font_size'
const BORDER_RADIUS_KEY = 'omex_border_radius'
const DENSITY_KEY = 'omex_density'
const ANIMATIONS_KEY = 'omex_animations'
const SIDEBAR_COLLAPSED_KEY = 'omex_sidebar_collapsed'

interface ThemeSettings {
  mode: ThemeMode
  accent: AccentColor
  sidebarStyle: SidebarStyle
  fontSize: FontSize
  borderRadius: BorderRadius
  density: DensityMode
  animations: boolean
  sidebarCollapsed: boolean
}

interface ThemeContextType extends ThemeSettings {
  setMode: (mode: ThemeMode) => void
  setAccent: (accent: AccentColor) => void
  setSidebarStyle: (style: SidebarStyle) => void
  setFontSize: (size: FontSize) => void
  setBorderRadius: (radius: BorderRadius) => void
  setDensity: (density: DensityMode) => void
  setAnimations: (enabled: boolean) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  isDark: boolean
  resetToDefaults: () => void
}

const defaultSettings: ThemeSettings = {
  mode: 'light',
  accent: 'blue',
  sidebarStyle: 'default',
  fontSize: 'medium',
  borderRadius: 'medium',
  density: 'comfortable',
  animations: true,
  sidebarCollapsed: false,
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ThemeSettings>(defaultSettings)
  const [mounted, setMounted] = useState(false)
  const [systemDark, setSystemDark] = useState(false)

  // Detect system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setSystemDark(mediaQuery.matches)
    
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  // Initialize from localStorage
  useEffect(() => {
    const storedMode = localStorage.getItem(THEME_KEY) as ThemeMode
    const storedAccent = localStorage.getItem(ACCENT_KEY) as AccentColor
    const storedSidebar = localStorage.getItem(SIDEBAR_KEY) as SidebarStyle
    const storedFontSize = localStorage.getItem(FONT_SIZE_KEY) as FontSize
    const storedBorderRadius = localStorage.getItem(BORDER_RADIUS_KEY) as BorderRadius
    const storedDensity = localStorage.getItem(DENSITY_KEY) as DensityMode
    const storedAnimations = localStorage.getItem(ANIMATIONS_KEY)
    const storedSidebarCollapsed = localStorage.getItem(SIDEBAR_COLLAPSED_KEY)

    setSettings({
      mode: storedMode && ['light', 'dark', 'system'].includes(storedMode) ? storedMode : 'light',
      accent: storedAccent && ['blue', 'green', 'purple', 'orange', 'rose', 'cyan', 'amber', 'emerald', 'indigo', 'pink'].includes(storedAccent) ? storedAccent : 'blue',
      sidebarStyle: storedSidebar && ['default', 'compact', 'minimal'].includes(storedSidebar) ? storedSidebar : 'default',
      fontSize: storedFontSize && ['small', 'medium', 'large'].includes(storedFontSize) ? storedFontSize : 'medium',
      borderRadius: storedBorderRadius && ['none', 'small', 'medium', 'large', 'full'].includes(storedBorderRadius) ? storedBorderRadius : 'medium',
      density: storedDensity && ['comfortable', 'compact', 'spacious'].includes(storedDensity) ? storedDensity : 'comfortable',
      animations: storedAnimations !== 'false',
      sidebarCollapsed: storedSidebarCollapsed === 'true',
    })
    setMounted(true)
  }, [])

  // Compute actual dark mode
  const isDark = settings.mode === 'dark' || (settings.mode === 'system' && systemDark)

  // Apply theme to DOM
  useEffect(() => {
    if (!mounted) return
    
    const root = document.documentElement
    
    // Theme mode
    root.setAttribute('data-theme', isDark ? 'dark' : 'light')
    root.classList.toggle('dark', isDark)
    
    // Accent color
    root.setAttribute('data-accent', settings.accent)
    
    // Sidebar style
    root.setAttribute('data-sidebar', settings.sidebarStyle)
    
    // Font size
    root.setAttribute('data-font-size', settings.fontSize)
    const fontSizeMap = { small: '14px', medium: '16px', large: '18px' }
    root.style.fontSize = fontSizeMap[settings.fontSize]
    
    // Border radius
    root.setAttribute('data-border-radius', settings.borderRadius)
    const radiusMap = { none: '0', small: '0.25rem', medium: '0.5rem', large: '0.75rem', full: '9999px' }
    root.style.setProperty('--radius-base', radiusMap[settings.borderRadius])
    
    // Density
    root.setAttribute('data-density', settings.density)
    
    // Animations
    root.setAttribute('data-animations', settings.animations ? 'true' : 'false')
    if (!settings.animations) {
      root.style.setProperty('--transition-duration', '0ms')
    } else {
      root.style.removeProperty('--transition-duration')
    }
    
    console.log('[Theme] Applied:', { ...settings, isDark })
  }, [settings, isDark, mounted])

  const updateSetting = <K extends keyof ThemeSettings>(key: K, value: ThemeSettings[K], storageKey: string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    localStorage.setItem(storageKey, String(value))
  }

  const setMode = (mode: ThemeMode) => updateSetting('mode', mode, THEME_KEY)
  const setAccent = (accent: AccentColor) => updateSetting('accent', accent, ACCENT_KEY)
  const setSidebarStyle = (style: SidebarStyle) => updateSetting('sidebarStyle', style, SIDEBAR_KEY)
  const setFontSize = (size: FontSize) => updateSetting('fontSize', size, FONT_SIZE_KEY)
  const setBorderRadius = (radius: BorderRadius) => updateSetting('borderRadius', radius, BORDER_RADIUS_KEY)
  const setDensity = (density: DensityMode) => updateSetting('density', density, DENSITY_KEY)
  const setAnimations = (enabled: boolean) => updateSetting('animations', enabled, ANIMATIONS_KEY)
  const setSidebarCollapsed = (collapsed: boolean) => updateSetting('sidebarCollapsed', collapsed, SIDEBAR_COLLAPSED_KEY)

  const resetToDefaults = () => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('omex_')) {
        localStorage.removeItem(key)
      }
    })
    setSettings(defaultSettings)
  }

  if (!mounted) {
    return null
  }

  return (
    <ThemeContext.Provider value={{ 
      ...settings,
      setMode,
      setAccent,
      setSidebarStyle,
      setFontSize,
      setBorderRadius,
      setDensity,
      setAnimations,
      setSidebarCollapsed,
      isDark,
      resetToDefaults,
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
  return context
}
