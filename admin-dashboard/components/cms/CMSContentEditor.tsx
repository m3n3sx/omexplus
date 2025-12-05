'use client'

import { useState } from 'react'

interface CMSContentEditorProps {
  type: string
  content: any
  onChange: (content: any) => void
}

export default function CMSContentEditor({ type, content, onChange }: CMSContentEditorProps) {
  const [jsonMode, setJsonMode] = useState(false)
  const [jsonText, setJsonText] = useState(JSON.stringify(content, null, 2))

  const handleJsonChange = (text: string) => {
    setJsonText(text)
    try {
      const parsed = JSON.parse(text)
      onChange(parsed)
    } catch (e) {
      // Invalid JSON, don't update
    }
  }

  // Renderuj edytor w zależności od typu
  const renderEditor = () => {
    if (jsonMode) {
      return (
        <div>
          <label className="block text-sm font-medium mb-2">Zawartość (JSON)</label>
          <textarea
            value={jsonText}
            onChange={(e) => handleJsonChange(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg font-mono text-sm"
            rows={15}
          />
        </div>
      )
    }

    switch (type) {
      case 'header':
        return <HeaderEditor content={content} onChange={onChange} />
      case 'footer':
        return <FooterEditor content={content} onChange={onChange} />
      case 'hero':
        return <HeroEditor content={content} onChange={onChange} />
      case 'section':
        return <SectionEditor content={content} onChange={onChange} />
      case 'text':
        return <TextEditor content={content} onChange={onChange} />
      case 'button':
        return <ButtonEditor content={content} onChange={onChange} />
      default:
        return <GenericEditor content={content} onChange={onChange} />
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Zawartość</h3>
        <button
          type="button"
          onClick={() => setJsonMode(!jsonMode)}
          className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
        >
          {jsonMode ? 'Edytor wizualny' : 'Tryb JSON'}
        </button>
      </div>
      {renderEditor()}
    </div>
  )
}

// Header Editor
function HeaderEditor({ content, onChange }: any) {
  const data = content || { logo: '', navigation: [], showSearch: true, showCart: true }
  
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Logo URL</label>
        <input
          type="text"
          value={data.logo || ''}
          onChange={(e) => onChange({ ...data, logo: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>
      
      <div className="flex gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={data.showSearch}
            onChange={(e) => onChange({ ...data, showSearch: e.target.checked })}
          />
          <span>Pokaż wyszukiwarkę</span>
        </label>
        
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={data.showCart}
            onChange={(e) => onChange({ ...data, showCart: e.target.checked })}
          />
          <span>Pokaż koszyk</span>
        </label>
      </div>
    </div>
  )
}

// Footer Editor
function FooterEditor({ content, onChange }: any) {
  const data = content || { columns: [], copyright: '', socialLinks: [] }
  
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Copyright</label>
        <input
          type="text"
          value={data.copyright || ''}
          onChange={(e) => onChange({ ...data, copyright: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>
    </div>
  )
}

// Hero Editor
function HeroEditor({ content, onChange }: any) {
  const data = content || { title: '', subtitle: '', backgroundImage: '', cta: {} }
  
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Tytuł</label>
        <input
          type="text"
          value={data.title || ''}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Podtytuł</label>
        <input
          type="text"
          value={data.subtitle || ''}
          onChange={(e) => onChange({ ...data, subtitle: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Obraz tła (URL)</label>
        <input
          type="text"
          value={data.backgroundImage || ''}
          onChange={(e) => onChange({ ...data, backgroundImage: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>
    </div>
  )
}

// Section Editor
function SectionEditor({ content, onChange }: any) {
  const data = content || { title: '', content: '', layout: 'default' }
  
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Tytuł sekcji</label>
        <input
          type="text"
          value={data.title || ''}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Zawartość</label>
        <textarea
          value={data.content || ''}
          onChange={(e) => onChange({ ...data, content: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
          rows={6}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Layout</label>
        <select
          value={data.layout || 'default'}
          onChange={(e) => onChange({ ...data, layout: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
        >
          <option value="default">Domyślny</option>
          <option value="full-width">Pełna szerokość</option>
          <option value="centered">Wycentrowany</option>
          <option value="two-column">Dwie kolumny</option>
        </select>
      </div>
    </div>
  )
}

// Text Editor
function TextEditor({ content, onChange }: any) {
  const data = content || { text: '', style: 'normal' }
  
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Tekst</label>
        <textarea
          value={data.text || ''}
          onChange={(e) => onChange({ ...data, text: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
          rows={4}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Styl</label>
        <select
          value={data.style || 'normal'}
          onChange={(e) => onChange({ ...data, style: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
        >
          <option value="normal">Normalny</option>
          <option value="heading">Nagłówek</option>
          <option value="subheading">Podtytuł</option>
          <option value="caption">Podpis</option>
        </select>
      </div>
    </div>
  )
}

// Button Editor
function ButtonEditor({ content, onChange }: any) {
  const data = content || { text: '', url: '', style: 'primary' }
  
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Tekst przycisku</label>
        <input
          type="text"
          value={data.text || ''}
          onChange={(e) => onChange({ ...data, text: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">URL</label>
        <input
          type="text"
          value={data.url || ''}
          onChange={(e) => onChange({ ...data, url: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Styl</label>
        <select
          value={data.style || 'primary'}
          onChange={(e) => onChange({ ...data, style: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
        >
          <option value="primary">Primary</option>
          <option value="secondary">Secondary</option>
          <option value="outline">Outline</option>
        </select>
      </div>
    </div>
  )
}

// Generic Editor (fallback)
function GenericEditor({ content, onChange }: any) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">Zawartość (JSON)</label>
      <textarea
        value={JSON.stringify(content, null, 2)}
        onChange={(e) => {
          try {
            onChange(JSON.parse(e.target.value))
          } catch (e) {
            // Invalid JSON
          }
        }}
        className="w-full px-4 py-2 border rounded-lg font-mono text-sm"
        rows={10}
      />
    </div>
  )
}
