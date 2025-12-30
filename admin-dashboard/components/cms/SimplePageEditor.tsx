'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  Type, Image, MousePointer, Minus, Video, Quote, List,
  Plus, Trash2, GripVertical, ChevronUp, ChevronDown, Copy,
  Bold, Italic, Underline, Link as LinkIcon, AlignLeft, AlignCenter, AlignRight,
  Eye, Save, Undo, Redo, X, Check, Upload
} from 'lucide-react'

// ============ TYPY BLOKÓW ============
export type BlockType = 'heading' | 'text' | 'image' | 'button' | 'divider' | 'video' | 'quote' | 'list'

export interface ContentBlock {
  id: string
  type: BlockType
  data: any
}

interface SimplePageEditorProps {
  blocks: ContentBlock[]
  onChange: (blocks: ContentBlock[]) => void
  onSave?: () => void
}

// ============ GENEROWANIE ID ============
const generateId = () => `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

// ============ DOMYŚLNE DANE BLOKÓW ============
const DEFAULT_BLOCK_DATA: Record<BlockType, any> = {
  heading: { text: '', level: 'h2', align: 'left' },
  text: { html: '', align: 'left' },
  image: { src: '', alt: '', caption: '', align: 'center' },
  button: { text: 'Kliknij', url: '', style: 'primary', align: 'center' },
  divider: { style: 'solid' },
  video: { url: '', type: 'youtube' },
  quote: { text: '', author: '' },
  list: { items: [''], ordered: false }
}

// ============ IKONY I NAZWY BLOKÓW ============
const BLOCK_INFO: Record<BlockType, { icon: any; name: string; description: string }> = {
  heading: { icon: Type, name: 'Nagłówek', description: 'Tytuł lub podtytuł' },
  text: { icon: AlignLeft, name: 'Tekst', description: 'Akapit tekstu' },
  image: { icon: Image, name: 'Obraz', description: 'Zdjęcie lub grafika' },
  button: { icon: MousePointer, name: 'Przycisk', description: 'Przycisk z linkiem' },
  divider: { icon: Minus, name: 'Linia', description: 'Separator sekcji' },
  video: { icon: Video, name: 'Wideo', description: 'Film z YouTube/Vimeo' },
  quote: { icon: Quote, name: 'Cytat', description: 'Wyróżniony cytat' },
  list: { icon: List, name: 'Lista', description: 'Lista punktowana' }
}

// ============ EDYTORY BLOKÓW ============

// Nagłówek
function HeadingBlockEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  return (
    <div className="space-y-3">
      <input
        type="text"
        value={data.text || ''}
        onChange={(e) => onChange({ ...data, text: e.target.value })}
        placeholder="Wpisz nagłówek..."
        className="w-full text-2xl font-bold border-0 border-b-2 border-gray-200 focus:border-blue-500 focus:ring-0 py-2 bg-transparent"
        style={{ textAlign: data.align || 'left' }}
      />
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Rozmiar:</span>
          <div className="flex gap-1">
            {['h1', 'h2', 'h3', 'h4'].map(level => (
              <button
                key={level}
                type="button"
                onClick={() => onChange({ ...data, level })}
                className={`px-3 py-1 text-sm rounded ${
                  data.level === level ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {level.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Wyrównanie:</span>
          <div className="flex gap-1">
            {[
              { value: 'left', icon: AlignLeft },
              { value: 'center', icon: AlignCenter },
              { value: 'right', icon: AlignRight }
            ].map(({ value, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => onChange({ ...data, align: value })}
                className={`p-2 rounded ${
                  data.align === value ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Tekst
function TextBlockEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const [localHtml, setLocalHtml] = useState(data.html || '')
  
  // Sync local state when data changes from outside
  useEffect(() => {
    setLocalHtml(data.html || '')
  }, [data.html])

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex items-center gap-1 p-2 bg-gray-50 border-b">
        <span className="text-xs text-gray-500 mr-2">Wyrównanie:</span>
        {[
          { value: 'left', icon: AlignLeft },
          { value: 'center', icon: AlignCenter },
          { value: 'right', icon: AlignRight }
        ].map(({ value, icon: Icon }) => (
          <button 
            key={value}
            type="button" 
            onClick={() => onChange({ ...data, align: value })} 
            className={`p-2 rounded ${data.align === value ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
          >
            <Icon className="w-4 h-4" />
          </button>
        ))}
      </div>
      <textarea
        value={localHtml}
        onChange={(e) => {
          setLocalHtml(e.target.value)
          onChange({ ...data, html: e.target.value })
        }}
        placeholder="Wpisz tekst... (możesz użyć HTML: <b>pogrubienie</b>, <i>kursywa</i>, <a href='...'>link</a>)"
        className="w-full min-h-[120px] p-4 focus:outline-none resize-none"
        style={{ textAlign: (data.align || 'left') as any }}
      />
      {localHtml && (
        <div className="p-4 border-t bg-gray-50">
          <p className="text-xs text-gray-500 mb-2">Podgląd:</p>
          <div 
            className="prose prose-sm max-w-none"
            style={{ textAlign: (data.align || 'left') as any }}
            dangerouslySetInnerHTML={{ __html: localHtml }}
          />
        </div>
      )}
    </div>
  )
}

// Obraz
function ImageBlockEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const [dragOver, setDragOver] = useState(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    // W przyszłości: upload pliku
    // Na razie: użytkownik wkleja URL
  }

  return (
    <div className="space-y-4">
      {data.src ? (
        <div className="relative group">
          <img 
            src={data.src} 
            alt={data.alt || ''} 
            className="max-h-64 mx-auto rounded-lg shadow-sm"
          />
          <button
            type="button"
            onClick={() => onChange({ ...data, src: '' })}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600 mb-2">Wklej URL obrazu poniżej</p>
          <p className="text-sm text-gray-400">lub przeciągnij plik (wkrótce)</p>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL obrazu</label>
          <input
            type="text"
            value={data.src || ''}
            onChange={(e) => onChange({ ...data, src: e.target.value })}
            placeholder="https://... lub /images/..."
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Opis (dla SEO)</label>
          <input
            type="text"
            value={data.alt || ''}
            onChange={(e) => onChange({ ...data, alt: e.target.value })}
            placeholder="Opis obrazu"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Podpis (opcjonalny)</label>
        <input
          type="text"
          value={data.caption || ''}
          onChange={(e) => onChange({ ...data, caption: e.target.value })}
          placeholder="Podpis pod obrazem"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  )
}

// Przycisk
function ButtonBlockEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const styles = [
    { id: 'primary', name: 'Główny', preview: 'bg-blue-600 text-white' },
    { id: 'secondary', name: 'Drugorzędny', preview: 'bg-gray-600 text-white' },
    { id: 'outline', name: 'Obramowanie', preview: 'border-2 border-blue-600 text-blue-600' },
    { id: 'success', name: 'Sukces', preview: 'bg-green-600 text-white' },
    { id: 'danger', name: 'Ostrzeżenie', preview: 'bg-red-600 text-white' }
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tekst przycisku</label>
          <input
            type="text"
            value={data.text || ''}
            onChange={(e) => onChange({ ...data, text: e.target.value })}
            placeholder="Kliknij tutaj"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Link (URL)</label>
          <input
            type="text"
            value={data.url || ''}
            onChange={(e) => onChange({ ...data, url: e.target.value })}
            placeholder="/strona lub https://..."
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Styl przycisku</label>
        <div className="flex flex-wrap gap-2">
          {styles.map(style => (
            <button
              key={style.id}
              type="button"
              onClick={() => onChange({ ...data, style: style.id })}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${style.preview} ${
                data.style === style.id ? 'ring-2 ring-offset-2 ring-blue-500' : ''
              }`}
            >
              {style.name}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-500 mb-2">Podgląd:</p>
        <div style={{ textAlign: data.align || 'center' }}>
          <button
            type="button"
            className={`px-6 py-3 rounded-lg font-medium ${
              styles.find(s => s.id === data.style)?.preview || styles[0].preview
            }`}
          >
            {data.text || 'Przycisk'}
          </button>
        </div>
      </div>
    </div>
  )
}

// Linia/Separator
function DividerBlockEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const styles = [
    { id: 'solid', name: 'Ciągła', css: 'border-t-2 border-gray-300' },
    { id: 'dashed', name: 'Przerywana', css: 'border-t-2 border-dashed border-gray-300' },
    { id: 'dotted', name: 'Kropkowana', css: 'border-t-2 border-dotted border-gray-300' },
    { id: 'thick', name: 'Gruba', css: 'border-t-4 border-gray-400' }
  ]

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Styl linii</label>
        <div className="space-y-2">
          {styles.map(style => (
            <button
              key={style.id}
              type="button"
              onClick={() => onChange({ ...data, style: style.id })}
              className={`w-full p-4 rounded-lg border-2 transition-colors ${
                data.style === style.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={style.css} />
              <p className="text-sm text-gray-600 mt-2">{style.name}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// Wideo
function VideoBlockEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const getEmbedUrl = (url: string) => {
    if (!url) return null
    // YouTube
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`
    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`
    return null
  }

  const embedUrl = getEmbedUrl(data.url)

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Link do wideo</label>
        <input
          type="text"
          value={data.url || ''}
          onChange={(e) => onChange({ ...data, url: e.target.value })}
          placeholder="https://youtube.com/watch?v=... lub https://vimeo.com/..."
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">Obsługiwane: YouTube, Vimeo</p>
      </div>
      
      {embedUrl ? (
        <div className="aspect-video rounded-lg overflow-hidden bg-black">
          <iframe
            src={embedUrl}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      ) : data.url ? (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
          Nie rozpoznano formatu linku. Upewnij się, że to link do YouTube lub Vimeo.
        </div>
      ) : null}
    </div>
  )
}

// Cytat
function QuoteBlockEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  return (
    <div className="space-y-4">
      <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 rounded-r-lg">
        <textarea
          value={data.text || ''}
          onChange={(e) => onChange({ ...data, text: e.target.value })}
          placeholder="Wpisz treść cytatu..."
          className="w-full bg-transparent border-0 focus:ring-0 text-lg italic resize-none min-h-[80px]"
        />
        <input
          type="text"
          value={data.author || ''}
          onChange={(e) => onChange({ ...data, author: e.target.value })}
          placeholder="— Autor cytatu"
          className="w-full bg-transparent border-0 focus:ring-0 text-sm text-gray-600 mt-2"
        />
      </div>
    </div>
  )
}

// Lista
function ListBlockEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const items = data.items || ['']

  const updateItem = (index: number, value: string) => {
    const newItems = [...items]
    newItems[index] = value
    onChange({ ...data, items: newItems })
  }

  const addItem = () => {
    onChange({ ...data, items: [...items, ''] })
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      onChange({ ...data, items: items.filter((_: any, i: number) => i !== index) })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">Typ listy:</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onChange({ ...data, ordered: false })}
            className={`px-4 py-2 rounded-lg text-sm ${
              !data.ordered ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            • Punktowana
          </button>
          <button
            type="button"
            onClick={() => onChange({ ...data, ordered: true })}
            className={`px-4 py-2 rounded-lg text-sm ${
              data.ordered ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            1. Numerowana
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {items.map((item: string, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <span className="w-6 text-center text-gray-400">
              {data.ordered ? `${index + 1}.` : '•'}
            </span>
            <input
              type="text"
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              placeholder="Element listy..."
              className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
              disabled={items.length === 1}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
      >
        <Plus className="w-4 h-4" />
        Dodaj element
      </button>
    </div>
  )
}

// ============ POJEDYNCZY BLOK ============
function BlockWrapper({ 
  block, 
  index,
  total,
  isSelected,
  onSelect,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  onAddBefore,
  onDuplicate
}: {
  block: ContentBlock
  index: number
  total: number
  isSelected: boolean
  onSelect: () => void
  onChange: (data: any) => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onAddBefore: () => void
  onDuplicate: () => void
}) {
  const info = BLOCK_INFO[block.type]
  const Icon = info.icon

  const renderEditor = () => {
    switch (block.type) {
      case 'heading': return <HeadingBlockEditor data={block.data} onChange={onChange} />
      case 'text': return <TextBlockEditor data={block.data} onChange={onChange} />
      case 'image': return <ImageBlockEditor data={block.data} onChange={onChange} />
      case 'button': return <ButtonBlockEditor data={block.data} onChange={onChange} />
      case 'divider': return <DividerBlockEditor data={block.data} onChange={onChange} />
      case 'video': return <VideoBlockEditor data={block.data} onChange={onChange} />
      case 'quote': return <QuoteBlockEditor data={block.data} onChange={onChange} />
      case 'list': return <ListBlockEditor data={block.data} onChange={onChange} />
      default: return null
    }
  }

  return (
    <div className="relative">
      {/* Przycisk dodawania przed blokiem */}
      {index === 0 && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 opacity-0 hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onAddBefore() }}
            className="p-1 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600"
            title="Dodaj blok powyżej"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      )}
      
      <div 
        className={`group relative bg-white rounded-xl border-2 transition-all ${
          isSelected ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'
        }`}
        onClick={onSelect}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Icon className="w-4 h-4 text-gray-600" />
            </div>
            <span className="font-medium text-gray-700">{info.name}</span>
          </div>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onMoveUp() }}
              disabled={index === 0}
              className="p-1.5 hover:bg-gray-200 rounded disabled:opacity-30"
              title="Przesuń w górę"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onMoveDown() }}
              disabled={index === total - 1}
              className="p-1.5 hover:bg-gray-200 rounded disabled:opacity-30"
              title="Przesuń w dół"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-gray-300 mx-1" />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onDuplicate() }}
              className="p-1.5 hover:bg-blue-100 text-blue-500 rounded"
              title="Duplikuj blok"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onDelete() }}
              className="p-1.5 hover:bg-red-100 text-red-500 rounded"
              title="Usuń blok"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {renderEditor()}
        </div>
      </div>
    </div>
  )
}

