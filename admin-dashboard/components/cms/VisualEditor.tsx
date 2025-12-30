'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  Eye, EyeOff, Smartphone, Tablet, Monitor, Undo, Redo, Save,
  Plus, Trash2, Copy, GripVertical, Settings, Palette, Type,
  Image, Link as LinkIcon, Layout, Columns, Box, MousePointer,
  ChevronDown, ChevronUp, X, Check, Move, Layers, Code,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Bold, Italic, Underline, List, ListOrdered, LayoutTemplate
} from 'lucide-react'
import { TemplatesPanel } from './TemplatesPanel'

// ============ TYPY ============
export interface ElementStyle {
  // Spacing
  paddingTop?: string
  paddingRight?: string
  paddingBottom?: string
  paddingLeft?: string
  marginTop?: string
  marginRight?: string
  marginBottom?: string
  marginLeft?: string
  // Colors
  backgroundColor?: string
  textColor?: string
  borderColor?: string
  // Border
  borderWidth?: string
  borderStyle?: string
  borderRadius?: string
  // Typography
  fontSize?: string
  fontWeight?: string
  textAlign?: 'left' | 'center' | 'right' | 'justify'
  lineHeight?: string
  letterSpacing?: string
  // Layout
  width?: string
  maxWidth?: string
  minHeight?: string
  // Effects
  boxShadow?: string
  opacity?: string
}

export interface PageElement {
  id: string
  type: 'section' | 'container' | 'heading' | 'text' | 'image' | 'button' | 'spacer' | 'divider' | 'columns' | 'html' | 'video' | 'icon'
  content: any
  style: ElementStyle
  children?: PageElement[]
  settings?: any
}

interface VisualEditorProps {
  elements: PageElement[]
  onChange: (elements: PageElement[]) => void
  onSave?: () => void
}

// ============ PRESET KOLORY ============
const COLORS = [
  '#000000', '#FFFFFF', '#F9FAFB', '#F3F4F6', '#E5E7EB', '#D1D5DB', '#9CA3AF', '#6B7280', '#4B5563', '#374151', '#1F2937', '#111827',
  '#FEF2F2', '#FEE2E2', '#FECACA', '#FCA5A5', '#F87171', '#EF4444', '#DC2626', '#B91C1C', '#991B1B', '#7F1D1D',
  '#FFF7ED', '#FFEDD5', '#FED7AA', '#FDBA74', '#FB923C', '#F97316', '#EA580C', '#C2410C', '#9A3412', '#7C2D12',
  '#FEFCE8', '#FEF9C3', '#FEF08A', '#FDE047', '#FACC15', '#EAB308', '#CA8A04', '#A16207', '#854D0E', '#713F12',
  '#F0FDF4', '#DCFCE7', '#BBF7D0', '#86EFAC', '#4ADE80', '#22C55E', '#16A34A', '#15803D', '#166534', '#14532D',
  '#ECFEFF', '#CFFAFE', '#A5F3FC', '#67E8F9', '#22D3EE', '#06B6D4', '#0891B2', '#0E7490', '#155E75', '#164E63',
  '#EFF6FF', '#DBEAFE', '#BFDBFE', '#93C5FD', '#60A5FA', '#3B82F6', '#2563EB', '#1D4ED8', '#1E40AF', '#1E3A8A',
  '#F5F3FF', '#EDE9FE', '#DDD6FE', '#C4B5FD', '#A78BFA', '#8B5CF6', '#7C3AED', '#6D28D9', '#5B21B6', '#4C1D95',
  '#FDF4FF', '#FAE8FF', '#F5D0FE', '#F0ABFC', '#E879F9', '#D946EF', '#C026D3', '#A21CAF', '#86198F', '#701A75',
  '#FDF2F8', '#FCE7F3', '#FBCFE8', '#F9A8D4', '#F472B6', '#EC4899', '#DB2777', '#BE185D', '#9D174D', '#831843',
]

