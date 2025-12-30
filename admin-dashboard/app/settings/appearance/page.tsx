"use client"

import { useState } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
import Button from "@/components/ui/Button"
import { useTheme, AccentColor, ThemeMode, SidebarStyle, FontSize, BorderRadius, DensityMode } from "@/contexts/ThemeContext"
import { 
  Sun, Moon, Monitor, Palette, Layout, Type, Square, 
  Maximize2, Minimize2, RotateCcw, Check, Sparkles,
  PanelLeft, PanelLeftClose, Sidebar
} from "lucide-react"

const accentColors: { id: AccentColor; name: string; color: string; ring: string }[] = [
  { id: 'blue', name: 'Niebieski', color: 'bg-blue-500', ring: 'ring-blue-500' },
  { id: 'green', name: 'Zielony', color: 'bg-green-500', ring: 'ring-green-500' },
  { id: 'purple', name: 'Fioletowy', color: 'bg-purple-500', ring: 'ring-purple-500' },
  { id: 'orange', name: 'Pomarańczowy', color: 'bg-orange-500', ring: 'ring-orange-500' },
  { id: 'rose', name: 'Różowy', color: 'bg-rose-500', ring: 'ring-rose-500' },
  { id: 'cyan', name: 'Cyjan', color: 'bg-cyan-500', ring: 'ring-cyan-500' },
  { id: 'amber', name: 'Bursztynowy', color: 'bg-amber-500', ring: 'ring-amber-500' },
  { id: 'emerald', name: 'Szmaragdowy', color: 'bg-emerald-500', ring: 'ring-emerald-500' },
  { id: 'indigo', name: 'Indygo', color: 'bg-indigo-500', ring: 'ring-indigo-500' },
  { id: 'pink', name: 'Różowy jasny', color: 'bg-pink-500', ring: 'ring-pink-500' },
]

const themeModes: { id: ThemeMode; name: string; icon: typeof Sun; desc: string }[] = [
  { id: 'light', name: 'Jasny', icon: Sun, desc: 'Jasne tło, ciemny tekst' },
  { id: 'dark', name: 'Ciemny', icon: Moon, desc: 'Ciemne tło, jasny tekst' },
  { id: 'system', name: 'Systemowy', icon: Monitor, desc: 'Dopasuj do systemu' },
]

const sidebarStyles: { id: SidebarStyle; name: string; icon: typeof Sidebar; desc: string }[] = [
  { id: 'default', name: 'Domyślny', icon: PanelLeft, desc: 'Pełny sidebar z ikonami i tekstem' },
  { id: 'compact', name: 'Kompaktowy', icon: PanelLeftClose, desc: 'Węższy sidebar' },
  { id: 'minimal', name: 'Minimalny', icon: Sidebar, desc: 'Tylko ikony' },
]

const fontSizes: { id: FontSize; name: string; size: string }[] = [
  { id: 'small', name: 'Mały', size: '14px' },
  { id: 'medium', name: 'Średni', size: '16px' },
  { id: 'large', name: 'Duży', size: '18px' },
]

const borderRadii: { id: BorderRadius; name: string; preview: string }[] = [
  { id: 'none', name: 'Brak', preview: 'rounded-none' },
  { id: 'small', name: 'Mały', preview: 'rounded-sm' },
  { id: 'medium', name: 'Średni', preview: 'rounded-md' },
  { id: 'large', name: 'Duży', preview: 'rounded-lg' },
  { id: 'full', name: 'Pełny', preview: 'rounded-full' },
]

const densityModes: { id: DensityMode; name: string; icon: typeof Maximize2; desc: string }[] = [
  { id: 'compact', name: 'Kompaktowy', icon: Minimize2, desc: 'Mniejsze odstępy' },
  { id: 'comfortable', name: 'Komfortowy', icon: Layout, desc: 'Standardowe odstępy' },
  { id: 'spacious', name: 'Przestronny', icon: Maximize2, desc: 'Większe odstępy' },
]

