'use client'

import { useState, useEffect } from 'react'
import { 
  Save, Eye, Trash2, Plus, GripVertical, Link as LinkIcon, 
  Image, Type, Palette, AlignLeft, AlignCenter, AlignRight,
  Bold, Italic, Underline, List, ListOrdered, Code,
  ChevronDown, ChevronUp, Copy, Settings, Layers, X
} from 'lucide-react'

// Typy dla elementów CMS
export interface CMSLink {
  text: string
  url: string
  target?: '_blank' | '_self'
  style?: 'button' | 'link' | 'outline'
  color?: string
}

export interface CMSImage {
  src: string
  alt: string
  width?: number
  height?: number
}

export interface CMSStyle {
  backgroundColor?: string
  textColor?: string
  padding?: string
  margin?: string
  borderRadius?: string
  fontSize?: string
  fontWeight?: string
  textAlign?: 'left' | 'center' | 'right'
}

export interface CMSBlock {
  id: string
  type: 'text' | 'heading' | 'image' | 'button' | 'link' | 'divider' | 'spacer' | 'html' | 'list' | 'grid' | 'columns'
  content: any
  style?: CMSStyle
  order: number
}

// Predefiniowane kolory
const PRESET_COLORS = [
  '#000000', '#FFFFFF', '#F3F4F6', '#E5E7EB', '#D1D5DB',
  '#EF4444', '#F97316', '#F59E0B', '#FFAA21', '#84CC16',
  '#22C55E', '#14B8A6', '#06B6D4', '#3B82F6', '#6366F1',
  '#8B5CF6', '#A855F7', '#D946EF', '#EC4899', '#F43F5E',
]

// Komponent wyboru koloru
export function ColorPicker({ 
  value, 
  onChange, 
  label 
}: { 
  value: string
  onChange: (color: string) => void
  label: string 
}) {
  const [showPicker, setShowPicker] = useState(false)
  
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowPicker(!showPicker)}
          className="w-10 h-10 rounded border-2 border-gray-300 shadow-sm"
          style={{ backgroundColor: value || '#FFFFFF' }}
        />
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="flex-1 px-3 py-2 border rounded-lg text-sm"
        />
      </div>
      {showPicker && (
        <div className="absolute z-50 mt-2 p-3 bg-white rounded-lg shadow-xl border">
          <div className="grid grid-cols-5 gap-2">
            {PRESET_COLORS.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => { onChange(color); setShowPicker(false) }}
                className="w-8 h-8 rounded border hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => { onChange(''); setShowPicker(false) }}
            className="mt-2 w-full text-sm text-gray-500 hover:text-gray-700"
          >
            Usuń kolor
          </button>
        </div>
      )}
    </div>
  )
}

