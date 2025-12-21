/**
 * Theme Configuration System
 * Dark mode + 5 accent color themes
 */

export type ThemeMode = 'light' | 'dark' | 'system'
export type AccentColor = 'blue' | 'green' | 'purple' | 'orange' | 'rose'

export interface ThemeConfig {
  mode: ThemeMode
  accent: AccentColor
}

export const ACCENT_COLORS: Record<AccentColor, { name: string; primary: string; hover: string; light: string; ring: string }> = {
  blue: {
    name: 'Niebieski',
    primary: 'bg-blue-600',
    hover: 'hover:bg-blue-700',
    light: 'bg-blue-50 text-blue-600',
    ring: 'ring-blue-500'
  },
  green: {
    name: 'Zielony',
    primary: 'bg-emerald-600',
    hover: 'hover:bg-emerald-700',
    light: 'bg-emerald-50 text-emerald-600',
    ring: 'ring-emerald-500'
  },
  purple: {
    name: 'Fioletowy',
    primary: 'bg-violet-600',
    hover: 'hover:bg-violet-700',
    light: 'bg-violet-50 text-violet-600',
    ring: 'ring-violet-500'
  },
  orange: {
    name: 'Pomarańczowy',
    primary: 'bg-orange-500',
    hover: 'hover:bg-orange-600',
    light: 'bg-orange-50 text-orange-600',
    ring: 'ring-orange-500'
  },
  rose: {
    name: 'Różowy',
    primary: 'bg-rose-600',
    hover: 'hover:bg-rose-700',
    light: 'bg-rose-50 text-rose-600',
    ring: 'ring-rose-500'
  }
}

const THEME_KEY = 'omex_theme_config'

export function getThemeConfig(): ThemeConfig {
  if (typeof window === 'undefined') {
    return { mode: 'light', accent: 'blue' }
  }
  
  const stored = localStorage.getItem(THEME_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {}
  }
  
  return { mode: 'light', accent: 'blue' }
}

export function saveThemeConfig(config: ThemeConfig): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(THEME_KEY, JSON.stringify(config))
  applyTheme(config)
}

export function applyTheme(config: ThemeConfig): void {
  if (typeof window === 'undefined') return
  
  const root = document.documentElement
  
  // Apply dark mode
  if (config.mode === 'dark' || (config.mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
  
  // Apply accent color as CSS variable
  root.setAttribute('data-accent', config.accent)
}

// Initialize theme on load
export function initTheme(): void {
  const config = getThemeConfig()
  applyTheme(config)
  
  // Listen for system theme changes
  if (config.mode === 'system') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      applyTheme(getThemeConfig())
    })
  }
}
