'use client'

import { useState } from 'react'
import { 
  ColorPicker, 
  RichTextEditor,
  FooterColumnsEditor, 
  SocialLinksEditor,
  ContactInfoEditor,
  FooterColumn,
  SocialLink,
  ContactInfo
} from './CMSEditor'
import { Settings, Palette, Columns, Share2, CreditCard } from 'lucide-react'

export interface FooterContent {
  backgroundColor?: string
  textColor?: string
  borderColor?: string
  logoText?: string
  description?: string
  columns: FooterColumn[]
  socialLinks: SocialLink[]
  contact: ContactInfo
  copyright?: string
  paymentMethods?: string[]
  bottomLinks?: { text: string; url: string }[]
}

const defaultContent: FooterContent = {
  backgroundColor: '#111827',
  textColor: '#9CA3AF',
  borderColor: '#1F2937',
  logoText: 'OMEX',
  description: 'Twój zaufany partner w dostawie części zamiennych do maszyn budowlanych.',
  columns: [],
  socialLinks: [],
  contact: {},
  copyright: '© 2024 OMEX. Wszystkie prawa zastrzeżone.',
  paymentMethods: ['VISA', 'MC', 'BLIK', 'P24'],
  bottomLinks: [],
}

interface FooterEditorProps {
  content: Partial<FooterContent>
  onChange: (content: FooterContent) => void
}

export function FooterEditor({ content, onChange }: FooterEditorProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'colors' | 'columns' | 'social' | 'bottom'>('general')
  const data: FooterContent = { ...defaultContent, ...content }

  const tabs = [
    { id: 'general', label: 'Ogólne', icon: Settings },
    { id: 'colors', label: 'Kolory', icon: Palette },
    { id: 'columns', label: 'Kolumny', icon: Columns },
    { id: 'social', label: 'Social', icon: Share2 },
    { id: 'bottom', label: 'Dolny pasek', icon: CreditCard },
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

      {activeTab === 'general' && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tekst logo</label>
            <input
              type="text"
              value={data.logoText || ''}
              onChange={(e) => onChange({ ...data, logoText: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="OMEX"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Opis firmy</label>
            <textarea
              value={data.description || ''}
              onChange={(e) => onChange({ ...data, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              rows={3}
              placeholder="Krótki opis firmy..."
            />
          </div>
          
          <ContactInfoEditor
            contact={data.contact}
            onChange={(contact) => onChange({ ...data, contact })}
          />
        </div>
      )}

      {activeTab === 'colors' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
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
            <ColorPicker
              label="Kolor obramowania"
              value={data.borderColor || ''}
              onChange={(color) => onChange({ ...data, borderColor: color })}
            />
          </div>
        </div>
      )}

      {activeTab === 'columns' && (
        <FooterColumnsEditor
          columns={data.columns}
          onChange={(columns) => onChange({ ...data, columns })}
        />
      )}

      {activeTab === 'social' && (
        <SocialLinksEditor
          links={data.socialLinks}
          onChange={(socialLinks) => onChange({ ...data, socialLinks })}
        />
      )}

      {activeTab === 'bottom' && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Copyright</label>
            <input
              type="text"
              value={data.copyright || ''}
              onChange={(e) => onChange({ ...data, copyright: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="© 2024 Firma. Wszystkie prawa zastrzeżone."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Metody płatności</label>
            <input
              type="text"
              value={(data.paymentMethods || []).join(', ')}
              onChange={(e) => onChange({ ...data, paymentMethods: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="VISA, MC, BLIK, P24"
            />
            <p className="text-xs text-gray-500 mt-1">Oddziel przecinkami</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default FooterEditor