// Komponent edycji linku
export function LinkEditor({
  link,
  onChange,
  onRemove
}: {
  link: CMSLink
  onChange: (link: CMSLink) => void
  onRemove?: () => void
}) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg border space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <LinkIcon className="w-4 h-4" /> Link
        </span>
        {onRemove && (
          <button type="button" onClick={onRemove} className="text-red-500 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Tekst</label>
          <input
            type="text"
            value={link.text || ''}
            onChange={(e) => onChange({ ...link, text: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm"
            placeholder="Kliknij tutaj"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">URL</label>
          <input
            type="text"
            value={link.url || ''}
            onChange={(e) => onChange({ ...link, url: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm"
            placeholder="/strona lub https://..."
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Otwórz w</label>
          <select
            value={link.target || '_self'}
            onChange={(e) => onChange({ ...link, target: e.target.value as '_blank' | '_self' })}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          >
            <option value="_self">Ta sama karta</option>
            <option value="_blank">Nowa karta</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Styl</label>
          <select
            value={link.style || 'link'}
            onChange={(e) => onChange({ ...link, style: e.target.value as 'button' | 'link' | 'outline' })}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          >
            <option value="link">Link</option>
            <option value="button">Przycisk</option>
            <option value="outline">Outline</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Kolor</label>
          <input
            type="color"
            value={link.color || '#3B82F6'}
            onChange={(e) => onChange({ ...link, color: e.target.value })}
            className="w-full h-10 rounded border cursor-pointer"
          />
        </div>
      </div>
    </div>
  )
}

// Komponent edycji obrazu
export function ImageEditor({
  image,
  onChange
}: {
  image: CMSImage
  onChange: (image: CMSImage) => void
}) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg border space-y-3">
      <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <Image className="w-4 h-4" /> Obraz
      </span>
      <div>
        <label className="block text-xs text-gray-500 mb-1">URL obrazu</label>
        <input
          type="text"
          value={image.src || ''}
          onChange={(e) => onChange({ ...image, src: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg text-sm"
          placeholder="https://... lub /images/..."
        />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Tekst alternatywny (SEO)</label>
        <input
          type="text"
          value={image.alt || ''}
          onChange={(e) => onChange({ ...image, alt: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg text-sm"
          placeholder="Opis obrazu"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Szerokość (px)</label>
          <input
            type="number"
            value={image.width || ''}
            onChange={(e) => onChange({ ...image, width: parseInt(e.target.value) || undefined })}
            className="w-full px-3 py-2 border rounded-lg text-sm"
            placeholder="auto"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Wysokość (px)</label>
          <input
            type="number"
            value={image.height || ''}
            onChange={(e) => onChange({ ...image, height: parseInt(e.target.value) || undefined })}
            className="w-full px-3 py-2 border rounded-lg text-sm"
            placeholder="auto"
          />
        </div>
      </div>
      {image.src && (
        <div className="mt-2 p-2 bg-white rounded border">
          <img src={image.src} alt={image.alt} className="max-h-32 mx-auto object-contain" />
        </div>
      )}
    </div>
  )
}

// Komponent edycji stylu
export function StyleEditor({
  style,
  onChange
}: {
  style: CMSStyle
  onChange: (style: CMSStyle) => void
}) {
  const [expanded, setExpanded] = useState(false)
  
  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 bg-gray-50 flex items-center justify-between hover:bg-gray-100"
      >
        <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Palette className="w-4 h-4" /> Style i wygląd
        </span>
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      
      {expanded && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ColorPicker
              label="Kolor tła"
              value={style.backgroundColor || ''}
              onChange={(color) => onChange({ ...style, backgroundColor: color })}
            />
            <ColorPicker
              label="Kolor tekstu"
              value={style.textColor || ''}
              onChange={(color) => onChange({ ...style, textColor: color })}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Padding</label>
              <select
                value={style.padding || ''}
                onChange={(e) => onChange({ ...style, padding: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                <option value="">Domyślny</option>
                <option value="0">Brak</option>
                <option value="8px">Mały (8px)</option>
                <option value="16px">Średni (16px)</option>
                <option value="24px">Duży (24px)</option>
                <option value="32px">Bardzo duży (32px)</option>
                <option value="48px">Ogromny (48px)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Margines</label>
              <select
                value={style.margin || ''}
                onChange={(e) => onChange({ ...style, margin: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                <option value="">Domyślny</option>
                <option value="0">Brak</option>
                <option value="8px">Mały (8px)</option>
                <option value="16px">Średni (16px)</option>
                <option value="24px">Duży (24px)</option>
                <option value="32px">Bardzo duży (32px)</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Zaokrąglenie</label>
              <select
                value={style.borderRadius || ''}
                onChange={(e) => onChange({ ...style, borderRadius: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                <option value="">Brak</option>
                <option value="4px">Małe</option>
                <option value="8px">Średnie</option>
                <option value="16px">Duże</option>
                <option value="9999px">Pełne</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rozmiar tekstu</label>
              <select
                value={style.fontSize || ''}
                onChange={(e) => onChange({ ...style, fontSize: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                <option value="">Domyślny</option>
                <option value="12px">Mały (12px)</option>
                <option value="14px">Normalny (14px)</option>
                <option value="16px">Średni (16px)</option>
                <option value="18px">Duży (18px)</option>
                <option value="24px">Bardzo duży (24px)</option>
                <option value="32px">Nagłówek (32px)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grubość</label>
              <select
                value={style.fontWeight || ''}
                onChange={(e) => onChange({ ...style, fontWeight: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                <option value="">Normalna</option>
                <option value="300">Lekka</option>
                <option value="500">Średnia</option>
                <option value="600">Półgruba</option>
                <option value="700">Gruba</option>
                <option value="800">Bardzo gruba</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Wyrównanie tekstu</label>
            <div className="flex gap-2">
              {(['left', 'center', 'right'] as const).map(align => (
                <button
                  key={align}
                  type="button"
                  onClick={() => onChange({ ...style, textAlign: align })}
                  className={`flex-1 py-2 rounded border ${
                    style.textAlign === align ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-50'
                  }`}
                >
                  {align === 'left' && <AlignLeft className="w-4 h-4 mx-auto" />}
                  {align === 'center' && <AlignCenter className="w-4 h-4 mx-auto" />}
                  {align === 'right' && <AlignRight className="w-4 h-4 mx-auto" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Edytor tekstu z formatowaniem
export function RichTextEditor({
  value,
  onChange,
  placeholder
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  const [showHtml, setShowHtml] = useState(false)
  
  const insertTag = (tag: string, wrap = true) => {
    const textarea = document.getElementById('rich-text-area') as HTMLTextAreaElement
    if (!textarea) return
    
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = value.substring(start, end)
    
    let newText = ''
    if (wrap && selected) {
      newText = value.substring(0, start) + `<${tag}>${selected}</${tag}>` + value.substring(end)
    } else {
      newText = value.substring(0, start) + `<${tag}></${tag}>` + value.substring(end)
    }
    onChange(newText)
  }
  
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex items-center gap-1 p-2 bg-gray-50 border-b flex-wrap">
        <button type="button" onClick={() => insertTag('strong')} className="p-2 hover:bg-gray-200 rounded" title="Pogrubienie">
          <Bold className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => insertTag('em')} className="p-2 hover:bg-gray-200 rounded" title="Kursywa">
          <Italic className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => insertTag('u')} className="p-2 hover:bg-gray-200 rounded" title="Podkreślenie">
          <Underline className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <button type="button" onClick={() => insertTag('h2')} className="p-2 hover:bg-gray-200 rounded text-sm font-bold" title="Nagłówek 2">
          H2
        </button>
        <button type="button" onClick={() => insertTag('h3')} className="p-2 hover:bg-gray-200 rounded text-sm font-bold" title="Nagłówek 3">
          H3
        </button>
        <button type="button" onClick={() => insertTag('p')} className="p-2 hover:bg-gray-200 rounded text-sm" title="Paragraf">
          P
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <button type="button" onClick={() => insertTag('ul')} className="p-2 hover:bg-gray-200 rounded" title="Lista">
          <List className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => insertTag('ol')} className="p-2 hover:bg-gray-200 rounded" title="Lista numerowana">
          <ListOrdered className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => insertTag('li')} className="p-2 hover:bg-gray-200 rounded text-sm" title="Element listy">
          LI
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <button type="button" onClick={() => insertTag('a href=""')} className="p-2 hover:bg-gray-200 rounded" title="Link">
          <LinkIcon className="w-4 h-4" />
        </button>
        <div className="flex-1" />
        <button 
          type="button" 
          onClick={() => setShowHtml(!showHtml)} 
          className={`p-2 rounded ${showHtml ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
          title="Pokaż HTML"
        >
          <Code className="w-4 h-4" />
        </button>
      </div>
      <textarea
        id="rich-text-area"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-4 min-h-[200px] resize-y focus:outline-none font-mono text-sm"
      />
      {!showHtml && value && (
        <div className="p-4 border-t bg-gray-50">
          <div className="text-xs text-gray-500 mb-2">Podgląd:</div>
          <div 
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: value }}
          />
        </div>
      )}
    </div>
  )
}

// Edytor listy linków (np. dla menu, footera)
export function LinksListEditor({
  links,
  onChange,
  title
}: {
  links: CMSLink[]
  onChange: (links: CMSLink[]) => void
  title?: string
}) {
  const addLink = () => {
    onChange([...links, { text: '', url: '', target: '_self', style: 'link' }])
  }
  
  const updateLink = (index: number, link: CMSLink) => {
    const newLinks = [...links]
    newLinks[index] = link
    onChange(newLinks)
  }
  
  const removeLink = (index: number) => {
    onChange(links.filter((_, i) => i !== index))
  }
  
  const moveLink = (index: number, direction: 'up' | 'down') => {
    const newLinks = [...links]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= links.length) return
    [newLinks[index], newLinks[newIndex]] = [newLinks[newIndex], newLinks[index]]
    onChange(newLinks)
  }
  
  return (
    <div className="space-y-3">
      {title && <h4 className="font-medium text-gray-700">{title}</h4>}
      {links.map((link, index) => (
        <div key={index} className="flex items-start gap-2">
          <div className="flex flex-col gap-1 pt-4">
            <button
              type="button"
              onClick={() => moveLink(index, 'up')}
              disabled={index === 0}
              className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => moveLink(index, 'down')}
              disabled={index === links.length - 1}
              className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1">
            <LinkEditor
              link={link}
              onChange={(l) => updateLink(index, l)}
              onRemove={() => removeLink(index)}
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addLink}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" /> Dodaj link
      </button>
    </div>
  )
}

// Edytor kolumn footera
export interface FooterColumn {
  title: string
  links: CMSLink[]
}

export function FooterColumnsEditor({
  columns,
  onChange
}: {
  columns: FooterColumn[]
  onChange: (columns: FooterColumn[]) => void
}) {
  const addColumn = () => {
    onChange([...columns, { title: 'Nowa kolumna', links: [] }])
  }
  
  const updateColumn = (index: number, column: FooterColumn) => {
    const newColumns = [...columns]
    newColumns[index] = column
    onChange(newColumns)
  }
  
  const removeColumn = (index: number) => {
    onChange(columns.filter((_, i) => i !== index))
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-700">Kolumny footera</h4>
        <button
          type="button"
          onClick={addColumn}
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          <Plus className="w-4 h-4" /> Dodaj kolumnę
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {columns.map((column, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center justify-between mb-3">
              <input
                type="text"
                value={column.title}
                onChange={(e) => updateColumn(index, { ...column, title: e.target.value })}
                className="font-medium bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
                placeholder="Tytuł kolumny"
              />
              <button
                type="button"
                onClick={() => removeColumn(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <LinksListEditor
              links={column.links}
              onChange={(links) => updateColumn(index, { ...column, links })}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// Edytor social media
export interface SocialLink {
  platform: 'facebook' | 'instagram' | 'linkedin' | 'youtube' | 'twitter' | 'tiktok'
  url: string
}

const SOCIAL_PLATFORMS = [
  { id: 'facebook', name: 'Facebook', icon: '📘' },
  { id: 'instagram', name: 'Instagram', icon: '📷' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
  { id: 'youtube', name: 'YouTube', icon: '📺' },
  { id: 'twitter', name: 'Twitter/X', icon: '🐦' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵' },
]

export function SocialLinksEditor({
  links,
  onChange
}: {
  links: SocialLink[]
  onChange: (links: SocialLink[]) => void
}) {
  const addSocial = (platform: SocialLink['platform']) => {
    if (links.some(l => l.platform === platform)) return
    onChange([...links, { platform, url: '' }])
  }
  
  const updateSocial = (index: number, url: string) => {
    const newLinks = [...links]
    newLinks[index].url = url
    onChange(newLinks)
  }
  
  const removeSocial = (index: number) => {
    onChange(links.filter((_, i) => i !== index))
  }
  
  const availablePlatforms = SOCIAL_PLATFORMS.filter(
    p => !links.some(l => l.platform === p.id)
  )
  
  return (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-700">Social Media</h4>
      
      {links.map((link, index) => {
        const platform = SOCIAL_PLATFORMS.find(p => p.id === link.platform)
        return (
          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <span className="text-2xl">{platform?.icon}</span>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700">{platform?.name}</div>
              <input
                type="text"
                value={link.url}
                onChange={(e) => updateSocial(index, e.target.value)}
                className="w-full px-3 py-1 border rounded text-sm mt-1"
                placeholder={`https://${link.platform}.com/...`}
              />
            </div>
            <button
              type="button"
              onClick={() => removeSocial(index)}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )
      })}
      
      {availablePlatforms.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {availablePlatforms.map(platform => (
            <button
              key={platform.id}
              type="button"
              onClick={() => addSocial(platform.id as SocialLink['platform'])}
              className="px-3 py-2 bg-white border rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm"
            >
              <span>{platform.icon}</span>
              <span>{platform.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Edytor statystyk (dla hero)
export interface Stat {
  value: string
  label: string
}

export function StatsEditor({
  stats,
  onChange
}: {
  stats: Stat[]
  onChange: (stats: Stat[]) => void
}) {
  const addStat = () => {
    onChange([...stats, { value: '', label: '' }])
  }
  
  const updateStat = (index: number, stat: Stat) => {
    const newStats = [...stats]
    newStats[index] = stat
    onChange(newStats)
  }
  
  const removeStat = (index: number) => {
    onChange(stats.filter((_, i) => i !== index))
  }
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-700">Statystyki</h4>
        <button
          type="button"
          onClick={addStat}
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          <Plus className="w-4 h-4" /> Dodaj
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {stats.map((stat, index) => (
          <div key={index} className="p-3 bg-gray-50 rounded-lg border relative">
            <button
              type="button"
              onClick={() => removeStat(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              <X className="w-3 h-3" />
            </button>
            <input
              type="text"
              value={stat.value}
              onChange={(e) => updateStat(index, { ...stat, value: e.target.value })}
              className="w-full text-2xl font-bold text-center bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
              placeholder="5000+"
            />
            <input
              type="text"
              value={stat.label}
              onChange={(e) => updateStat(index, { ...stat, label: e.target.value })}
              className="w-full text-sm text-center text-gray-500 bg-transparent mt-1"
              placeholder="Produktów"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// Edytor kontaktu (dla topbar, footera)
export interface ContactInfo {
  phone?: string
  email?: string
  address?: string
  workingHours?: string
}

export function ContactInfoEditor({
  contact,
  onChange
}: {
  contact: ContactInfo
  onChange: (contact: ContactInfo) => void
}) {
  return (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-700">Dane kontaktowe</h4>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-500 mb-1">Telefon</label>
          <input
            type="text"
            value={contact.phone || ''}
            onChange={(e) => onChange({ ...contact, phone: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="+48 500 169 060"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1">Email</label>
          <input
            type="email"
            value={contact.email || ''}
            onChange={(e) => onChange({ ...contact, email: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="kontakt@firma.pl"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm text-gray-500 mb-1">Adres</label>
          <input
            type="text"
            value={contact.address || ''}
            onChange={(e) => onChange({ ...contact, address: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="ul. Przykładowa 1, 00-000 Miasto"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm text-gray-500 mb-1">Godziny pracy</label>
          <input
            type="text"
            value={contact.workingHours || ''}
            onChange={(e) => onChange({ ...contact, workingHours: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Pon-Pt: 8:00-16:00"
          />
        </div>
      </div>
    </div>
  )
}

// Wszystkie komponenty i typy są eksportowane przy definicji
