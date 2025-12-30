"use client"

import { useState, useRef, useEffect } from "react"
import { Sun, Moon, Monitor, Palette, Check, Settings } from "lucide-react"
import { useTheme, AccentColor, ThemeMode } from "@/contexts/ThemeContext"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function ThemeSwitcher() {
  const theme = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const modes: { value: ThemeMode; label: string; icon: any }[] = [
    { value: 'light', label: 'Jasny', icon: Sun },
    { value: 'dark', label: 'Ciemny', icon: Moon },
    { value: 'system', label: 'Auto', icon: Monitor },
  ]

  const accents: { value: AccentColor; color: string; name: string }[] = [
    { value: 'blue', color: 'bg-blue-500', name: 'Niebieski' },
    { value: 'green', color: 'bg-green-500', name: 'Zielony' },
    { value: 'purple', color: 'bg-purple-500', name: 'Fioletowy' },
    { value: 'orange', color: 'bg-orange-500', name: 'Pomarańczowy' },
    { value: 'rose', color: 'bg-rose-500', name: 'Różowy' },
    { value: 'cyan', color: 'bg-cyan-500', name: 'Cyjan' },
    { value: 'amber', color: 'bg-amber-500', name: 'Bursztynowy' },
    { value: 'emerald', color: 'bg-emerald-500', name: 'Szmaragdowy' },
    { value: 'indigo', color: 'bg-indigo-500', name: 'Indygo' },
    { value: 'pink', color: 'bg-pink-500', name: 'Różowy jasny' },
  ]

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-theme-secondary hover:text-theme-primary hover:bg-theme-hover rounded-lg transition-colors"
        title="Motyw"
      >
        {theme.isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-theme-secondary rounded-xl shadow-2xl border border-theme z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-theme flex items-center justify-between">
            <h3 className="font-semibold text-theme-primary">Motyw</h3>
            <Link 
              href="/settings/appearance"
              onClick={() => setIsOpen(false)}
              className="text-xs text-accent hover:underline flex items-center gap-1"
            >
              <Settings className="w-3 h-3" />
              Więcej opcji
            </Link>
          </div>

          {/* Mode selector */}
          <div className="p-3">
            <p className="text-xs font-medium text-theme-muted uppercase mb-2">Tryb</p>
            <div className="flex gap-2">
              {modes.map((mode) => {
                const Icon = mode.icon
                const isActive = theme.mode === mode.value
                return (
                  <button
                    key={mode.value}
                    onClick={() => theme.setMode(mode.value)}
                    className={cn(
                      "flex-1 flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-all",
                      isActive
                        ? "border-accent bg-accent/10"
                        : "border-theme hover:border-theme-hover"
                    )}
                  >
                    <Icon className={cn(
                      "w-5 h-5",
                      isActive ? "text-accent" : "text-theme-secondary"
                    )} />
                    <span className={cn(
                      "text-xs",
                      isActive ? "text-accent font-medium" : "text-theme-secondary"
                    )}>
                      {mode.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Accent color selector */}
          <div className="p-3 border-t border-theme">
            <p className="text-xs font-medium text-theme-muted uppercase mb-2">Kolor akcentu</p>
            <div className="grid grid-cols-5 gap-2">
              {accents.map((accent) => (
                <button
                  key={accent.value}
                  onClick={() => theme.setAccent(accent.value)}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110",
                    accent.color,
                    theme.accent === accent.value && "ring-2 ring-offset-2 ring-offset-theme-secondary ring-gray-400 dark:ring-gray-500"
                  )}
                  title={accent.name}
                >
                  {theme.accent === accent.value && (
                    <Check className="w-5 h-5 text-white drop-shadow" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Quick toggles */}
          <div className="p-3 border-t border-theme space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-theme-secondary">Animacje</span>
              <button
                onClick={() => theme.setAnimations(!theme.animations)}
                className={cn(
                  "relative w-10 h-6 rounded-full transition-colors",
                  theme.animations ? "bg-accent" : "bg-gray-300 dark:bg-gray-600"
                )}
              >
                <span 
                  className={cn(
                    "absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform",
                    theme.animations ? "translate-x-5" : "translate-x-1"
                  )}
                />
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="p-3 border-t border-theme bg-theme-tertiary">
            <p className="text-xs text-theme-muted mb-2">Podgląd</p>
            <div className="flex gap-2">
              <button className="btn-accent px-3 py-1.5 rounded-lg text-sm">
                Przycisk
              </button>
              <span className="text-accent text-sm font-medium self-center">
                Link
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
