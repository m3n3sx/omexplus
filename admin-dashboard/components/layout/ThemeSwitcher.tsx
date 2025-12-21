"use client"

import { useState, useRef, useEffect } from "react"
import { Sun, Moon, Palette, Check } from "lucide-react"
import { useTheme, AccentColor } from "@/contexts/ThemeContext"
import { cn } from "@/lib/utils"

type ThemeMode = 'light' | 'dark'

export default function ThemeSwitcher() {
  const { theme, setMode, setAccent } = useTheme()
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
  ]

  const accents: { value: AccentColor; color: string }[] = [
    { value: 'blue', color: 'bg-blue-500' },
    { value: 'green', color: 'bg-emerald-500' },
    { value: 'purple', color: 'bg-violet-500' },
    { value: 'orange', color: 'bg-orange-500' },
    { value: 'rose', color: 'bg-rose-500' },
  ]

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-theme-secondary hover:text-theme-primary hover:bg-theme-hover rounded-lg transition-colors"
        title="Motyw"
      >
        <Palette className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-theme-secondary rounded-xl shadow-2xl border border-theme z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-theme">
            <h3 className="font-semibold text-theme-primary">Motyw</h3>
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
                    onClick={() => setMode(mode.value)}
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
            <div className="flex gap-2">
              {accents.map((accent) => (
                <button
                  key={accent.value}
                  onClick={() => setAccent(accent.value)}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110",
                    accent.color,
                    theme.accent === accent.value && "ring-2 ring-offset-2 ring-gray-400"
                  )}
                  title={accent.value}
                >
                  {theme.accent === accent.value && (
                    <Check className="w-5 h-5 text-white" />
                  )}
                </button>
              ))}
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
