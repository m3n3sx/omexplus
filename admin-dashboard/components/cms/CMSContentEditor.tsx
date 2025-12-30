'use client'

import { useState } from 'react'
import { HeaderEditor } from './HeaderEditor'
import { FooterEditor } from './FooterEditor'
import { HeroEditor } from './HeroEditor'
import { 
  RichTextEditor, 
  LinksListEditor, 
  ImageEditor, 
  StyleEditor,
  ColorPicker,
  CMSLink,
  CMSStyle
} from './CMSEditor'
import { Code, Eye, Palette, Type, Image, MousePointer, Layout, Layers } from 'lucide-react'

interface CMSContentEditorProps {
  type: string
  content: any
  onChange: (content: any) => void
}

export default function CMSContentEditor({ type, content, onChange }: CMSContentEditorProps) {
  const [jsonMode, setJsonMode] = useState(false)
  const [jsonText, setJsonText] = useState(JSON.stringify(content, null, 2))
  const [jsonError, setJsonError] = useState<string | null>(null)

  const handleJsonChange = (text: string) => {
    setJsonText(text)
    try {
      const parsed = JSON.parse(text)
      onChange(parsed)
      setJsonError(null)
    } catch (e: any) {
      setJsonError(e.message)
    }
  }

  const renderEditor = () => {
    if (jsonMode) {
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">Zawartość (JSON)</label>
            {jsonError && (
              <span className="text-sm text-red-500">Błąd: {jsonError}</span>
            )}
          </div>
          <textarea
            value={jsonText}
            onChange={(e) => handleJsonChange(e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg font-mono text-sm ${
              jsonError ? 'border-red-500' : 'border-gray-300'
            }`}
            rows={20}
            spellCheck={false}
          />
        </div>
      )
    }

    switch (type) {
      case 'header':
        return <HeaderEditor content={content || {}} onChange={onChange} />
      case 'footer':
        return <FooterEditor content={content || {}} onChange={onChange} />
      case 'hero':
        return <HeroEditor content={content || {}} onChange={onChange} />
      case 'section':
        return <SectionEditor content={content || {}} onChange={onChange} />
      case 'banner':
        return <BannerEditor content={content || {}} onChange={onChange} />
      case 'text':
        return <TextBlockEditor content={content || {}} onChange={onChange} />
      case 'button':
        return <ButtonEditor content={content || {}} onChange={onChange} />
      case 'menu':
        return <MenuEditor content={content || {}} onChange={onChange} />
      case 'widget':
        return <WidgetEditor content={content || {}} onChange={onChange} />
      case 'image':
        return <ImageBlockEditor content={content || {}} onChange={onChange} />
      default:
        return <GenericEditor content={content || {}} onChange={onChange} />
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            {type === 'header' && <Layout className="w-5 h-5 text-blue-600" />}
            {type === 'footer' && <Layers className="w-5 h-5 text-blue-600" />}
            {type === 'hero' && <Image className="w-5 h-5 text-blue-600" />}
            {type === 'text' && <Type className="w-5 h-5 text-blue-600" />}
            {type === 'button' && <MousePointer className="w-5 h-5 text-blue-600" />}
            {!['header', 'footer', 'hero', 'text', 'button'].includes(type) && (
              <Palette className="w-5 h-5 text-blue-600" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Edytor zawartości</h3>
            <p className="text-sm text-gray-500">Typ: {type}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (!jsonMode) {
                setJsonText(JSON.stringify(content, null, 2))
              }
              setJsonMode(!jsonMode)
              setJsonError(null)
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              jsonMode 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {jsonMode ? <Eye className="w-4 h-4" /> : <Code className="w-4 h-4" />}
            {jsonMode ? 'Edytor wizualny' : 'Tryb JSON'}
          </button>
        </div>
      </div>
      <div className="p-6">
        {renderEditor()}
      </div>
    </div>
  )
}

// Section Editor - dla sekcji strony
function SectionEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  const data = content || { title: '', subtitle: '', content: '', layout: 'default', style: {} }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tytuł sekcji</label>
          <input
            type="text"
            value={data.title || ''}
            onChange={(e) => onChange({ ...data, title: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Nagłówek sekcji"
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
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Zawartość HTML</label>
        <RichTextEditor
          value={data.content || ''}
          onChange={(content) => onChange({ ...data, content })}
          placeholder="Treść sekcji..."
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Layout</label>
          <select
            value={data.layout || 'default'}
            onChange={(e) => onChange({ ...data, layout: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="default">Domyślny</option>
            <option value="full-width">Pełna szerokość</option>
            <option value="centered">Wycentrowany</option>
            <option value="two-column">Dwie kolumny</option>
            <option value="three-column">Trzy kolumny</option>
            <option value="sidebar-left">Sidebar po lewej</option>
            <option value="sidebar-right">Sidebar po prawej</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Obraz tła</label>
          <input
            type="text"
            value={data.backgroundImage || ''}
            onChange={(e) => onChange({ ...data, backgroundImage: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="/images/bg.jpg"
          />
        </div>
      </div>
      
      <StyleEditor
        style={data.style || {}}
        onChange={(style) => onChange({ ...data, style })}
      />
    </div>
  )
}

// Banner Editor
function BannerEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  const data = content || { title: '', subtitle: '', image: {}, link: {}, style: {} }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tytuł</label>
          <input
            type="text"
            value={data.title || ''}
            onChange={(e) => onChange({ ...data, title: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Podtytuł</label>
          <input
            type="text"
            value={data.subtitle || ''}
            onChange={(e) => onChange({ ...data, subtitle: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
      </div>
      
      <ImageEditor
        image={data.image || { src: '', alt: '' }}
        onChange={(image) => onChange({ ...data, image })}
      />
      
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-700 mb-3">Link banera</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Tekst przycisku</label>
            <input
              type="text"
              value={data.link?.text || ''}
              onChange={(e) => onChange({ ...data, link: { ...data.link, text: e.target.value } })}
              className="w-full px-3 py-2 border rounded-lg text-sm"
              placeholder="Zobacz więcej"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">URL</label>
            <input
              type="text"
              value={data.link?.url || ''}
              onChange={(e) => onChange({ ...data, link: { ...data.link, url: e.target.value } })}
              className="w-full px-3 py-2 border rounded-lg text-sm"
              placeholder="/promocje"
            />
          </div>
        </div>
      </div>
      
      <StyleEditor
        style={data.style || {}}
        onChange={(style) => onChange({ ...data, style })}
      />
    </div>
  )
}

// Text Block Editor
function TextBlockEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  const data = content || { text: '', style: {} }
  
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Treść</label>
        <RichTextEditor
          value={data.text || ''}
          onChange={(text) => onChange({ ...data, text })}
          placeholder="Wpisz tekst..."
        />
      </div>
      
      <StyleEditor
        style={data.style || {}}
        onChange={(style) => onChange({ ...data, style })}
      />
    </div>
  )
}

// Button Editor
function ButtonEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  const data = content || { text: '', url: '', style: 'primary', color: '', size: 'medium' }
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tekst przycisku</label>
          <input
            type="text"
            value={data.text || ''}
            onChange={(e) => onChange({ ...data, text: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Kliknij tutaj"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
          <input
            type="text"
            value={data.url || ''}
            onChange={(e) => onChange({ ...data, url: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="/strona lub https://..."
          />
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Styl</label>
          <select
            value={data.style || 'primary'}
            onChange={(e) => onChange({ ...data, style: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="primary">Primary (wypełniony)</option>
            <option value="secondary">Secondary</option>
            <option value="outline">Outline (obramowanie)</option>
            <option value="ghost">Ghost (przezroczysty)</option>
            <option value="link">Link (bez tła)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Rozmiar</label>
          <select
            value={data.size || 'medium'}
            onChange={(e) => onChange({ ...data, size: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="small">Mały</option>
            <option value="medium">Średni</option>
            <option value="large">Duży</option>
            <option value="xl">Bardzo duży</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Otwórz w</label>
          <select
            value={data.target || '_self'}
            onChange={(e) => onChange({ ...data, target: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="_self">Ta sama karta</option>
            <option value="_blank">Nowa karta</option>
          </select>
        </div>
      </div>
      
      <ColorPicker
        label="Kolor przycisku"
        value={data.color || ''}
        onChange={(color) => onChange({ ...data, color })}
      />
      
      {/* Preview */}
      <div className="p-4 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-500 mb-2">Podgląd:</p>
        <button
          type="button"
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            data.style === 'primary' ? 'text-white' : ''
          } ${
            data.style === 'outline' ? 'border-2' : ''
          } ${
            data.style === 'ghost' ? 'hover:bg-gray-200' : ''
          }`}
          style={{
            backgroundColor: data.style === 'primary' ? (data.color || '#3B82F6') : 'transparent',
            borderColor: data.style === 'outline' ? (data.color || '#3B82F6') : 'transparent',
            color: data.style === 'primary' ? 'white' : (data.color || '#3B82F6'),
          }}
        >
          {data.text || 'Przycisk'}
        </button>
      </div>
    </div>
  )
}

// Menu Editor
function MenuEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  const data = content || { items: [], style: 'horizontal' }
  
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Styl menu</label>
        <select
          value={data.style || 'horizontal'}
          onChange={(e) => onChange({ ...data, style: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
        >
          <option value="horizontal">Poziome</option>
          <option value="vertical">Pionowe</option>
          <option value="dropdown">Dropdown</option>
          <option value="mega">Mega menu</option>
        </select>
      </div>
      
      <LinksListEditor
        links={data.items || []}
        onChange={(items) => onChange({ ...data, items })}
        title="Elementy menu"
      />
    </div>
  )
}

// Widget Editor
function WidgetEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  const data = content || { widgetType: 'custom', title: '', config: {} }
  
  const widgetTypes = [
    { id: 'newsletter', name: 'Newsletter' },
    { id: 'social', name: 'Social Media' },
    { id: 'contact', name: 'Formularz kontaktowy' },
    { id: 'search', name: 'Wyszukiwarka' },
    { id: 'cart', name: 'Mini koszyk' },
    { id: 'categories', name: 'Lista kategorii' },
    { id: 'products', name: 'Produkty' },
    { id: 'custom', name: 'Własny HTML' },
  ]
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Typ widgetu</label>
          <select
            value={data.widgetType || 'custom'}
            onChange={(e) => onChange({ ...data, widgetType: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          >
            {widgetTypes.map(w => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tytuł</label>
          <input
            type="text"
            value={data.title || ''}
            onChange={(e) => onChange({ ...data, title: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Opcjonalny tytuł"
          />
        </div>
      </div>
      
      {data.widgetType === 'newsletter' && (
        <div className="p-4 bg-blue-50 rounded-lg space-y-3">
          <h4 className="font-medium text-blue-800">Konfiguracja Newsletter</h4>
          <div>
            <label className="block text-sm text-blue-700 mb-1">Tekst zachęty</label>
            <input
              type="text"
              value={data.config?.placeholder || ''}
              onChange={(e) => onChange({ ...data, config: { ...data.config, placeholder: e.target.value } })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Zapisz się do newslettera"
            />
          </div>
          <div>
            <label className="block text-sm text-blue-700 mb-1">Tekst przycisku</label>
            <input
              type="text"
              value={data.config?.buttonText || ''}
              onChange={(e) => onChange({ ...data, config: { ...data.config, buttonText: e.target.value } })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Zapisz się"
            />
          </div>
        </div>
      )}
      
      {data.widgetType === 'products' && (
        <div className="p-4 bg-green-50 rounded-lg space-y-3">
          <h4 className="font-medium text-green-800">Konfiguracja Produktów</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-green-700 mb-1">Liczba produktów</label>
              <input
                type="number"
                value={data.config?.limit || 4}
                onChange={(e) => onChange({ ...data, config: { ...data.config, limit: parseInt(e.target.value) } })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm text-green-700 mb-1">Sortowanie</label>
              <select
                value={data.config?.sort || 'newest'}
                onChange={(e) => onChange({ ...data, config: { ...data.config, sort: e.target.value } })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="newest">Najnowsze</option>
                <option value="popular">Popularne</option>
                <option value="price_asc">Cena rosnąco</option>
                <option value="price_desc">Cena malejąco</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-green-700 mb-1">ID kategorii (opcjonalne)</label>
            <input
              type="text"
              value={data.config?.categoryId || ''}
              onChange={(e) => onChange({ ...data, config: { ...data.config, categoryId: e.target.value } })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="pcat_..."
            />
          </div>
        </div>
      )}
      
      {data.widgetType === 'custom' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Własny HTML</label>
          <RichTextEditor
            value={data.config?.html || ''}
            onChange={(html) => onChange({ ...data, config: { ...data.config, html } })}
            placeholder="<div>Własny kod HTML...</div>"
          />
        </div>
      )}
    </div>
  )
}

// Image Block Editor
function ImageBlockEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  const data = content || { image: {}, caption: '', link: '', style: {} }
  
  return (
    <div className="space-y-6">
      <ImageEditor
        image={data.image || { src: '', alt: '' }}
        onChange={(image) => onChange({ ...data, image })}
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Podpis obrazu</label>
        <input
          type="text"
          value={data.caption || ''}
          onChange={(e) => onChange({ ...data, caption: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="Opcjonalny podpis"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Link (kliknięcie w obraz)</label>
        <input
          type="text"
          value={data.link || ''}
          onChange={(e) => onChange({ ...data, link: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="/strona lub https://..."
        />
      </div>
      
      <StyleEditor
        style={data.style || {}}
        onChange={(style) => onChange({ ...data, style })}
      />
    </div>
  )
}

// Generic Editor (fallback)
function GenericEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  const [text, setText] = useState(JSON.stringify(content, null, 2))
  const [error, setError] = useState<string | null>(null)
  
  const handleChange = (value: string) => {
    setText(value)
    try {
      const parsed = JSON.parse(value)
      onChange(parsed)
      setError(null)
    } catch (e: any) {
      setError(e.message)
    }
  }
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Zawartość (JSON) - typ nieobsługiwany wizualnie
        </label>
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
      <textarea
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        className={`w-full px-4 py-3 border rounded-lg font-mono text-sm ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        rows={15}
        spellCheck={false}
      />
      <p className="text-xs text-gray-500">
        Tip: Możesz dodać obsługę wizualną dla tego typu w CMSContentEditor.tsx
      </p>
    </div>
  )
}