export default function AppearanceSettingsPage() {
  const theme = useTheme()
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Wygląd</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Dostosuj wygląd panelu administracyjnego do swoich preferencji
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={theme.resetToDefaults}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Resetuj
            </button>
            <Button onClick={handleSave} className="flex items-center gap-2">
              {saved ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              {saved ? 'Zapisano!' : 'Zapisz'}
            </Button>
          </div>
        </div>

        {/* Theme Mode */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="w-5 h-5" />
              Tryb kolorystyczny
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {themeModes.map((mode) => {
                const Icon = mode.icon
                const isActive = theme.mode === mode.id
                return (
                  <button
                    key={mode.id}
                    onClick={() => theme.setMode(mode.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      isActive 
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${isActive ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">{mode.name}</span>
                      {isActive && <Check className="w-4 h-4 text-primary-500 ml-auto" />}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{mode.desc}</p>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Accent Color */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Kolor akcentu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
              {accentColors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => theme.setAccent(color.id)}
                  className={`group relative aspect-square rounded-xl ${color.color} transition-all hover:scale-110 ${
                    theme.accent === color.id ? `ring-2 ${color.ring} ring-offset-2 dark:ring-offset-gray-900` : ''
                  }`}
                  title={color.name}
                >
                  {theme.accent === color.id && (
                    <Check className="absolute inset-0 m-auto w-5 h-5 text-white" />
                  )}
                </button>
              ))}
            </div>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              Wybrany kolor: <span className="font-medium">{accentColors.find(c => c.id === theme.accent)?.name}</span>
            </p>
          </CardContent>
        </Card>

        {/* Sidebar Style */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layout className="w-5 h-5" />
              Styl paska bocznego
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sidebarStyles.map((style) => {
                const Icon = style.icon
                const isActive = theme.sidebarStyle === style.id
                return (
                  <button
                    key={style.id}
                    onClick={() => theme.setSidebarStyle(style.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      isActive 
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${isActive ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">{style.name}</span>
                      {isActive && <Check className="w-4 h-4 text-primary-500 ml-auto" />}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{style.desc}</p>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Font Size */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="w-5 h-5" />
              Rozmiar czcionki
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              {fontSizes.map((size) => {
                const isActive = theme.fontSize === size.id
                return (
                  <button
                    key={size.id}
                    onClick={() => theme.setFontSize(size.id)}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                      isActive 
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="text-center">
                      <span 
                        className="block font-medium text-gray-900 dark:text-white mb-1"
                        style={{ fontSize: size.size }}
                      >
                        Aa
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{size.name}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Border Radius */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Square className="w-5 h-5" />
              Zaokrąglenie rogów
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              {borderRadii.map((radius) => {
                const isActive = theme.borderRadius === radius.id
                return (
                  <button
                    key={radius.id}
                    onClick={() => theme.setBorderRadius(radius.id)}
                    className={`flex-1 p-3 border-2 transition-all ${radius.preview} ${
                      isActive 
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`w-8 h-8 mx-auto mb-2 bg-gray-300 dark:bg-gray-600 ${radius.preview}`} />
                      <span className="text-xs text-gray-600 dark:text-gray-400">{radius.name}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Density */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Maximize2 className="w-5 h-5" />
              Gęstość interfejsu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {densityModes.map((density) => {
                const Icon = density.icon
                const isActive = theme.density === density.id
                return (
                  <button
                    key={density.id}
                    onClick={() => theme.setDensity(density.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      isActive 
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${isActive ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">{density.name}</span>
                      {isActive && <Check className="w-4 h-4 text-primary-500 ml-auto" />}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{density.desc}</p>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Animations Toggle */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Animacje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Włącz animacje</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Płynne przejścia i efekty wizualne
                </p>
              </div>
              <button
                onClick={() => theme.setAnimations(!theme.animations)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  theme.animations ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span 
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                    theme.animations ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Podgląd</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary-500" />
                <div>
                  <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded mb-2" />
                  <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="h-20 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600" />
                <div className="h-20 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600" />
                <div className="h-20 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600" />
              </div>
              <div className="mt-4 flex gap-2">
                <button className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium">
                  Przycisk główny
                </button>
                <button className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium">
                  Przycisk drugi
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
