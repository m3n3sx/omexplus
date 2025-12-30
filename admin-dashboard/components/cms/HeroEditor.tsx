'use client'

import { useState } from 'react'
import { 
  ColorPicker, 
  ImageEditor,
  LinksListEditor,
  StatsEditor,
  CMSLink,
  CMSImage,
  Stat
} from './CMSEditor'
import { Settings, Palette, Image, BarChart3, MousePointer } from 'lucide-react'

export interface HeroContent {
  badge?: string
  title: string
  subtitle?: string
  description?: string
  backgroundColor?: string
  textColor?: string
  image?: CMSImage
  backgroundImage?: string
  buttons: CMSLink[]
  stats: Stat[]
  layout?: 'left' | 'right' | 'center'
  overlay?: boolean
  overlayColor?: string
  overlayOpacity?: number
}

const defaultContent: HeroContent = {
  badge: 'Nowa kolekcja 2024',
  title: 'Części do maszyn budowlanych',
  subtitle: '',
  description: 'Odkryj najwyższej jakości części zamienne do koparek, ładowarek i innych maszyn budowlanych.',
  backgroundColor: '#F9FAFB',
  textColor: '#111827',
  buttons: [],
  stats: [],
  layout: 'left',
  overlay: false,
  overlayColor: '#000000',
  overlayOpacity: 50,
}

interface HeroEditorProps {
  content: Partial<HeroContent>
  onChange: (content: HeroContent) => void
}

export function HeroEditor({ content, onChange }: HeroEditorProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'image' | 'stats' | 'buttons'>('content')
  const data: HeroContent = { ...defaultContent, ...content }

  const tabs = [
    { id: 'content', label: 'Treść', icon: Settings },
    { id: 'style', label: 'Styl', icon: Palette },
    { id: 'image', label: 'Obraz', icon: Image },
    { id: 'stats', label: 'Statystyki', icon: BarChart3 },
    { id: 'buttons', label: 'Przyciski', icon: MousePointer },
  ]

  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'content' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Badge (etykieta)</label>
            <input
              type="text"
              value={data.badge || ''}
              onChange={(e) => onChange({ ...data, badge: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Nowa kolekcja 2024"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tytuł główny</label>
            <input
              type="text"
              value={data.title || ''}
              onChange={(e) => onChange({ ...data, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg text-lg font-bold"
              placeholder="Główny nagłówek"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Podtytuł</label>
            <input
              type="text"
              value={data.subtitle || ''}
              onChange={(e) => onChange({ ...data, subtitle: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Opcjonalny podtytuł"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Opis</label>
            <textarea
              value={data.description || ''}
              onChange={(e) => onChange({ ...data, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              rows={3}
              placeholder="Dłuższy opis..."
            />
          </div>
        </div>
      )}

      {activeTab === 'style' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <ColorPicker
              label="Kolor tła"
              value={data.backgroundColor || ''}
              onChange={(color) => onChange({ ...data, backgroundColor: color })}
            />
            <ColorPicker
              label="Kolor tekstu"
              value={data.textColor || ''}
              onChange={(color) => onChange({ ...data, textColor: color })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Układ</label>
            <div className="flex gap-2">
              {(['left', 'center', 'right'] as const).map(layout => (
                <button
                  key={layout}
                  type="button"
                  onClick={() => onChange({ ...data, layout })}
                  className={`flex-1 py-3 rounded-lg border-2 transition-colors ${
                    data.layout === layout
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {layout === 'left' && 'Tekst po lewej'}
                  {layout === 'center' && 'Wyśrodkowany'}
                  {layout === 'right' && 'Tekst po prawej'}
                </button>
              ))}
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={data.overlay || false}
                onChange={(e) => onChange({ ...data, overlay: e.target.checked })}
                className="w-5 h-5 rounded"
              />
              <span className="font-medium">Nakładka na obraz</span>
            </label>
            
            {data.overlay && (
              <div className="grid grid-cols-2 gap-4 pl-8">
                <ColorPicker
                  label="Kolor nakładki"
                  value={data.overlayColor || '#000000'}
                  onChange={(color) => onChange({ ...data, overlayColor: color })}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Przezroczystość</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={data.overlayOpacity || 50}
                    onChange={(e) => onChange({ ...data, overlayOpacity: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-500">{data.overlayOpacity || 50}%</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'image' && (
        <div className="space-y-4">
          <ImageEditor
            image={data.image || { src: '', alt: '' }}
            onChange={(image) => onChange({ ...data, image })}
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lub obraz tła (pełna szerokość)</label>
            <input
              type="text"
              value={data.backgroundImage || ''}
              onChange={(e) => onChange({ ...data, backgroundImage: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="/images/hero-bg.jpg"
            />
          </div>
        </div>
      )}

      {activeTab === 'stats' && (
        <StatsEditor
          stats={data.stats}
          onChange={(stats) => onChange({ ...data, stats })}
        />
      )}

      {activeTab === 'buttons' && (
        <LinksListEditor
          links={data.buttons}
          onChange={(buttons) => onChange({ ...data, buttons })}
          title="Przyciski CTA"
        />
      )}
    </div>
  )
}

export default HeroEditor