// ============ PANEL DODAWANIA BLOKÓW ============
function AddBlockPanel({ onAdd, onClose, insertAt }: { onAdd: (type: BlockType, index?: number) => void; onClose: () => void; insertAt?: number }) {
  const blockTypes: BlockType[] = ['heading', 'text', 'image', 'button', 'divider', 'video', 'quote', 'list']

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">
            {insertAt !== undefined ? 'Wstaw blok' : 'Dodaj blok'}
          </h3>
          <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {blockTypes.map(type => {
            const info = BLOCK_INFO[type]
            const Icon = info.icon
            return (
              <button
                key={type}
                type="button"
                onClick={() => { onAdd(type, insertAt); onClose() }}
                className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
              >
                <div className="p-3 bg-gray-100 rounded-lg">
                  <Icon className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{info.name}</p>
                  <p className="text-sm text-gray-500">{info.description}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ============ GŁÓWNY KOMPONENT ============
export function SimplePageEditor({ blocks, onChange, onSave }: SimplePageEditorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showAddPanel, setShowAddPanel] = useState(false)
  const [insertAtIndex, setInsertAtIndex] = useState<number | undefined>(undefined)
  const [history, setHistory] = useState<ContentBlock[][]>([blocks])
  const [historyIndex, setHistoryIndex] = useState(0)

  // Historia zmian
  const pushHistory = (newBlocks: ContentBlock[]) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newBlocks)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
    onChange(newBlocks)
  }

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

  // Dodaj blok
  const addBlock = (type: BlockType, atIndex?: number) => {
    const newBlock: ContentBlock = {
      id: generateId(),
      type,
      data: { ...DEFAULT_BLOCK_DATA[type] }
    }
    
    if (atIndex !== undefined) {
      const newBlocks = [...blocks]
      newBlocks.splice(atIndex, 0, newBlock)
      pushHistory(newBlocks)
    } else {
      pushHistory([...blocks, newBlock])
    }
    setSelectedId(newBlock.id)
    setInsertAtIndex(undefined)
  }

  // Aktualizuj blok
  const updateBlock = (id: string, data: any) => {
    pushHistory(blocks.map(b => b.id === id ? { ...b, data } : b))
  }

  // Usuń blok
  const deleteBlock = (id: string) => {
    pushHistory(blocks.filter(b => b.id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  // Przesuń blok
  const moveBlock = (id: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex(b => b.id === id)
    if (index === -1) return
    
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= blocks.length) return

    const newBlocks = [...blocks]
    const [removed] = newBlocks.splice(index, 1)
    newBlocks.splice(newIndex, 0, removed)
    pushHistory(newBlocks)
  }

  // Otwórz panel dodawania w konkretnym miejscu
  const openAddPanelAt = (index: number) => {
    setInsertAtIndex(index)
    setShowAddPanel(true)
  }

  // Duplikuj blok
  const duplicateBlock = (id: string) => {
    const block = blocks.find(b => b.id === id)
    if (!block) return
    
    const index = blocks.findIndex(b => b.id === id)
    const newBlock: ContentBlock = {
      id: generateId(),
      type: block.type,
      data: JSON.parse(JSON.stringify(block.data)) // Deep copy
    }
    
    const newBlocks = [...blocks]
    newBlocks.splice(index + 1, 0, newBlock)
    pushHistory(newBlocks)
    setSelectedId(newBlock.id)
  }

  return (
    <div className="min-h-[500px]">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-white border-b shadow-sm rounded-t-xl">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={undo}
            disabled={historyIndex === 0}
            className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30"
            title="Cofnij (Ctrl+Z)"
          >
            <Undo className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={redo}
            disabled={historyIndex === history.length - 1}
            className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30"
            title="Ponów (Ctrl+Y)"
          >
            <Redo className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-gray-200 mx-2" />
          <span className="text-sm text-gray-500">
            {blocks.length} {blocks.length === 1 ? 'blok' : blocks.length < 5 ? 'bloki' : 'bloków'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAddPanel(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Dodaj blok
          </button>
          {onSave && (
            <button
              type="button"
              onClick={onSave}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Save className="w-4 h-4" />
              Zapisz
            </button>
          )}
        </div>
      </div>

      {/* Bloki */}
      <div className="p-6 space-y-4 bg-gray-50 min-h-[400px]">
        {blocks.length === 0 ? (
          <div 
            className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-300 rounded-xl bg-white cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
            onClick={() => setShowAddPanel(true)}
          >
            <Plus className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-xl font-medium text-gray-600 mb-2">Zacznij tworzyć stronę</p>
            <p className="text-gray-400">Kliknij aby dodać pierwszy blok</p>
          </div>
        ) : (
          blocks.map((block, index) => (
            <div key={block.id}>
              <BlockWrapper
                block={block}
                index={index}
                total={blocks.length}
                isSelected={selectedId === block.id}
                onSelect={() => setSelectedId(block.id)}
                onChange={(data) => updateBlock(block.id, data)}
                onDelete={() => deleteBlock(block.id)}
                onMoveUp={() => moveBlock(block.id, 'up')}
                onMoveDown={() => moveBlock(block.id, 'down')}
                onAddBefore={() => openAddPanelAt(index)}
                onDuplicate={() => duplicateBlock(block.id)}
              />
              
              {/* Przycisk dodawania między blokami */}
              <div className="flex justify-center py-2 group">
                <button
                  type="button"
                  onClick={() => openAddPanelAt(index + 1)}
                  className="p-1.5 bg-gray-200 text-gray-400 rounded-full opacity-0 group-hover:opacity-100 hover:bg-blue-500 hover:text-white transition-all"
                  title="Dodaj blok tutaj"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}

        {/* Przycisk dodawania na dole */}
        {blocks.length > 0 && (
          <button
            type="button"
            onClick={() => { setInsertAtIndex(undefined); setShowAddPanel(true) }}
            className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Dodaj kolejny blok
          </button>
        )}
      </div>

      {/* Panel dodawania */}
      {showAddPanel && (
        <AddBlockPanel 
          onAdd={addBlock} 
          onClose={() => { setShowAddPanel(false); setInsertAtIndex(undefined) }}
          insertAt={insertAtIndex}
        />
      )}
    </div>
  )
}

export default SimplePageEditor
