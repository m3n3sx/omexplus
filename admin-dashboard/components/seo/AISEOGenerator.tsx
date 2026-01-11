'use client'

import { useState } from 'react'
import {
  Sparkles, Loader2, Copy, Check, RefreshCw, Wand2,
  FileText, Tag, Image, HelpCircle, ChevronDown, ChevronUp
} from 'lucide-react'

interface SEOContent {
  metaTitle?: string
  metaDescription?: string
  keywords?: string[]
  ogTitle?: string
  ogDescription?: string
  h1?: string
  shortDescription?: string
  longDescription?: string
  tags?: string[]
  altText?: string
  slug?: string
}

interface AISEOGeneratorProps {
  type: 'product' | 'category' | 'page'
  data: {
    title: string
    description?: string
    subtitle?: string
    category?: string
    brand?: string
    sku?: string
    price?: number
    content?: string
    parentCategory?: string
    productCount?: number
  }
  onApply?: (content: SEOContent) => void
  compact?: boolean
}

export function AISEOGenerator({ type, data, onApply, compact = false }: AISEOGeneratorProps) {
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState<SEOContent | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(!compact)

  const generateSEO = async () => {
    setLoading(true)
    setError(null)

    try {
      const action = type === 'product' 
        ? 'generateProductSEO' 
        : type === 'category' 
          ? 'generateCategorySEO' 
          : 'generatePageSEO'

      const response = await fetch('/api/ai-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, data }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Błąd generowania')
      }

      setContent(result.result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nieznany błąd')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleApply = () => {
    if (content && onApply) {
      onApply(content)
    }
  }

  if (compact && !expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 text-sm"
      >
        <Sparkles className="w-4 h-4" />
        Generuj SEO z AI
        <ChevronDown className="w-4 h-4" />
      </button>
    )
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-200 dark:border-purple-800 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold">AI SEO Generator</h3>
            <p className="text-xs text-gray-500">Powered by Gemini</p>
          </div>
        </div>
        {compact && (
          <button onClick={() => setExpanded(false)} className="p-1 hover:bg-white/50 rounded">
            <ChevronUp className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Generate Button */}
      {!content && (
        <button
          onClick={generateSEO}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 font-medium"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generowanie...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              Wygeneruj treści SEO
            </>
          )}
        </button>
      )}

      {/* Error */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Generated Content */}
      {content && (
        <div className="mt-4 space-y-4">
          {/* Meta Title */}
          {content.metaTitle && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                  <Tag className="w-3 h-3" /> Meta Title
                </label>
                <div className="flex items-center gap-1">
                  <span className={`text-xs ${content.metaTitle.length > 60 ? 'text-red-500' : 'text-green-500'}`}>
                    {content.metaTitle.length}/60
                  </span>
                  <button
                    onClick={() => copyToClipboard(content.metaTitle!, 'metaTitle')}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {copied === 'metaTitle' ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
              <p className="text-sm font-medium">{content.metaTitle}</p>
            </div>
          )}

          {/* Meta Description */}
          {content.metaDescription && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                  <FileText className="w-3 h-3" /> Meta Description
                </label>
                <div className="flex items-center gap-1">
                  <span className={`text-xs ${content.metaDescription.length > 155 ? 'text-red-500' : 'text-green-500'}`}>
                    {content.metaDescription.length}/155
                  </span>
                  <button
                    onClick={() => copyToClipboard(content.metaDescription!, 'metaDescription')}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {copied === 'metaDescription' ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{content.metaDescription}</p>
            </div>
          )}

          {/* Keywords */}
          {content.keywords && content.keywords.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-gray-500">Keywords</label>
                <button
                  onClick={() => copyToClipboard(content.keywords!.join(', '), 'keywords')}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  {copied === 'keywords' ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {content.keywords.map((kw, i) => (
                  <span key={i} className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Short Description */}
          {content.shortDescription && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-gray-500">Krótki opis</label>
                <button
                  onClick={() => copyToClipboard(content.shortDescription!, 'shortDescription')}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  {copied === 'shortDescription' ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <p className="text-sm">{content.shortDescription}</p>
            </div>
          )}

          {/* Long Description */}
          {content.longDescription && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-gray-500">Pełny opis</label>
                <button
                  onClick={() => copyToClipboard(content.longDescription!, 'longDescription')}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  {copied === 'longDescription' ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{content.longDescription}</p>
            </div>
          )}

          {/* Tags */}
          {content.tags && content.tags.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-gray-500">Tagi</label>
                <button
                  onClick={() => copyToClipboard(content.tags!.join(', '), 'tags')}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  {copied === 'tags' ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {content.tags.map((tag, i) => (
                  <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Alt Text */}
          {content.altText && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                  <Image className="w-3 h-3" /> Alt Text
                </label>
                <button
                  onClick={() => copyToClipboard(content.altText!, 'altText')}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  {copied === 'altText' ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{content.altText}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={generateSEO}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-white/50 text-sm"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Regeneruj
            </button>
            {onApply && (
              <button
                onClick={handleApply}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
              >
                <Check className="w-4 h-4" />
                Zastosuj wszystko
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AISEOGenerator
