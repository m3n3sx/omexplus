"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import DashboardLayout from "@/components/layout/DashboardLayout"
import Button from "@/components/ui/Button"
import Badge from "@/components/ui/Badge"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { formatDate, getOrderStatusColor } from "@/lib/utils"
import { isAuthenticated } from "@/lib/auth"
import api from "@/lib/api-client"
import { ArrowLeft, Save, Truck, XCircle, Trash2, Percent, Plus, Search } from "lucide-react"

const statusTranslations: { [key: string]: string } = {
  'pending': 'Oczekujące',
  'completed': 'Zrealizowane',
  'canceled': 'Anulowane',
  'draft': 'Wersja robocza',
  'archived': 'Zarchiwizowane',
  'requires_action': 'Wymaga działania'
}

const paymentStatusTranslations: { [key: string]: string } = {
  'not_paid': 'Nieopłacone',
  'awaiting': 'Oczekuje',
  'authorized': 'Autoryzowane',
  'captured': 'Opłacone',
  'partially_captured': 'Częściowo opłacone',
  'canceled': 'Anulowane',
  'refunded': 'Zwrócone'
}

interface OrderItem {
  id: string
  item_id?: string
  title: string
  quantity: number
  unit_price: number
  product_id?: string
  variant_id?: string
}

interface ShippingAddress {
  first_name: string
  last_name: string
  address_1: string
  address_2: string
  city: string
  postal_code: string
  phone: string
  company: string
}

