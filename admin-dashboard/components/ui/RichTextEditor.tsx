"use client"

import { useState } from "react"
import { Bold, Italic, List, ListOrdered, Link as LinkIcon, Code } from "lucide-react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [showPreview, setShowPreview] = useState(false)

  const insertMarkdown = (before: string, after: string = before) => {
    const textarea = document.getElementById('description-editor') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end)
    
    onChange(newText)
    
    // Restore focus and selection
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, end + before.length)
    }, 0)
  }

  const formatBold = () => insertMarkdown('**')
  const formatItalic = () => insertMarkdown('*')
  const formatCode = () => insertMarkdown('`')
  const formatLink = () => {
    const url = prompt('Enter URL:')
    if (url) {
      insertMarkdown('[', `](${url})`)
    }
  }
  const formatList = () => {
    const textarea = document.getElementById('description-editor') as HTMLTextAreaElement
    const start = textarea.selectionStart
    const lineStart = value.lastIndexOf('\n', start - 1) + 1
    const newText = value.substring(0, lineStart) + '- ' + value.substring(lineStart)
    onChange(newText)
  }
  const formatOrderedList = () => {
    const textarea = document.getElementById('description-editor') as HTMLTextAreaElement
    const start = textarea.selectionStart
    const lineStart = value.lastIndexOf('\n', start - 1) + 1
    const newText = value.substring(0, lineStart) + '1. ' + value.substring(lineStart)
    onChange(newText)
  }

  const renderPreview = (text: string) => {
    // Simple markdown to HTML conversion
    let html = text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-primary-600 hover:underline">$1</a>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
      .replace(/\n\n/g, '</p><p>')
    
    // Wrap lists
    html = html.replace(/(<li>.*<\/li>)/s, '<ul class="list-disc list-inside">$1</ul>')
    
    // Wrap in paragraphs
    if (!html.startsWith('<')) {
      html = '<p>' + html + '</p>'
    }
    
    return html
  }

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex items-center space-x-1 p-2 bg-gray-50 border border-gray-300 rounded-t-lg">
        <button
          type="button"
          onClick={formatBold}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={formatItalic}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={formatCode}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Code"
        >
          <Code className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={formatList}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={formatOrderedList}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={formatLink}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Insert Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <div className="flex-1" />
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            showPreview 
              ? 'bg-primary-600 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          {showPreview ? 'Edit' : 'Preview'}
        </button>
      </div>

      {/* Editor / Preview */}
      {showPreview ? (
        <div 
          className="min-h-[200px] p-4 border border-gray-300 border-t-0 rounded-b-lg bg-white prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: renderPreview(value) }}
        />
      ) : (
        <textarea
          id="description-editor"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={10}
          className="w-full px-4 py-3 border border-gray-300 border-t-0 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
        />
      )}

      {/* Help Text */}
      <div className="text-xs text-gray-500 space-y-1">
        <p className="font-medium">Markdown formatting:</p>
        <div className="grid grid-cols-2 gap-2">
          <div><code className="bg-gray-100 px-1 rounded">**bold**</code> for <strong>bold</strong></div>
          <div><code className="bg-gray-100 px-1 rounded">*italic*</code> for <em>italic</em></div>
          <div><code className="bg-gray-100 px-1 rounded">`code`</code> for code</div>
          <div><code className="bg-gray-100 px-1 rounded">[text](url)</code> for links</div>
          <div><code className="bg-gray-100 px-1 rounded">- item</code> for bullet list</div>
          <div><code className="bg-gray-100 px-1 rounded">1. item</code> for numbered list</div>
        </div>
      </div>
    </div>
  )
}
