'use client'

import { useState } from 'react'
import { PageElement } from './VisualEditor'
import { Layout, Type, Image, Columns, Star, ShoppingBag, Users, Mail, Phone, MapPin, Clock, ChevronRight } from 'lucide-react'

const generateId = () => `el_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

// Gotowe szablony sekcji
export const SECTION_TEMPLATES: { name: string; icon: any; category: string; elements: PageElement[] }[] = [
  {
    name: 'Hero z obrazem',
    icon: Layout,
    category: 'Hero',
    elements: [
      {
        id: generateId(),
        type: 'section',
        content: {},
        style: { paddingTop: '80px', paddingBottom: '80px', backgroundColor: '#F9FAFB' },
        children: [
          {
            id: generateId(),
            type: 'container',
            content: {},
            style: { maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '24px', paddingRight: '24px' },
            children: [
              {
                id: generateId(),
                type: 'columns',
                content: { columns: 2, gap: '48px' },
                style: {},
                children: [
                  {
                    id: generateId(),
                    type: 'heading',
                    content: { text: 'Twój główny nagłówek tutaj', level: 'h1' },
                    style: { fontSize: '48px', fontWeight: '700', textColor: '#111827', marginBottom: '24px' }
                  },
                  {
                    id: generateId(),
                    type: 'text',
                    content: { html: '<p>Opis Twojej oferty. Wyjaśnij co oferujesz i dlaczego klient powinien wybrać właśnie Ciebie.</p>' },
                    style: { fontSize: '18px', textColor: '#6B7280', lineHeight: '1.7', marginBottom: '32px' }
                  },
                  {
                    id: generateId(),
                    type: 'button',
                    content: { text: 'Rozpocznij teraz', url: '#', target: '_self' },
                    style: { backgroundColor: '#3B82F6', textColor: '#FFFFFF', paddingTop: '16px', paddingBottom: '16px', paddingLeft: '32px', paddingRight: '32px', borderRadius: '8px', fontSize: '16px', fontWeight: '600' }
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    name: 'Hero wycentrowany',
    icon: Layout,
    category: 'Hero',
    elements: [
      {
        id: generateId(),
        type: 'section',
        content: {},
        style: { paddingTop: '120px', paddingBottom: '120px', backgroundColor: '#111827' },
        children: [
          {
            id: generateId(),
            type: 'container',
            content: {},
            style: { maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '24px', paddingRight: '24px', textAlign: 'center' },
            children: [
              {
                id: generateId(),
                type: 'heading',
                content: { text: 'Buduj przyszłość z nami', level: 'h1' },
                style: { fontSize: '56px', fontWeight: '800', textColor: '#FFFFFF', marginBottom: '24px' }
              },
              {
                id: generateId(),
                type: 'text',
                content: { html: '<p>Dołącz do tysięcy zadowolonych klientów i przekonaj się sam.</p>' },
                style: { fontSize: '20px', textColor: '#9CA3AF', lineHeight: '1.6', marginBottom: '40px' }
              },
              {
                id: generateId(),
                type: 'button',
                content: { text: 'Dowiedz się więcej', url: '#' },
                style: { backgroundColor: '#FFAA21', textColor: '#111827', paddingTop: '16px', paddingBottom: '16px', paddingLeft: '40px', paddingRight: '40px', borderRadius: '9999px', fontSize: '16px', fontWeight: '700' }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    name: 'Cechy / Features',
    icon: Star,
    category: 'Sekcje',
    elements: [
      {
        id: generateId(),
        type: 'section',
        content: {},
        style: { paddingTop: '80px', paddingBottom: '80px', backgroundColor: '#FFFFFF' },
        children: [
          {
            id: generateId(),
            type: 'container',
            content: {},
            style: { maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '24px', paddingRight: '24px' },
            children: [
              {
                id: generateId(),
                type: 'heading',
                content: { text: 'Dlaczego my?', level: 'h2' },
                style: { fontSize: '36px', fontWeight: '700', textColor: '#111827', marginBottom: '16px', textAlign: 'center' }
              },
              {
                id: generateId(),
                type: 'text',
                content: { html: '<p>Poznaj nasze główne zalety</p>' },
                style: { fontSize: '18px', textColor: '#6B7280', marginBottom: '48px', textAlign: 'center' }
              },
              {
                id: generateId(),
                type: 'columns',
                content: { columns: 3, gap: '32px' },
                style: {},
                children: []
              }
            ]
          }
        ]
      }
    ]
  },
  {
    name: 'CTA Banner',
    icon: ShoppingBag,
    category: 'CTA',
    elements: [
      {
        id: generateId(),
        type: 'section',
        content: {},
        style: { paddingTop: '64px', paddingBottom: '64px', backgroundColor: '#3B82F6' },
        children: [
          {
            id: generateId(),
            type: 'container',
            content: {},
            style: { maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '24px', paddingRight: '24px', textAlign: 'center' },
            children: [
              {
                id: generateId(),
                type: 'heading',
                content: { text: 'Gotowy na start?', level: 'h2' },
                style: { fontSize: '32px', fontWeight: '700', textColor: '#FFFFFF', marginBottom: '16px' }
              },
              {
                id: generateId(),
                type: 'text',
                content: { html: '<p>Skontaktuj się z nami już dziś i otrzymaj bezpłatną wycenę.</p>' },
                style: { fontSize: '18px', textColor: '#DBEAFE', marginBottom: '32px' }
              },
              {
                id: generateId(),
                type: 'button',
                content: { text: 'Skontaktuj się', url: '/kontakt' },
                style: { backgroundColor: '#FFFFFF', textColor: '#3B82F6', paddingTop: '14px', paddingBottom: '14px', paddingLeft: '32px', paddingRight: '32px', borderRadius: '8px', fontSize: '16px', fontWeight: '600' }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    name: 'Kontakt',
    icon: Mail,
    category: 'Kontakt',
    elements: [
      {
        id: generateId(),
        type: 'section',
        content: {},
        style: { paddingTop: '80px', paddingBottom: '80px', backgroundColor: '#F9FAFB' },
        children: [
          {
            id: generateId(),
            type: 'container',
            content: {},
            style: { maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '24px', paddingRight: '24px', textAlign: 'center' },
            children: [
              {
                id: generateId(),
                type: 'heading',
                content: { text: 'Skontaktuj się z nami', level: 'h2' },
                style: { fontSize: '32px', fontWeight: '700', textColor: '#111827', marginBottom: '32px' }
              },
              {
                id: generateId(),
                type: 'icon',
                content: { icon: '📞', size: '48px' },
                style: { textAlign: 'center', marginBottom: '16px' }
              },
              {
                id: generateId(),
                type: 'text',
                content: { html: '<p><strong>Telefon:</strong> +48 500 169 060</p>' },
                style: { fontSize: '18px', textColor: '#374151', marginBottom: '16px' }
              },
              {
                id: generateId(),
                type: 'icon',
                content: { icon: '✉️', size: '48px' },
                style: { textAlign: 'center', marginBottom: '16px' }
              },
              {
                id: generateId(),
                type: 'text',
                content: { html: '<p><strong>Email:</strong> kontakt@firma.pl</p>' },
                style: { fontSize: '18px', textColor: '#374151', marginBottom: '16px' }
              },
              {
                id: generateId(),
                type: 'icon',
                content: { icon: '📍', size: '48px' },
                style: { textAlign: 'center', marginBottom: '16px' }
              },
              {
                id: generateId(),
                type: 'text',
                content: { html: '<p><strong>Adres:</strong> ul. Przykładowa 1, 00-000 Miasto</p>' },
                style: { fontSize: '18px', textColor: '#374151' }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    name: 'Testimoniale',
    icon: Users,
    category: 'Social Proof',
    elements: [
      {
        id: generateId(),
        type: 'section',
        content: {},
        style: { paddingTop: '80px', paddingBottom: '80px', backgroundColor: '#FFFFFF' },
        children: [
          {
            id: generateId(),
            type: 'container',
            content: {},
            style: { maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '24px', paddingRight: '24px' },
            children: [
              {
                id: generateId(),
                type: 'heading',
                content: { text: 'Co mówią nasi klienci', level: 'h2' },
                style: { fontSize: '36px', fontWeight: '700', textColor: '#111827', marginBottom: '48px', textAlign: 'center' }
              },
              {
                id: generateId(),
                type: 'columns',
                content: { columns: 3, gap: '24px' },
                style: {},
                children: []
              }
            ]
          }
        ]
      }
    ]
  }
]

interface TemplatesPanelProps {
  onInsert: (elements: PageElement[]) => void
}

export function TemplatesPanel({ onInsert }: TemplatesPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  
  const categories = [...new Set(SECTION_TEMPLATES.map(t => t.category))]
  const filteredTemplates = selectedCategory 
    ? SECTION_TEMPLATES.filter(t => t.category === selectedCategory)
    : SECTION_TEMPLATES

  // Klonuj elementy z nowymi ID
  const cloneWithNewIds = (elements: PageElement[]): PageElement[] => {
    return elements.map(el => ({
      ...el,
      id: generateId(),
      children: el.children ? cloneWithNewIds(el.children) : undefined
    }))
  }

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Szablony sekcji</h3>
        <p className="text-xs text-gray-400 mb-4">Kliknij aby dodać gotową sekcję</p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => setSelectedCategory(null)}
          className={`px-2 py-1 text-xs rounded ${!selectedCategory ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 hover:bg-gray-200'}`}
        >
          Wszystkie
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-2 py-1 text-xs rounded ${selectedCategory === cat ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Templates grid */}
      <div className="space-y-2">
        {filteredTemplates.map((template, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onInsert(cloneWithNewIds(template.elements))}
            className="w-full flex items-center gap-3 p-3 bg-white border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
          >
            <div className="p-2 bg-gray-100 rounded">
              <template.icon className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">{template.name}</div>
              <div className="text-xs text-gray-500">{template.category}</div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        ))}
      </div>
    </div>
  )
}

export default TemplatesPanel