export default function OrderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.id as string

  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editMode, setEditMode] = useState(false)
  
  // Editable fields
  const [editedStatus, setEditedStatus] = useState("")
  const [editedEmail, setEditedEmail] = useState("")
  const [editedPaymentStatus, setEditedPaymentStatus] = useState("")
  const [editedPaidAmount, setEditedPaidAmount] = useState<number>(0)
  const [notes, setNotes] = useState("")
  const [editedItems, setEditedItems] = useState<OrderItem[]>([])
  const [deletedItemIds, setDeletedItemIds] = useState<string[]>([])
  const [editedAddress, setEditedAddress] = useState<ShippingAddress>({
    first_name: '', last_name: '', address_1: '', address_2: '',
    city: '', postal_code: '', phone: '', company: ''
  })
  const [discountPercent, setDiscountPercent] = useState("")
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  
  // Add product modal
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [productSearch, setProductSearch] = useState("")
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [newItems, setNewItems] = useState<OrderItem[]>([])

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }
    loadOrder()
  }, [orderId])

  const loadOrder = async () => {
    try {
      setLoading(true)
      const response = await api.getOrder(orderId)
      const o = response.order
      setOrder(o)
      setEditedStatus(o.status)
      setEditedEmail(o.email || "")
      // Payment status: check metadata first, then API field
      const paymentStatus = o.metadata?.payment_status || o.payment_status || "not_paid"
      setEditedPaymentStatus(paymentStatus)
      // Paid amount from metadata or summary
      const paidAmount = o.metadata?.paid_amount ?? o.summary?.paid_total ?? 0
      setEditedPaidAmount(paidAmount)
      setNotes(o.metadata?.notes || "")
      setDeletedItemIds([])
      setSelectedItems(new Set())
      setNewItems([])
      setShowAddProduct(false)
      
      // Map items - handle both order_item and items array
      const itemsData = o.items || []
      setEditedItems(itemsData.map((item: any) => ({
        id: item.id,
        item_id: item.item_id,
        title: item.title || item.variant_title || 'Produkt',
        quantity: item.quantity || 1,
        unit_price: item.unit_price || 0,
        product_id: item.product_id,
        variant_id: item.variant_id
      })))
      
      if (o.shipping_address) {
        setEditedAddress({
          first_name: o.shipping_address.first_name || '',
          last_name: o.shipping_address.last_name || '',
          address_1: o.shipping_address.address_1 || '',
          address_2: o.shipping_address.address_2 || '',
          city: o.shipping_address.city || '',
          postal_code: o.shipping_address.postal_code || '',
          phone: o.shipping_address.phone || '',
          company: o.shipping_address.company || ''
        })
      }
    } catch (error) {
      console.error("Error loading order:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadProducts = async () => {
    try {
      setLoadingProducts(true)
      const response = await api.getProducts({ limit: 100 })
      setProducts(response.products || [])
    } catch (error) {
      console.error("Error loading products:", error)
    } finally {
      setLoadingProducts(false)
    }
  }

  const addProductToOrder = (product: any, variant?: any) => {
    const selectedVariant = variant || product.variants?.[0]
    if (!selectedVariant) return
    
    const price = selectedVariant.prices?.find((p: any) => p.currency_code === 'pln')?.amount || 0
    
    const newItem: OrderItem = {
      id: `new_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: product.title + (selectedVariant.title && selectedVariant.title !== 'Default' ? ` - ${selectedVariant.title}` : ''),
      quantity: 1,
      unit_price: price,
      product_id: product.id,
      variant_id: selectedVariant.id
    }
    
    setNewItems(prev => [...prev, newItem])
    setEditedItems(prev => [...prev, newItem])
    setShowAddProduct(false)
    setProductSearch("")
  }

  const filteredProducts = products.filter(p => 
    p.title?.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.variants?.some((v: any) => v.sku?.toLowerCase().includes(productSearch.toLowerCase()))
  )

  const handleSave = async () => {
    try {
      setSaving(true)
      
      // Build metadata WITHOUT payment fields (they are sent separately)
      const cleanMetadata = { ...order.metadata }
      delete cleanMetadata.payment_status
      delete cleanMetadata.paid_amount
      cleanMetadata.notes = notes
      
      const updateData: any = {
        email: editedEmail,
        metadata: cleanMetadata
      }
      
      if (editedStatus !== order.status) {
        updateData.status = editedStatus
      }

      // Always send payment fields separately
      updateData.payment_status = editedPaymentStatus
      updateData.paid_amount = editedPaidAmount

      // Add shipping address if changed
      const origAddr = order.shipping_address || {}
      if (editedAddress.first_name !== origAddr.first_name ||
          editedAddress.last_name !== origAddr.last_name ||
          editedAddress.address_1 !== origAddr.address_1 ||
          editedAddress.city !== origAddr.city ||
          editedAddress.postal_code !== origAddr.postal_code ||
          editedAddress.phone !== origAddr.phone) {
        updateData.shipping_address = editedAddress
      }

      // Prepare item changes
      const itemChanges: any[] = []
      
      // Check for updated items (only existing items, not new ones)
      editedItems.forEach(item => {
        // Skip new items - they are handled separately
        if (item.id.startsWith('new_')) return
        
        const original = order.items?.find((i: any) => i.id === item.id)
        if (original && (original.quantity !== item.quantity || original.unit_price !== item.unit_price)) {
          itemChanges.push({
            id: item.id,
            line_item_id: item.item_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            action: 'update'
          })
        }
      })
      
      // Add new items
      newItems.forEach(item => {
        itemChanges.push({
          variant_id: item.variant_id,
          product_id: item.product_id,
          title: item.title,
          quantity: item.quantity,
          unit_price: item.unit_price,
          action: 'add'
        })
      })
      
      // Add deleted items
      deletedItemIds.forEach(id => {
        itemChanges.push({ id, action: 'delete' })
      })

      if (itemChanges.length > 0) {
        updateData.items = itemChanges
      }
      
      await api.updateOrder(orderId, updateData)
      
      alert("Zamówienie zostało zaktualizowane")
      setEditMode(false)
      loadOrder()
    } catch (error: any) {
      console.error("Error updating order:", error)
      alert(`Błąd: ${error.message || 'Nie udało się zaktualizować zamówienia'}`)
    } finally {
      setSaving(false)
    }
  }

  const updateItemQuantity = (itemId: string, quantity: number) => {
    setEditedItems(items => items.map(item => 
      item.id === itemId ? { ...item, quantity: Math.max(1, quantity) } : item
    ))
  }

  const updateItemPrice = (itemId: string, price: number) => {
    setEditedItems(items => items.map(item => 
      item.id === itemId ? { ...item, unit_price: Math.max(0, price) } : item
    ))
  }

  const removeItem = (itemId: string) => {
    setEditedItems(items => items.filter(item => item.id !== itemId))
    setDeletedItemIds(ids => [...ids, itemId])
    setSelectedItems(sel => {
      const newSel = new Set(sel)
      newSel.delete(itemId)
      return newSel
    })
  }

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(sel => {
      const newSel = new Set(sel)
      if (newSel.has(itemId)) {
        newSel.delete(itemId)
      } else {
        newSel.add(itemId)
      }
      return newSel
    })
  }

  const selectAllItems = () => {
    if (selectedItems.size === editedItems.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(editedItems.map(i => i.id)))
    }
  }

  const applyDiscount = (itemIds: string[] | 'all') => {
    const percent = parseFloat(discountPercent)
    if (isNaN(percent) || percent <= 0 || percent > 100) {
      alert("Podaj prawidłowy procent rabatu (1-100)")
      return
    }
    
    const idsToDiscount = itemIds === 'all' ? editedItems.map(i => i.id) : itemIds
    
    setEditedItems(items => items.map(item => {
      if (idsToDiscount.includes(item.id)) {
        const newPrice = Math.round(item.unit_price * (1 - percent / 100))
        return { ...item, unit_price: newPrice }
      }
      return item
    }))
    setDiscountPercent("")
  }

  const calculateTotal = () => {
    return editedItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    )
  }

  if (!order) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-theme-secondary">Nie znaleziono zamówienia</p>
          <Link href="/orders">
            <Button className="mt-4">Powrót do listy</Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/orders">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Powrót
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Zamówienie #{order.display_id}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Utworzono {formatDate(order.created_at)}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {!editMode ? (
              <Button onClick={() => setEditMode(true)}>
                Edytuj zamówienie
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => {
                  setEditMode(false)
                  loadOrder()
                }}>
                  Anuluj
                </Button>
                <Button onClick={handleSave} isLoading={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  Zapisz zmiany
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Status zamówienia</h2>
              {editMode ? (
                <select
                  value={editedStatus}
                  onChange={(e) => setEditedStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
                >
                  <option value="pending">Oczekujące</option>
                  <option value="completed">Zrealizowane</option>
                  <option value="canceled">Anulowane</option>
                  <option value="archived">Zarchiwizowane</option>
                  <option value="requires_action">Wymaga działania</option>
                </select>
              ) : (
                <Badge className={getOrderStatusColor(order.status)}>
                  {statusTranslations[order.status] || order.status}
                </Badge>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Produkty</h2>
                {editMode && (
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      onClick={() => {
                        setShowAddProduct(true)
                        if (products.length === 0) loadProducts()
                      }}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Dodaj produkt
                    </Button>
                    <input
                      type="number"
                      placeholder="% rabatu"
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(e.target.value)}
                      className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded"
                    />
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      onClick={() => applyDiscount(Array.from(selectedItems))}
                      disabled={selectedItems.size === 0}
                    >
                      <Percent className="w-3 h-3 mr-1" />
                      Zaznaczone
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => applyDiscount('all')}>
                      <Percent className="w-3 h-3 mr-1" />
                      Wszystkie
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Add Product Modal */}
              {showAddProduct && (
                <div className="mb-4 p-4 border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900 dark:text-white">Dodaj produkt</h3>
                    <Button size="sm" variant="ghost" onClick={() => setShowAddProduct(false)}>
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Szukaj produktu..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm"
                    />
                  </div>
                  {loadingProducts ? (
                    <div className="text-center py-4">
                      <LoadingSpinner size="sm" />
                    </div>
                  ) : (
                    <div className="max-h-60 overflow-y-auto space-y-1">
                      {filteredProducts.slice(0, 20).map(product => (
                        <div key={product.id} className="border border-gray-200 dark:border-gray-700 rounded p-2">
                          <div className="font-medium text-sm text-gray-900 dark:text-white mb-1">{product.title}</div>
                          <div className="space-y-1">
                            {product.variants?.map((variant: any) => {
                              const price = variant.prices?.find((p: any) => p.currency_code === 'pln')?.amount || 0
                              return (
                                <button
                                  key={variant.id}
                                  onClick={() => addProductToOrder(product, variant)}
                                  className="w-full flex items-center justify-between px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                                >
                                  <span className="text-gray-700 dark:text-gray-300">
                                    {variant.title || 'Domyślny'} {variant.sku && `(${variant.sku})`}
                                  </span>
                                  <span className="font-medium text-gray-900 dark:text-white">
                                    {(price / 100).toFixed(2)} PLN
                                  </span>
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                      {filteredProducts.length === 0 && (
                        <p className="text-center text-sm text-gray-500 py-4">Nie znaleziono produktów</p>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {editMode && editedItems.length > 0 && (
                <div className="mb-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedItems.size === editedItems.length}
                    onChange={selectAllItems}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Zaznacz wszystkie ({selectedItems.size}/{editedItems.length})
                  </span>
                </div>
              )}
              
              <div className="space-y-2">
                {editedItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                    {editMode && (
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item.id)}
                        onChange={() => toggleItemSelection(item.id)}
                        className="rounded"
                      />
                    )}
                    {editMode ? (
                      <>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate">{item.title}</p>
                        </div>
                        <div className="w-20">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value) || 1)}
                            min="1"
                            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded text-sm text-center"
                          />
                        </div>
                        <div className="w-28">
                          <input
                            type="number"
                            value={(item.unit_price / 100).toFixed(2)}
                            onChange={(e) => updateItemPrice(item.id, Math.round(parseFloat(e.target.value) * 100) || 0)}
                            step="0.01"
                            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded text-sm text-right"
                          />
                        </div>
                        <div className="w-24 text-right text-sm font-medium text-gray-900 dark:text-white">
                          {((item.quantity * item.unit_price) / 100).toFixed(2)} PLN
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => removeItem(item.id)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Ilość: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {(item.unit_price / 100).toFixed(2)} PLN
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Razem: {((item.quantity * item.unit_price) / 100).toFixed(2)} PLN
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                  <span>Suma:</span>
                  <span>{(calculateTotal() / 100).toFixed(2)} PLN</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notatki</h2>
              {editMode ? (
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Dodaj notatki do zamówienia..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg placeholder:text-gray-400"
                />
              ) : (
                <p className="text-gray-600 dark:text-gray-400">{notes || "Brak notatek"}</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Klient</h2>
              {editMode ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Email:</p>
                  <p className="font-medium text-gray-900 dark:text-white">{order.email || "Brak"}</p>
                </div>
              )}
            </div>

            {/* Shipping Address */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Adres dostawy</h2>
              {editMode ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="Imię" value={editedAddress.first_name}
                      onChange={(e) => setEditedAddress({...editedAddress, first_name: e.target.value})}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded text-sm" />
                    <input type="text" placeholder="Nazwisko" value={editedAddress.last_name}
                      onChange={(e) => setEditedAddress({...editedAddress, last_name: e.target.value})}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded text-sm" />
                  </div>
                  <input type="text" placeholder="Firma" value={editedAddress.company}
                    onChange={(e) => setEditedAddress({...editedAddress, company: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded text-sm" />
                  <input type="text" placeholder="Adres" value={editedAddress.address_1}
                    onChange={(e) => setEditedAddress({...editedAddress, address_1: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded text-sm" />
                  <input type="text" placeholder="Adres cd." value={editedAddress.address_2}
                    onChange={(e) => setEditedAddress({...editedAddress, address_2: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded text-sm" />
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="Kod pocztowy" value={editedAddress.postal_code}
                      onChange={(e) => setEditedAddress({...editedAddress, postal_code: e.target.value})}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded text-sm" />
                    <input type="text" placeholder="Miasto" value={editedAddress.city}
                      onChange={(e) => setEditedAddress({...editedAddress, city: e.target.value})}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded text-sm" />
                  </div>
                  <input type="text" placeholder="Telefon" value={editedAddress.phone}
                    onChange={(e) => setEditedAddress({...editedAddress, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded text-sm" />
                </div>
              ) : (
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  {order.shipping_address ? (
                    <>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {order.shipping_address.first_name} {order.shipping_address.last_name}
                      </p>
                      {order.shipping_address.company && <p>{order.shipping_address.company}</p>}
                      <p>{order.shipping_address.address_1}</p>
                      {order.shipping_address.address_2 && <p>{order.shipping_address.address_2}</p>}
                      <p>{order.shipping_address.postal_code} {order.shipping_address.city}</p>
                      {order.shipping_address.phone && <p>Tel: {order.shipping_address.phone}</p>}
                    </>
                  ) : <p>Brak adresu dostawy</p>}
                </div>
              )}
            </div>

            {/* Payment Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Płatność</h2>
              {editMode ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status płatności</label>
                    <select
                      value={editedPaymentStatus}
                      onChange={(e) => {
                        const newStatus = e.target.value
                        setEditedPaymentStatus(newStatus)
                        // Auto-fill paid amount based on status
                        if (newStatus === 'captured') {
                          setEditedPaidAmount(calculateTotal())
                        } else if (newStatus === 'not_paid' || newStatus === 'canceled') {
                          setEditedPaidAmount(0)
                        } else if (newStatus === 'refunded') {
                          setEditedPaidAmount(0)
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm"
                    >
                      <option value="not_paid">Nieopłacone</option>
                      <option value="awaiting">Oczekuje</option>
                      <option value="authorized">Autoryzowane</option>
                      <option value="captured">Opłacone</option>
                      <option value="partially_captured">Częściowo opłacone</option>
                      <option value="canceled">Anulowane</option>
                      <option value="refunded">Zwrócone</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Kwota opłacona (PLN)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={(editedPaidAmount / 100).toFixed(2)}
                      onChange={(e) => setEditedPaidAmount(Math.round(parseFloat(e.target.value || "0") * 100))}
                      disabled={editedPaymentStatus === 'captured' || editedPaymentStatus === 'not_paid' || editedPaymentStatus === 'canceled'}
                      className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm ${
                        (editedPaymentStatus === 'captured' || editedPaymentStatus === 'not_paid' || editedPaymentStatus === 'canceled') 
                          ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    />
                    {editedPaymentStatus === 'captured' && (
                      <p className="text-xs text-gray-500 mt-1">Automatycznie ustawiono pełną kwotę</p>
                    )}
                  </div>
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Suma zamówienia:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{(calculateTotal() / 100).toFixed(2)} PLN</span>
                    </div>
                    {editedPaymentStatus === 'partially_captured' && (
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-600 dark:text-gray-400">Pozostało do zapłaty:</span>
                        <span className="font-medium text-red-600 dark:text-red-400">
                          {((calculateTotal() - editedPaidAmount) / 100).toFixed(2)} PLN
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Status:</span>
                    <Badge className={getOrderStatusColor(order.metadata?.payment_status || order.payment_status)}>
                      {paymentStatusTranslations[order.metadata?.payment_status || order.payment_status] || order.metadata?.payment_status || order.payment_status || "Brak"}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Suma zamówienia:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {(calculateTotal() / 100).toFixed(2)} PLN
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Opłacono:</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {((order.metadata?.paid_amount ?? 0) / 100).toFixed(2)} PLN
                    </span>
                  </div>
                  {(order.metadata?.payment_status === 'partially_captured' || 
                    (order.metadata?.paid_amount !== undefined && order.metadata?.paid_amount > 0 && order.metadata?.paid_amount < calculateTotal())) && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Pozostało:</span>
                      <span className="font-medium text-red-600 dark:text-red-400">
                        {((calculateTotal() - (order.metadata?.paid_amount ?? 0)) / 100).toFixed(2)} PLN
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Waluta:</span>
                    <span className="font-medium text-gray-900 dark:text-white">PLN</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            {!editMode && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Szybkie akcje</h2>
                <div className="space-y-2">
                  <Button variant="secondary" className="w-full justify-start" size="sm">
                    <Truck className="w-4 h-4 mr-2" />
                    Oznacz jako wysłane
                  </Button>
                  <Button variant="secondary" className="w-full justify-start text-red-600 dark:text-red-400" size="sm">
                    <XCircle className="w-4 h-4 mr-2" />
                    Anuluj zamówienie
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
