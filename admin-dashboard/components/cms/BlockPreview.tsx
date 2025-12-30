'use client'

import { ContentBlock } from './SimplePageEditor'

interface BlockPreviewProps {
  blocks: ContentBlock[]
}

export function BlockPreview({ blocks }: BlockPreviewProps) {
  const renderBlock = (block: ContentBlock) => {
    switch (block.type) {
      case 'heading':
        const HeadingTag = (block.data.level || 'h2') as keyof JSX.IntrinsicElements
        const headingSizes: Record<string, string> = {
          h1: 'text-4xl font-bold',
          h2: 'text-3xl font-bold',
          h3: 'text-2xl font-semibold',
          h4: 'text-xl font-semibold'
        }
        return (
          <HeadingTag 
            className={`${headingSizes[block.data.level] || headingSizes.h2} text-gray-900 mb-4`}
            style={{ textAlign: block.data.align || 'left' }}
          >
            {block.data.text || 'Nagłówek'}
          </HeadingTag>
        )

      case 'text':
        return (
          <div 
            className="prose prose-gray max-w-none mb-4"
            style={{ textAlign: block.data.align || 'left' }}
            dangerouslySetInnerHTML={{ __html: block.data.html || '<p>Tekst...</p>' }}
          />
        )

      case 'image':
        if (!block.data.src) {
          return (
            <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-400 mb-4">
              Brak obrazu
            </div>
          )
        }
        return (
          <figure className="mb-4" style={{ textAlign: block.data.align || 'center' }}>
            <img 
              src={block.data.src} 
              alt={block.data.alt || ''} 
              className="max-w-full h-auto rounded-lg inline-block"
            />
            {block.data.caption && (
              <figcaption className="text-sm text-gray-500 mt-2">{block.data.caption}</figcaption>
            )}
          </figure>
        )

      case 'button':
        const buttonStyles: Record<string, string> = {
          primary: 'bg-blue-600 text-white hover:bg-blue-700',
          secondary: 'bg-gray-600 text-white hover:bg-gray-700',
          outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
          success: 'bg-green-600 text-white hover:bg-green-700',
          danger: 'bg-red-600 text-white hover:bg-red-700'
        }
        return (
          <div className="mb-4" style={{ textAlign: block.data.align || 'center' }}>
            <a 
              href={block.data.url || '#'}
              className={`inline-block px-6 py-3 rounded-lg font-medium transition-colors ${
                buttonStyles[block.data.style] || buttonStyles.primary
              }`}
            >
              {block.data.text || 'Przycisk'}
            </a>
          </div>
        )

      case 'divider':
        const dividerStyles: Record<string, string> = {
          solid: 'border-t-2 border-gray-200',
          dashed: 'border-t-2 border-dashed border-gray-200',
          dotted: 'border-t-2 border-dotted border-gray-200',
          thick: 'border-t-4 border-gray-300'
        }
        return (
          <hr className={`my-8 ${dividerStyles[block.data.style] || dividerStyles.solid}`} />
        )

      case 'video':
        const getEmbedUrl = (url: string) => {
          if (!url) return null
          const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)
          if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`
          const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
          if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`
          return null
        }
        const embedUrl = getEmbedUrl(block.data.url)
        if (!embedUrl) {
          return (
            <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-400 mb-4">
              Brak wideo
            </div>
          )
        }
        return (
          <div className="aspect-video rounded-lg overflow-hidden mb-4">
            <iframe
              src={embedUrl}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        )

      case 'quote':
        return (
          <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 rounded-r-lg">
            <p className="text-lg italic text-gray-700">{block.data.text || 'Cytat...'}</p>
            {block.data.author && (
              <footer className="text-sm text-gray-500 mt-2">— {block.data.author}</footer>
            )}
          </blockquote>
        )

      case 'list':
        const ListTag = block.data.ordered ? 'ol' : 'ul'
        return (
          <ListTag className={`mb-4 pl-6 ${block.data.ordered ? 'list-decimal' : 'list-disc'}`}>
            {(block.data.items || []).map((item: string, i: number) => (
              <li key={i} className="text-gray-700 mb-1">{item || 'Element listy'}</li>
            ))}
          </ListTag>
        )

      default:
        return null
    }
  }

  return (
    <div className="prose prose-gray max-w-none">
      {blocks.map(block => (
        <div key={block.id}>
          {renderBlock(block)}
        </div>
      ))}
    </div>
  )
}

export default BlockPreview