// ============ GENEROWANIE ID ============
const generateId = () => `el_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

// ============ DOMYŚLNE ELEMENTY ============
const DEFAULT_ELEMENTS: Record<string, Partial<PageElement>> = {
  section: {
    type: 'section',
    content: {},
    style: { paddingTop: '48px', paddingBottom: '48px', backgroundColor: '#FFFFFF' },
    children: []
  },
  container: {
    type: 'container',
    content: {},
    style: { maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '16px', paddingRight: '16px' },
    children: []
  },
  heading: {
    type: 'heading',
    content: { text: 'Nagłówek', level: 'h2' },
    style: { fontSize: '32px', fontWeight: '700', textColor: '#111827', marginBottom: '16px' }
  },
  text: {
    type: 'text',
    content: { html: '<p>Wpisz tutaj tekst...</p>' },
    style: { fontSize: '16px', textColor: '#4B5563', lineHeight: '1.6' }
  },
  image: {
    type: 'image',
    content: { src: '', alt: '', caption: '' },
    style: { width: '100%', borderRadius: '8px' }
  },
  button: {
    type: 'button',
    content: { text: 'Kliknij', url: '#', target: '_self' },
    style: { backgroundColor: '#3B82F6', textColor: '#FFFFFF', paddingTop: '12px', paddingBottom: '12px', paddingLeft: '24px', paddingRight: '24px', borderRadius: '8px', fontSize: '16px', fontWeight: '600' }
  },
  spacer: {
    type: 'spacer',
    content: { height: '32px' },
    style: {}
  },
  divider: {
    type: 'divider',
    content: {},
    style: { borderColor: '#E5E7EB', borderWidth: '1px', marginTop: '24px', marginBottom: '24px' }
  },
  columns: {
    type: 'columns',
    content: { columns: 2, gap: '24px' },
    style: {},
    children: []
  },
  html: {
    type: 'html',
    content: { code: '<div>Custom HTML</div>' },
    style: {}
  },
  video: {
    type: 'video',
    content: { url: '', type: 'youtube' },
    style: { width: '100%', borderRadius: '8px' }
  },
  icon: {
    type: 'icon',
    content: { icon: '⭐', size: '48px' },
    style: { textAlign: 'center' }
  }
}

// ============ ELEMENT ICONS ============
const ELEMENT_ICONS: Record<string, any> = {
  section: Layout,
  container: Box,
  heading: Type,
  text: AlignLeft,
  image: Image,
  button: MousePointer,
  spacer: Move,
  divider: () => <div className="w-4 h-0.5 bg-current" />,
  columns: Columns,
  html: Code,
  video: () => <span>▶</span>,
  icon: () => <span>⭐</span>
}

const ELEMENT_NAMES: Record<string, string> = {
  section: 'Sekcja',
  container: 'Kontener',
  heading: 'Nagłówek',
  text: 'Tekst',
  image: 'Obraz',
  button: 'Przycisk',
  spacer: 'Odstęp',
  divider: 'Linia',
  columns: 'Kolumny',
  html: 'HTML',
  video: 'Wideo',
  icon: 'Ikona'
}

// ============ COLOR PICKER ============
function ColorPicker({ value, onChange, label }: { value?: string; onChange: (v: string) => void; label?: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      {label && <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-8 h-8 rounded border-2 border-gray-300 shadow-sm cursor-pointer hover:border-gray-400 transition-colors"
          style={{ backgroundColor: value || 'transparent', backgroundImage: !value ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)' : undefined, backgroundSize: '8px 8px', backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px' }}
        />
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="transparent"
          className="flex-1 px-2 py-1 text-xs border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
        {value && (
          <button type="button" onClick={() => onChange('')} className="text-gray-400 hover:text-gray-600">
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
      {open && (
        <div className="absolute z-50 mt-1 p-2 bg-white rounded-lg shadow-xl border w-64">
          <div className="grid grid-cols-10 gap-1">
            {COLORS.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => { onChange(color); setOpen(false) }}
                className="w-5 h-5 rounded border border-gray-200 hover:scale-125 transition-transform"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
          <div className="mt-2 pt-2 border-t">
            <input
              type="color"
              value={value || '#000000'}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-8 cursor-pointer rounded"
            />
          </div>
        </div>
      )}
    </div>
  )
}

// ============ SPACING CONTROL ============
function SpacingControl({ 
  label, 
  values, 
  onChange 
}: { 
  label: string
  values: { top?: string; right?: string; bottom?: string; left?: string }
  onChange: (values: { top?: string; right?: string; bottom?: string; left?: string }) => void 
}) {
  const [linked, setLinked] = useState(true)
  
  const handleChange = (side: 'top' | 'right' | 'bottom' | 'left', value: string) => {
    if (linked) {
      onChange({ top: value, right: value, bottom: value, left: value })
    } else {
      onChange({ ...values, [side]: value })
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-gray-500">{label}</label>
        <button
          type="button"
          onClick={() => setLinked(!linked)}
          className={`p-1 rounded ${linked ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}
          title={linked ? 'Połączone' : 'Oddzielne'}
        >
          <LinkIcon className="w-3 h-3" />
        </button>
      </div>
      <div className="grid grid-cols-4 gap-1">
        {(['top', 'right', 'bottom', 'left'] as const).map(side => (
          <div key={side} className="text-center">
            <input
              type="text"
              value={values[side] || ''}
              onChange={(e) => handleChange(side, e.target.value)}
              placeholder="0"
              className="w-full px-1 py-1 text-xs text-center border rounded focus:ring-1 focus:ring-blue-500"
            />
            <span className="text-[10px] text-gray-400">{side[0].toUpperCase()}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============ STYLE PANEL ============
function StylePanel({ style, onChange }: { style: ElementStyle; onChange: (s: ElementStyle) => void }) {
  const [activeTab, setActiveTab] = useState<'spacing' | 'colors' | 'typography' | 'border' | 'layout'>('spacing')

  const tabs = [
    { id: 'spacing', label: 'Odstępy', icon: Box },
    { id: 'colors', label: 'Kolory', icon: Palette },
    { id: 'typography', label: 'Tekst', icon: Type },
    { id: 'border', label: 'Obramowanie', icon: () => <div className="w-4 h-4 border-2 border-current rounded" /> },
    { id: 'layout', label: 'Układ', icon: Layout },
  ]

  return (
    <div className="space-y-3">
      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded text-xs font-medium transition-colors ${
              activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="w-3 h-3" />
          </button>
        ))}
      </div>

      {activeTab === 'spacing' && (
        <div className="space-y-4">
          <SpacingControl
            label="Padding (wewnętrzny)"
            values={{ top: style.paddingTop, right: style.paddingRight, bottom: style.paddingBottom, left: style.paddingLeft }}
            onChange={(v) => onChange({ ...style, paddingTop: v.top, paddingRight: v.right, paddingBottom: v.bottom, paddingLeft: v.left })}
          />
          <SpacingControl
            label="Margin (zewnętrzny)"
            values={{ top: style.marginTop, right: style.marginRight, bottom: style.marginBottom, left: style.marginLeft }}
            onChange={(v) => onChange({ ...style, marginTop: v.top, marginRight: v.right, marginBottom: v.bottom, marginLeft: v.left })}
          />
        </div>
      )}

      {activeTab === 'colors' && (
        <div className="space-y-3">
          <ColorPicker label="Kolor tła" value={style.backgroundColor} onChange={(v) => onChange({ ...style, backgroundColor: v })} />
          <ColorPicker label="Kolor tekstu" value={style.textColor} onChange={(v) => onChange({ ...style, textColor: v })} />
        </div>
      )}

      {activeTab === 'typography' && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Rozmiar czcionki</label>
            <select
              value={style.fontSize || ''}
              onChange={(e) => onChange({ ...style, fontSize: e.target.value })}
              className="w-full px-2 py-1.5 text-sm border rounded focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Domyślny</option>
              <option value="12px">12px</option>
              <option value="14px">14px</option>
              <option value="16px">16px</option>
              <option value="18px">18px</option>
              <option value="20px">20px</option>
              <option value="24px">24px</option>
              <option value="28px">28px</option>
              <option value="32px">32px</option>
              <option value="36px">36px</option>
              <option value="48px">48px</option>
              <option value="64px">64px</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Grubość czcionki</label>
            <select
              value={style.fontWeight || ''}
              onChange={(e) => onChange({ ...style, fontWeight: e.target.value })}
              className="w-full px-2 py-1.5 text-sm border rounded focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Domyślna</option>
              <option value="300">Lekka (300)</option>
              <option value="400">Normalna (400)</option>
              <option value="500">Średnia (500)</option>
              <option value="600">Półgruba (600)</option>
              <option value="700">Gruba (700)</option>
              <option value="800">Bardzo gruba (800)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Wyrównanie</label>
            <div className="flex gap-1">
              {[
                { value: 'left', icon: AlignLeft },
                { value: 'center', icon: AlignCenter },
                { value: 'right', icon: AlignRight },
                { value: 'justify', icon: AlignJustify },
              ].map(({ value, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => onChange({ ...style, textAlign: value as any })}
                  className={`flex-1 p-2 rounded border ${style.textAlign === value ? 'bg-blue-50 border-blue-500 text-blue-600' : 'hover:bg-gray-50'}`}
                >
                  <Icon className="w-4 h-4 mx-auto" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Wysokość linii</label>
            <select
              value={style.lineHeight || ''}
              onChange={(e) => onChange({ ...style, lineHeight: e.target.value })}
              className="w-full px-2 py-1.5 text-sm border rounded focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Domyślna</option>
              <option value="1">1</option>
              <option value="1.25">1.25</option>
              <option value="1.5">1.5</option>
              <option value="1.75">1.75</option>
              <option value="2">2</option>
            </select>
          </div>
        </div>
      )}

      {activeTab === 'border' && (
        <div className="space-y-3">
          <ColorPicker label="Kolor obramowania" value={style.borderColor} onChange={(v) => onChange({ ...style, borderColor: v })} />
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Grubość obramowania</label>
            <select
              value={style.borderWidth || ''}
              onChange={(e) => onChange({ ...style, borderWidth: e.target.value })}
              className="w-full px-2 py-1.5 text-sm border rounded focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Brak</option>
              <option value="1px">1px</option>
              <option value="2px">2px</option>
              <option value="3px">3px</option>
              <option value="4px">4px</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Zaokrąglenie</label>
            <select
              value={style.borderRadius || ''}
              onChange={(e) => onChange({ ...style, borderRadius: e.target.value })}
              className="w-full px-2 py-1.5 text-sm border rounded focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Brak</option>
              <option value="4px">4px</option>
              <option value="8px">8px</option>
              <option value="12px">12px</option>
              <option value="16px">16px</option>
              <option value="24px">24px</option>
              <option value="9999px">Pełne</option>
            </select>
          </div>
        </div>
      )}

      {activeTab === 'layout' && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Szerokość</label>
            <input
              type="text"
              value={style.width || ''}
              onChange={(e) => onChange({ ...style, width: e.target.value })}
              placeholder="auto"
              className="w-full px-2 py-1.5 text-sm border rounded focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Max szerokość</label>
            <input
              type="text"
              value={style.maxWidth || ''}
              onChange={(e) => onChange({ ...style, maxWidth: e.target.value })}
              placeholder="none"
              className="w-full px-2 py-1.5 text-sm border rounded focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Min wysokość</label>
            <input
              type="text"
              value={style.minHeight || ''}
              onChange={(e) => onChange({ ...style, minHeight: e.target.value })}
              placeholder="auto"
              className="w-full px-2 py-1.5 text-sm border rounded focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      )}
    </div>
  )
}

// ============ CONTENT EDITORS ============
function HeadingContentEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Tekst nagłówka</label>
        <input
          type="text"
          value={content.text || ''}
          onChange={(e) => onChange({ ...content, text: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Wpisz nagłówek..."
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Poziom nagłówka</label>
        <div className="flex gap-1">
          {['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map(level => (
            <button
              key={level}
              type="button"
              onClick={() => onChange({ ...content, level })}
              className={`flex-1 py-2 text-sm font-medium rounded ${
                content.level === level ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {level.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function TextContentEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  const insertTag = (tag: string) => {
    const html = content.html || ''
    onChange({ ...content, html: html + `<${tag}></${tag}>` })
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1 p-1 bg-gray-100 rounded">
        <button type="button" onClick={() => insertTag('strong')} className="p-1.5 hover:bg-white rounded" title="Pogrubienie">
          <Bold className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => insertTag('em')} className="p-1.5 hover:bg-white rounded" title="Kursywa">
          <Italic className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => insertTag('u')} className="p-1.5 hover:bg-white rounded" title="Podkreślenie">
          <Underline className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-gray-300 mx-1" />
        <button type="button" onClick={() => insertTag('ul')} className="p-1.5 hover:bg-white rounded" title="Lista">
          <List className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => insertTag('ol')} className="p-1.5 hover:bg-white rounded" title="Lista numerowana">
          <ListOrdered className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => insertTag('a href="#"')} className="p-1.5 hover:bg-white rounded" title="Link">
          <LinkIcon className="w-4 h-4" />
        </button>
      </div>
      <textarea
        value={content.html || ''}
        onChange={(e) => onChange({ ...content, html: e.target.value })}
        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm min-h-[120px]"
        placeholder="<p>Wpisz tekst HTML...</p>"
      />
    </div>
  )
}

function ImageContentEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">URL obrazu</label>
        <input
          type="text"
          value={content.src || ''}
          onChange={(e) => onChange({ ...content, src: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="https://... lub /images/..."
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Tekst alternatywny (SEO)</label>
        <input
          type="text"
          value={content.alt || ''}
          onChange={(e) => onChange({ ...content, alt: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Opis obrazu"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Podpis</label>
        <input
          type="text"
          value={content.caption || ''}
          onChange={(e) => onChange({ ...content, caption: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Opcjonalny podpis"
        />
      </div>
      {content.src && (
        <div className="p-2 bg-gray-100 rounded-lg">
          <img src={content.src} alt={content.alt || ''} className="max-h-32 mx-auto rounded" />
        </div>
      )}
    </div>
  )
}

function ButtonContentEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Tekst przycisku</label>
        <input
          type="text"
          value={content.text || ''}
          onChange={(e) => onChange({ ...content, text: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Kliknij tutaj"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">URL</label>
        <input
          type="text"
          value={content.url || ''}
          onChange={(e) => onChange({ ...content, url: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="/strona lub https://..."
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Otwórz w</label>
        <select
          value={content.target || '_self'}
          onChange={(e) => onChange({ ...content, target: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="_self">Ta sama karta</option>
          <option value="_blank">Nowa karta</option>
        </select>
      </div>
    </div>
  )
}

function SpacerContentEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">Wysokość odstępu</label>
      <select
        value={content.height || '32px'}
        onChange={(e) => onChange({ ...content, height: e.target.value })}
        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
      >
        <option value="8px">8px</option>
        <option value="16px">16px</option>
        <option value="24px">24px</option>
        <option value="32px">32px</option>
        <option value="48px">48px</option>
        <option value="64px">64px</option>
        <option value="96px">96px</option>
        <option value="128px">128px</option>
      </select>
    </div>
  )
}

function ColumnsContentEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Liczba kolumn</label>
        <div className="flex gap-1">
          {[2, 3, 4].map(n => (
            <button
              key={n}
              type="button"
              onClick={() => onChange({ ...content, columns: n })}
              className={`flex-1 py-2 rounded ${content.columns === n ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Odstęp między kolumnami</label>
        <select
          value={content.gap || '24px'}
          onChange={(e) => onChange({ ...content, gap: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="8px">8px</option>
          <option value="16px">16px</option>
          <option value="24px">24px</option>
          <option value="32px">32px</option>
          <option value="48px">48px</option>
        </select>
      </div>
    </div>
  )
}

function HtmlContentEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">Kod HTML</label>
      <textarea
        value={content.code || ''}
        onChange={(e) => onChange({ ...content, code: e.target.value })}
        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm min-h-[200px]"
        placeholder="<div>...</div>"
      />
    </div>
  )
}

function VideoContentEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">URL wideo</label>
        <input
          type="text"
          value={content.url || ''}
          onChange={(e) => onChange({ ...content, url: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="https://youtube.com/watch?v=..."
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Typ</label>
        <select
          value={content.type || 'youtube'}
          onChange={(e) => onChange({ ...content, type: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="youtube">YouTube</option>
          <option value="vimeo">Vimeo</option>
          <option value="mp4">MP4</option>
        </select>
      </div>
    </div>
  )
}

function IconContentEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  const icons = ['⭐', '✓', '✗', '❤️', '🔥', '💡', '🎯', '🚀', '📦', '🛒', '📞', '✉️', '🏠', '⚙️', '🔧', '🔒']
  
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Ikona</label>
        <div className="grid grid-cols-8 gap-1">
          {icons.map(icon => (
            <button
              key={icon}
              type="button"
              onClick={() => onChange({ ...content, icon })}
              className={`p-2 text-xl rounded ${content.icon === icon ? 'bg-blue-100 ring-2 ring-blue-500' : 'hover:bg-gray-100'}`}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Rozmiar</label>
        <select
          value={content.size || '48px'}
          onChange={(e) => onChange({ ...content, size: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="24px">24px</option>
          <option value="32px">32px</option>
          <option value="48px">48px</option>
          <option value="64px">64px</option>
          <option value="96px">96px</option>
        </select>
      </div>
    </div>
  )
}

// ============ ELEMENT SETTINGS PANEL ============
function ElementSettingsPanel({ 
  element, 
  onChange, 
  onClose,
  onDelete,
  onDuplicate
}: { 
  element: PageElement
  onChange: (el: PageElement) => void
  onClose: () => void
  onDelete: () => void
  onDuplicate: () => void
}) {
  const [activeTab, setActiveTab] = useState<'content' | 'style'>('content')
  const Icon = ELEMENT_ICONS[element.type] || Box

  const renderContentEditor = () => {
    switch (element.type) {
      case 'heading': return <HeadingContentEditor content={element.content} onChange={(c) => onChange({ ...element, content: c })} />
      case 'text': return <TextContentEditor content={element.content} onChange={(c) => onChange({ ...element, content: c })} />
      case 'image': return <ImageContentEditor content={element.content} onChange={(c) => onChange({ ...element, content: c })} />
      case 'button': return <ButtonContentEditor content={element.content} onChange={(c) => onChange({ ...element, content: c })} />
      case 'spacer': return <SpacerContentEditor content={element.content} onChange={(c) => onChange({ ...element, content: c })} />
      case 'columns': return <ColumnsContentEditor content={element.content} onChange={(c) => onChange({ ...element, content: c })} />
      case 'html': return <HtmlContentEditor content={element.content} onChange={(c) => onChange({ ...element, content: c })} />
      case 'video': return <VideoContentEditor content={element.content} onChange={(c) => onChange({ ...element, content: c })} />
      case 'icon': return <IconContentEditor content={element.content} onChange={(c) => onChange({ ...element, content: c })} />
      default: return <div className="text-sm text-gray-500">Brak opcji zawartości dla tego elementu</div>
    }
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-100 rounded">
            <Icon className="w-4 h-4 text-blue-600" />
          </div>
          <span className="font-medium text-sm">{ELEMENT_NAMES[element.type]}</span>
        </div>
        <button type="button" onClick={onClose} className="p-1 hover:bg-gray-200 rounded">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          type="button"
          onClick={() => setActiveTab('content')}
          className={`flex-1 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'content' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Settings className="w-4 h-4 inline mr-1.5" />
          Zawartość
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('style')}
          className={`flex-1 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'style' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Palette className="w-4 h-4 inline mr-1.5" />
          Styl
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'content' ? renderContentEditor() : (
          <StylePanel style={element.style} onChange={(s) => onChange({ ...element, style: s })} />
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 p-4 border-t bg-gray-50">
        <button
          type="button"
          onClick={onDuplicate}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
        >
          <Copy className="w-4 h-4" />
          Duplikuj
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm bg-red-50 text-red-600 hover:bg-red-100 rounded-lg"
        >
          <Trash2 className="w-4 h-4" />
          Usuń
        </button>
      </div>
    </div>
  )
}

// ============ ELEMENT RENDERER (PREVIEW) ============
function ElementPreview({ element, isSelected, onClick, onDragStart }: { 
  element: PageElement
  isSelected: boolean
  onClick: () => void
  onDragStart: (e: React.DragEvent) => void
}) {
  const style: React.CSSProperties = {
    paddingTop: element.style.paddingTop,
    paddingRight: element.style.paddingRight,
    paddingBottom: element.style.paddingBottom,
    paddingLeft: element.style.paddingLeft,
    marginTop: element.style.marginTop,
    marginRight: element.style.marginRight,
    marginBottom: element.style.marginBottom,
    marginLeft: element.style.marginLeft,
    backgroundColor: element.style.backgroundColor,
    color: element.style.textColor,
    borderColor: element.style.borderColor,
    borderWidth: element.style.borderWidth,
    borderStyle: element.style.borderWidth ? 'solid' : undefined,
    borderRadius: element.style.borderRadius,
    fontSize: element.style.fontSize,
    fontWeight: element.style.fontWeight as any,
    textAlign: element.style.textAlign,
    lineHeight: element.style.lineHeight,
    width: element.style.width,
    maxWidth: element.style.maxWidth,
    minHeight: element.style.minHeight,
  }

  const renderContent = () => {
    switch (element.type) {
      case 'heading':
        const Tag = (element.content.level || 'h2') as keyof JSX.IntrinsicElements
        return <Tag style={style}>{element.content.text || 'Nagłówek'}</Tag>
      
      case 'text':
        return <div style={style} dangerouslySetInnerHTML={{ __html: element.content.html || '<p>Tekst...</p>' }} />
      
      case 'image':
        return element.content.src ? (
          <img src={element.content.src} alt={element.content.alt || ''} style={{ ...style, display: 'block' }} />
        ) : (
          <div style={{ ...style, padding: '32px', backgroundColor: '#F3F4F6', textAlign: 'center' }}>
            <Image className="w-12 h-12 mx-auto text-gray-400" />
            <p className="text-sm text-gray-500 mt-2">Dodaj obraz</p>
          </div>
        )
      
      case 'button':
        return (
          <button style={{ ...style, display: 'inline-block', cursor: 'pointer' }}>
            {element.content.text || 'Przycisk'}
          </button>
        )
      
      case 'spacer':
        return <div style={{ height: element.content.height || '32px', backgroundColor: isSelected ? '#EFF6FF' : 'transparent' }} />
      
      case 'divider':
        return <hr style={{ ...style, border: 'none', borderTop: `${element.style.borderWidth || '1px'} solid ${element.style.borderColor || '#E5E7EB'}` }} />
      
      case 'columns':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${element.content.columns || 2}, 1fr)`, gap: element.content.gap || '24px' }}>
            {Array.from({ length: element.content.columns || 2 }).map((_, i) => (
              <div key={i} className="min-h-[100px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                Kolumna {i + 1}
              </div>
            ))}
          </div>
        )
      
      case 'html':
        return <div style={style} dangerouslySetInnerHTML={{ __html: element.content.code || '<div>HTML</div>' }} />
      
      case 'video':
        return element.content.url ? (
          <div style={{ ...style, aspectRatio: '16/9', backgroundColor: '#000' }}>
            <div className="w-full h-full flex items-center justify-center text-white">▶ Wideo</div>
          </div>
        ) : (
          <div style={{ ...style, padding: '32px', backgroundColor: '#F3F4F6', textAlign: 'center' }}>
            <span className="text-4xl">▶</span>
            <p className="text-sm text-gray-500 mt-2">Dodaj wideo</p>
          </div>
        )
      
      case 'icon':
        return (
          <div style={{ ...style, fontSize: element.content.size || '48px' }}>
            {element.content.icon || '⭐'}
          </div>
        )
      
      case 'section':
      case 'container':
        return (
          <div style={style} className="min-h-[60px]">
            {element.children && element.children.length > 0 ? (
              element.children.map(child => (
                <ElementPreview 
                  key={child.id} 
                  element={child} 
                  isSelected={false} 
                  onClick={() => {}} 
                  onDragStart={() => {}}
                />
              ))
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-400">
                <Plus className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Przeciągnij elementy tutaj</p>
              </div>
            )}
          </div>
        )
      
      default:
        return <div style={style}>Element: {element.type}</div>
    }
  }

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={(e) => { e.stopPropagation(); onClick() }}
      className={`relative group cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:ring-2 hover:ring-blue-300 hover:ring-offset-1'
      }`}
    >
      {/* Element label */}
      <div className={`absolute -top-6 left-0 px-2 py-0.5 text-xs font-medium rounded-t transition-opacity ${
        isSelected ? 'bg-blue-500 text-white opacity-100' : 'bg-gray-500 text-white opacity-0 group-hover:opacity-100'
      }`}>
        {ELEMENT_NAMES[element.type]}
      </div>
      
      {/* Drag handle */}
      <div className={`absolute -left-6 top-1/2 -translate-y-1/2 p-1 rounded cursor-move transition-opacity ${
        isSelected ? 'bg-blue-500 text-white opacity-100' : 'bg-gray-400 text-white opacity-0 group-hover:opacity-100'
      }`}>
        <GripVertical className="w-4 h-4" />
      </div>

      {renderContent()}
    </div>
  )
}

// ============ ELEMENTS PANEL (LEFT SIDEBAR) ============
function ElementsPanel({ onAddElement }: { onAddElement: (type: string) => void }) {
  const categories = [
    {
      name: 'Układ',
      elements: ['section', 'container', 'columns']
    },
    {
      name: 'Podstawowe',
      elements: ['heading', 'text', 'image', 'button']
    },
    {
      name: 'Inne',
      elements: ['spacer', 'divider', 'icon', 'video', 'html']
    }
  ]

  return (
    <div className="p-4 space-y-6">
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Elementy</h3>
        <p className="text-xs text-gray-400 mb-4">Przeciągnij lub kliknij aby dodać</p>
      </div>

      {categories.map(category => (
        <div key={category.name}>
          <h4 className="text-xs font-medium text-gray-400 mb-2">{category.name}</h4>
          <div className="grid grid-cols-2 gap-2">
            {category.elements.map(type => {
              const Icon = ELEMENT_ICONS[type] || Box
              return (
                <button
                  key={type}
                  type="button"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('elementType', type)
                  }}
                  onClick={() => onAddElement(type)}
                  className="flex flex-col items-center gap-1.5 p-3 bg-white border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-grab active:cursor-grabbing"
                >
                  <Icon className="w-5 h-5 text-gray-600" />
                  <span className="text-xs text-gray-600">{ELEMENT_NAMES[type]}</span>
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

// ============ LAYERS PANEL ============
function LayersPanel({ 
  elements, 
  selectedId, 
  onSelect,
  onReorder 
}: { 
  elements: PageElement[]
  selectedId: string | null
  onSelect: (id: string) => void
  onReorder: (elements: PageElement[]) => void
}) {
  const renderLayer = (element: PageElement, depth: number = 0) => {
    const Icon = ELEMENT_ICONS[element.type] || Box
    const hasChildren = element.children && element.children.length > 0

    return (
      <div key={element.id}>
        <button
          type="button"
          onClick={() => onSelect(element.id)}
          className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-100 ${
            selectedId === element.id ? 'bg-blue-50 text-blue-600' : ''
          }`}
          style={{ paddingLeft: `${12 + depth * 16}px` }}
        >
          <Icon className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{ELEMENT_NAMES[element.type]}</span>
          {element.content?.text && (
            <span className="text-xs text-gray-400 truncate ml-auto">
              {element.content.text.substring(0, 20)}
            </span>
          )}
        </button>
        {hasChildren && element.children!.map(child => renderLayer(child, depth + 1))}
      </div>
    )
  }

  return (
    <div className="p-4">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Warstwy</h3>
      <div className="border rounded-lg overflow-hidden">
        {elements.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-400">
            Brak elementów
          </div>
        ) : (
          elements.map(el => renderLayer(el))
        )}
      </div>
    </div>
  )
}

// ============ MAIN VISUAL EDITOR ============
export function VisualEditor({ elements, onChange, onSave }: VisualEditorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [leftPanel, setLeftPanel] = useState<'elements' | 'layers' | 'templates'>('elements')
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [showPreview, setShowPreview] = useState(false)
  const [history, setHistory] = useState<PageElement[][]>([elements])
  const [historyIndex, setHistoryIndex] = useState(0)
  const canvasRef = useRef<HTMLDivElement>(null)

  const selectedElement = selectedId ? findElement(elements, selectedId) : null

  // Find element by ID recursively
  function findElement(els: PageElement[], id: string): PageElement | null {
    for (const el of els) {
      if (el.id === id) return el
      if (el.children) {
        const found = findElement(el.children, id)
        if (found) return found
      }
    }
    return null
  }

  // Update element by ID recursively
  function updateElement(els: PageElement[], id: string, updates: Partial<PageElement>): PageElement[] {
    return els.map(el => {
      if (el.id === id) return { ...el, ...updates }
      if (el.children) return { ...el, children: updateElement(el.children, id, updates) }
      return el
    })
  }

  // Delete element by ID recursively
  function deleteElement(els: PageElement[], id: string): PageElement[] {
    return els.filter(el => el.id !== id).map(el => {
      if (el.children) return { ...el, children: deleteElement(el.children, id) }
      return el
    })
  }

  // Add to history
  const pushHistory = (newElements: PageElement[]) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newElements)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
    onChange(newElements)
  }

  // Undo/Redo
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      onChange(history[historyIndex - 1])
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      onChange(history[historyIndex + 1])
    }
  }

  // Add element
  const addElement = (type: string) => {
    const template = DEFAULT_ELEMENTS[type]
    if (!template) return

    const newElement: PageElement = {
      ...template,
      id: generateId(),
      type: type as any,
      content: { ...template.content },
      style: { ...template.style },
      children: template.children ? [] : undefined
    }

    pushHistory([...elements, newElement])
    setSelectedId(newElement.id)
  }

  // Update selected element
  const updateSelected = (updates: Partial<PageElement>) => {
    if (!selectedId) return
    pushHistory(updateElement(elements, selectedId, updates))
  }

  // Delete selected element
  const deleteSelected = () => {
    if (!selectedId) return
    pushHistory(deleteElement(elements, selectedId))
    setSelectedId(null)
  }

  // Duplicate selected element
  const duplicateSelected = () => {
    if (!selectedId || !selectedElement) return
    const duplicate: PageElement = {
      ...selectedElement,
      id: generateId(),
      content: { ...selectedElement.content },
      style: { ...selectedElement.style },
      children: selectedElement.children ? [...selectedElement.children] : undefined
    }
    const index = elements.findIndex(el => el.id === selectedId)
    const newElements = [...elements]
    newElements.splice(index + 1, 0, duplicate)
    pushHistory(newElements)
    setSelectedId(duplicate.id)
  }

  // Handle drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const type = e.dataTransfer.getData('elementType')
    if (type) addElement(type)
  }

  const previewWidth = previewMode === 'mobile' ? '375px' : previewMode === 'tablet' ? '768px' : '100%'

  return (
    <div className="h-[calc(100vh-200px)] min-h-[600px] flex flex-col bg-gray-100 rounded-xl overflow-hidden border">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={undo}
            disabled={historyIndex === 0}
            className="p-2 hover:bg-gray-100 rounded disabled:opacity-30"
            title="Cofnij"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={redo}
            disabled={historyIndex === history.length - 1}
            className="p-2 hover:bg-gray-100 rounded disabled:opacity-30"
            title="Ponów"
          >
            <Redo className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-gray-200 mx-2" />
          <button
            type="button"
            onClick={() => setLeftPanel('elements')}
            className={`p-2 rounded ${leftPanel === 'elements' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
            title="Elementy"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setLeftPanel('templates')}
            className={`p-2 rounded ${leftPanel === 'templates' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
            title="Szablony"
          >
            <LayoutTemplate className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setLeftPanel('layers')}
            className={`p-2 rounded ${leftPanel === 'layers' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
            title="Warstwy"
          >
            <Layers className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setPreviewMode('mobile')}
            className={`p-1.5 rounded ${previewMode === 'mobile' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
            title="Mobile"
          >
            <Smartphone className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setPreviewMode('tablet')}
            className={`p-1.5 rounded ${previewMode === 'tablet' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
            title="Tablet"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setPreviewMode('desktop')}
            className={`p-1.5 rounded ${previewMode === 'desktop' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
            title="Desktop"
          >
            <Monitor className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm ${
              showPreview ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
            }`}
          >
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showPreview ? 'Edytuj' : 'Podgląd'}
          </button>
          {onSave && (
            <button
              type="button"
              onClick={onSave}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              <Save className="w-4 h-4" />
              Zapisz
            </button>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        {!showPreview && (
          <div className="w-64 bg-gray-50 border-r overflow-y-auto flex-shrink-0">
            {leftPanel === 'elements' ? (
              <ElementsPanel onAddElement={addElement} />
            ) : leftPanel === 'templates' ? (
              <TemplatesPanel onInsert={(templateElements) => {
                pushHistory([...elements, ...templateElements])
              }} />
            ) : (
              <LayersPanel 
                elements={elements} 
                selectedId={selectedId} 
                onSelect={setSelectedId}
                onReorder={pushHistory}
              />
            )}
          </div>
        )}

        {/* Canvas */}
        <div 
          ref={canvasRef}
          className="flex-1 overflow-auto p-8"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => setSelectedId(null)}
        >
          <div 
            className="mx-auto bg-white min-h-full shadow-lg transition-all duration-300"
            style={{ width: previewWidth, maxWidth: '100%' }}
          >
            {elements.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                <Plus className="w-16 h-16 mb-4" />
                <p className="text-lg font-medium">Zacznij budować stronę</p>
                <p className="text-sm">Przeciągnij elementy z panelu po lewej</p>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {elements.map(element => (
                  <ElementPreview
                    key={element.id}
                    element={element}
                    isSelected={selectedId === element.id}
                    onClick={() => setSelectedId(element.id)}
                    onDragStart={(e) => {
                      e.dataTransfer.setData('elementId', element.id)
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Settings */}
        {!showPreview && selectedElement && (
          <div className="w-80 border-l bg-white overflow-y-auto flex-shrink-0">
            <ElementSettingsPanel
              element={selectedElement}
              onChange={(el) => updateSelected(el)}
              onClose={() => setSelectedId(null)}
              onDelete={deleteSelected}
              onDuplicate={duplicateSelected}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default VisualEditor
