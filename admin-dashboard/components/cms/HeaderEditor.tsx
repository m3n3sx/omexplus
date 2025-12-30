'use client'

import { useState } from 'react'
import { 
  ColorPicker, 
  ImageEditor, 
  LinksListEditor, 
  ContactInfoEditor,
  CMSLink,
  CMSImage,
  ContactInfo
} from './CMSEditor'
import { Settings, Eye, Palette, Menu, Phone, Globe } from 'lucide-react'

export interface HeaderContent {
  logo: CMSImage
  logoText?: string
  backgroundColor?: string
  topBarBackgroundColor?: string
  topBarTextColor?: string
  mainBackgroundColor?: string
  mainTextColor?: string
  contact: ContactInfo
  navigation: CMSLink[]
  topBarLinks: CMSLink[]
  showCart?: boolean
  showUser?: boolean
  showSearch?: boolean
  showLanguageSwitcher?: boolean
  showCurrencySwitcher?: boolean
  languages?: { code: string; name: string; flag: string }[]
  currencies?: { code: string; symbol: string }[]
}

const defaultContent: HeaderContent = {
  logo: { src: '', alt: 'Logo' },
  logoText: 'OMEX',
  backgroundColor: '#FFFFFF',
  topBarBackgroundColor: '#FFFFFF',
  topBarTextColor: '#374151',
  mainBackgroundColor: '#FFAA21',
  mainTextColor: '#111827',
  contact: { phone: '+48 500 169 060', email: 'kontakt@omex.pl' },
  navigation: [],
  topBarLinks: [],
  showCart: true,
  showUser: true,
  showSearch: true,
  showLanguageSwitcher: true,
  showCurrencySwitcher: true,
}

interface HeaderEditorProps {
  content: Partial<HeaderContent>
  onChange: (content: HeaderContent) => void
}

export function HeaderEditor({ content, onChange }: HeaderEditorProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'colors' | 'navigation' | 'features'>('general')
  const data: HeaderContent = { ...defaultContent, ...content }

  const tabs = [
    { id: 'general', label: 'Ogólne', icon: Settings },
    { id: 'colors', label: 'Kolory', icon: Palette },
    { id: 'navigation', label: 'Nawigacja', icon: Menu },
    { id: 'features', label: 'Funkcje', icon: Globe },
  ]

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
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

      {/* General Tab */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Logo (obraz)</label>
              <input
                type="text"
                value={data.logo.src || ''}
                onChange={(e) => onChange({ ...data, logo: { ...data.logo, src: e.target.value } })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="/images/logo.png"
              />
            </div>
          </div>
          
          <ContactInfoEditor
            contact={data.contact}
            onChange={(contact) => onChange({ ...data, contact })}
          />
        </div>
      )}

      {/* Colors Tab */}
      {activeTab === 'colors' && (
        <div className="space-y-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-4">Top Bar</h4>
            <div className="grid grid-cols-2 gap-4">
              <ColorPicker
                label="Kolor tła"
                value={data.topBarBackgroundColor || ''}
                onChange={(color) => onChange({ ...data, topBarBackgroundColor: color })}
              />
              <ColorPicker
                label="Kolor tekstu"
                value={data.topBarTextColor || ''}
                onChange={(color) => onChange({ ...data, topBarTextColor: color })}
              />
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-4">Główny Header</h4>
            <div className="grid grid-cols-2 gap-4">
              <ColorPicker
                label="Kolor tła"
                value={data.mainBackgroundColor || ''}
                onChange={(color) => onChange({ ...data, mainBackgroundColor: color })}
              />
              <ColorPicker
                label="Kolor tekstu"
                value={data.mainTextColor || ''}
                onChange={(color) => onChange({ ...data, mainTextColor: color })}
              />
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tab */}
      {activeTab === 'navigation' && (
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-4">Linki w Top Bar</h4>
            <LinksListEditor
              links={data.topBarLinks}
              onChange={(links) => onChange({ ...data, topBarLinks: links })}
            />
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-4">Główna nawigacja</h4>
            <LinksListEditor
              links={data.navigation}
              onChange={(links) => onChange({ ...data, navigation: links })}
            />
          </div>
        </div>
      )}

      {/* Features Tab */}
      {activeTab === 'features' && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">Widoczne elementy</h4>
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: 'showCart', label: 'Koszyk' },
              { key: 'showUser', label: 'Ikona użytkownika' },
              { key: 'showSearch', label: 'Wyszukiwarka' },
              { key: 'showLanguageSwitcher', label: 'Wybór języka' },
              { key: 'showCurrencySwitcher', label: 'Wybór waluty' },
            ].map(item => (
              <label key={item.key} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <input
                  type="checkbox"
                  checked={(data as any)[item.key] ?? true}
                  onChange={(e) => onChange({ ...data, [item.key]: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default HeaderEditor
