"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table"
import Badge from "@/components/ui/Badge"
import Button from "@/components/ui/Button"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { useToast } from "@/components/ui/Toast"
import { isAuthenticated } from "@/lib/auth"
import api from "@/lib/api-client"
import { Search, Languages, Sparkles, Edit, Check, X } from "lucide-react"

type Locale = 'pl' | 'en' | 'de' | 'uk'

interface Product {
  id: string
  title: string
  handle: string
  description?: string
  thumbnail?: string
}

interface Translation {
  id: string
  locale: Locale
  title?: string
  description?: string
  is_auto_translated?: boolean
}

const LOCALES: { code: Locale; name: string; flag: string }[] = [
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
]

export default function TranslationsPage() {
  const router = useRouter()
  const toast = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [translations, setTranslations] = useState<Record<string, Translation[]>>({})
  const [loading, setLoading] = useState(true)
  const [translating, setTranslating] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [editingTranslation, setEditingTranslation] = useState<{
    productId: string
    locale: Locale
    data: { title: string; description: string }
  } | null>(null)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }
    loadProducts()
  }, [router])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const response = await api.getProducts({ limit: 100 })
      setProducts(response.products as Product[])
      
      // Load translations for each product
      const translationsMap: Record<string, Translation[]> = {}
      for (const product of response.products) {
        try {
          const data = await api.getTranslations('product', product.id)
          translationsMap[product.id] = data.translations || []
        } catch (e) {
          translationsMap[product.id] = []
        }
      }
      setTranslations(translationsMap)
    } catch (error) {
      console.error("Error loading products:", error)
      toast.error("Błąd ładowania produktów")
    } finally {
      setLoading(false)
    }
  }


  const handleAutoTranslate = async (product: Product) => {
    setTranslating(product.id)
    try {
      const result = await api.autoTranslate({
        type: 'product',
        entity_id: product.id,
        source_locale: 'pl',
        source_data: {
          title: product.title,
          description: product.description,
        }
      })
      
      toast.success(`Przetłumaczono produkt na ${Object.keys(result.translations).length} języków`)
      
      // Reload translations for this product
      const data = await api.getTranslations('product', product.id)
      setTranslations(prev => ({
        ...prev,
        [product.id]: data.translations || []
      }))
    } catch (error) {
      console.error("Translation error:", error)
      toast.error("Błąd podczas tłumaczenia")
    } finally {
      setTranslating(null)
    }
  }

  const handleSaveTranslation = async () => {
    if (!editingTranslation) return

    try {
      await api.saveTranslation({
        type: 'product',
        entity_id: editingTranslation.productId,
        locale: editingTranslation.locale,
        data: {
          title: editingTranslation.data.title,
          description: editingTranslation.data.description,
          is_auto_translated: false,
        }
      })
      
      toast.success("Tłumaczenie zapisane")
      
      // Reload translations
      const data = await api.getTranslations('product', editingTranslation.productId)
      setTranslations(prev => ({
        ...prev,
        [editingTranslation.productId]: data.translations || []
      }))
      
      setEditingTranslation(null)
    } catch (error) {
      console.error("Save error:", error)
      toast.error("Błąd podczas zapisywania")
    }
  }

  const getTranslation = (productId: string, locale: Locale): Translation | undefined => {
    return translations[productId]?.find(t => t.locale === locale)
  }

  const hasAllTranslations = (productId: string): boolean => {
    const productTranslations = translations[productId] || []
    return LOCALES.every(l => productTranslations.some(t => t.locale === l.code))
  }

  const filteredProducts = products.filter(product => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      product.title.toLowerCase().includes(query) ||
      product.handle.toLowerCase().includes(query)
    )
  })

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Languages className="w-7 h-7" />
              Tłumaczenia produktów
            </h1>
            <p className="text-gray-600 mt-1">
              Zarządzaj tłumaczeniami produktów na różne języki
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Szukaj produktów..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produkt</TableHead>
                {LOCALES.map(locale => (
                  <TableHead key={locale.code} className="text-center">
                    {locale.flag} {locale.code.toUpperCase()}
                  </TableHead>
                ))}
                <TableHead>Akcje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      {product.thumbnail ? (
                        <img 
                          src={product.thumbnail} 
                          alt={product.title} 
                          className="w-10 h-10 object-cover rounded" 
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded" />
                      )}
                      <div>
                        <p className="font-medium">{product.title}</p>
                        <p className="text-sm text-gray-500">{product.handle}</p>
                      </div>
                    </div>
                  </TableCell>
                  {LOCALES.map(locale => {
                    const trans = getTranslation(product.id, locale.code)
                    return (
                      <TableCell key={locale.code} className="text-center">
                        {trans ? (
                          <div className="flex items-center justify-center gap-1">
                            <Check className="w-4 h-4 text-green-500" />
                            {trans.is_auto_translated && (
                              <Badge variant="warning" className="text-xs">Auto</Badge>
                            )}
                          </div>
                        ) : (
                          <X className="w-4 h-4 text-gray-300 mx-auto" />
                        )}
                      </TableCell>
                    )
                  })}
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setSelectedProduct(product)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAutoTranslate(product)}
                        disabled={translating === product.id}
                      >
                        {translating === product.id ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <Sparkles className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>


      {/* Edit Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  Tłumaczenia: {selectedProduct.title}
                </h2>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {LOCALES.map(locale => {
                const trans = getTranslation(selectedProduct.id, locale.code)
                const isEditing = editingTranslation?.productId === selectedProduct.id && 
                                  editingTranslation?.locale === locale.code
                
                return (
                  <div key={locale.code} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium flex items-center gap-2">
                        <span className="text-xl">{locale.flag}</span>
                        {locale.name}
                        {trans?.is_auto_translated && (
                          <Badge variant="warning">Auto-tłumaczenie</Badge>
                        )}
                      </h3>
                      {!isEditing && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingTranslation({
                            productId: selectedProduct.id,
                            locale: locale.code,
                            data: {
                              title: trans?.title || selectedProduct.title,
                              description: trans?.description || selectedProduct.description || '',
                            }
                          })}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    
                    {isEditing ? (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tytuł
                          </label>
                          <input
                            type="text"
                            value={editingTranslation.data.title}
                            onChange={(e) => setEditingTranslation({
                              ...editingTranslation,
                              data: { ...editingTranslation.data, title: e.target.value }
                            })}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Opis
                          </label>
                          <textarea
                            value={editingTranslation.data.description}
                            onChange={(e) => setEditingTranslation({
                              ...editingTranslation,
                              data: { ...editingTranslation.data, description: e.target.value }
                            })}
                            rows={4}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleSaveTranslation}>
                            Zapisz
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => setEditingTranslation(null)}
                          >
                            Anuluj
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="text-gray-500">Tytuł:</span>{' '}
                          {trans?.title || <span className="text-gray-400 italic">Brak</span>}
                        </p>
                        <p>
                          <span className="text-gray-500">Opis:</span>{' '}
                          {trans?.description ? (
                            <span className="line-clamp-2">{trans.description}</span>
                          ) : (
                            <span className="text-gray-400 italic">Brak</span>
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            
            <div className="p-6 border-t bg-gray-50 flex justify-between">
              <Button
                variant="secondary"
                onClick={() => handleAutoTranslate(selectedProduct)}
                disabled={translating === selectedProduct.id}
              >
                {translating === selectedProduct.id ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Tłumaczenie...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Auto-tłumacz wszystkie
                  </>
                )}
              </Button>
              <Button onClick={() => setSelectedProduct(null)}>
                Zamknij
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
