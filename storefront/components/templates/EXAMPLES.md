# 📚 Przykłady Użycia Szablonów

Praktyczne przykłady użycia wszystkich szablonów w rzeczywistych scenariuszach.

## Spis Treści

1. [Strona Produktów](#strona-produktów)
2. [Strona Kategorii](#strona-kategorii)
3. [Koszyk](#koszyk)
4. [Formularz Kontaktowy](#formularz-kontaktowy)
5. [Strona Profilu](#strona-profilu)
6. [Dashboard Admina](#dashboard-admina)
7. [Strona Wyszukiwania](#strona-wyszukiwania)

---

## Strona Produktów

### Pełna implementacja strony z produktami

```tsx
'use client'

import { useState, useEffect } from 'react'
import {
  ProductCardTemplate,
  ProductSkeleton,
  EmptyState,
  ErrorMessage,
  Button,
} from '@/components/templates'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data.products)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <ErrorMessage
        title="Błąd ładowania produktów"
        message={error}
        onRetry={loadProducts}
      />
    )
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon="📦"
        title="Brak produktów"
        description="Nie znaleziono żadnych produktów"
        action={{
          label: 'Odśwież',
          onClick: loadProducts
        }}
      />
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Produkty</h1>
        <p className="text-neutral-600">
          Znaleziono {products.length} produktów
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCardTemplate key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
```

---

## Strona Kategorii

### Kategoria z hierarchią i produktami

```tsx
'use client'

import { useState, useEffect } from 'react'
import {
  CategoryHierarchy,
  ProductCardTemplate,
  EmptyState,
} from '@/components/templates'

export default function CategoryPage({ params }) {
  const [category, setCategory] = useState(null)
  const [subcategories, setSubcategories] = useState([])
  const [products, setProducts] = useState([])

  useEffect(() => {
    loadCategoryData()
  }, [params.slug])

  const loadCategoryData = async () => {
    const response = await fetch(`/api/categories/${params.slug}`)
    const data = await response.json()
    setCategory(data.category)
    setSubcategories(data.allSubcategories)
    setProducts(data.products)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar */}
      <div className="lg:col-span-1">
        <CategoryHierarchy
          currentCategory={category}
          allSubcategories={subcategories}
        />
      </div>

      {/* Products */}
      <div className="lg:col-span-3">
        <h1 className="text-4xl font-bold mb-8">{category?.name}</h1>
        
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <ProductCardTemplate key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="📦"
            title="Brak produktów w tej kategorii"
            description="Sprawdź inne kategorie"
          />
        )}
      </div>
    </div>
  )
}
```

---

## Koszyk

### Pełna implementacja koszyka

```tsx
'use client'

import { useState } from 'react'
import {
  CartItemTemplate,
  Button,
  EmptyState,
  ConfirmModalTemplate,
  useNotification,
} from '@/components/templates'

export default function CartPage() {
  const [cart, setCart] = useState({ items: [], total: 0 })
  const [itemToRemove, setItemToRemove] = useState(null)
  const { success } = useNotification()

  const updateQuantity = (id, quantity) => {
    setCart(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    }))
    success('Ilość zaktualizowana')
  }

  const removeItem = (id) => {
    setCart(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }))
    setItemToRemove(null)
    success('Produkt usunięty z koszyka')
  }

  if (cart.items.length === 0) {
    return (
      <EmptyState
        icon="🛒"
        title="Twój koszyk jest pusty"
        description="Dodaj produkty do koszyka, aby kontynuować"
        action={{
          label: 'Przeglądaj produkty',
          onClick: () => router.push('/products')
        }}
      />
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Koszyk</h1>

      {/* Cart Items */}
      <div className="bg-white rounded-lg p-6 mb-6">
        {cart.items.map(item => (
          <CartItemTemplate
            key={item.id}
            item={item}
            onUpdateQuantity={updateQuantity}
            onRemove={(id) => setItemToRemove(id)}
          />
        ))}
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <span className="text-2xl font-bold">Razem:</span>
          <span className="text-3xl font-bold text-primary-600">
            {cart.total.toFixed(2)} PLN
          </span>
        </div>

        <Button size="lg" className="w-full">
          Przejdź do kasy
        </Button>
      </div>

      {/* Confirm Remove Modal */}
      <ConfirmModalTemplate
        isOpen={!!itemToRemove}
        onClose={() => setItemToRemove(null)}
        onConfirm={() => removeItem(itemToRemove)}
        title="Usuń produkt"
        message="Czy na pewno chcesz usunąć ten produkt z koszyka?"
        variant="danger"
      />
    </div>
  )
}
```

---

## Formularz Kontaktowy

### Formularz z walidacją

```tsx
'use client'

import { useState } from 'react'
import {
  InputField,
  TextareaField,
  SelectField,
  CheckboxField,
  Button,
  useNotification,
} from '@/components/templates'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    acceptTerms: false,
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { success, error } = useNotification()

  const validate = () => {
    const newErrors = {}
    
    if (!formData.name) newErrors.name = 'Imię jest wymagane'
    if (!formData.email) newErrors.email = 'Email jest wymagany'
    if (!formData.message) newErrors.message = 'Wiadomość jest wymagana'
    if (!formData.acceptTerms) newErrors.acceptTerms = 'Musisz zaakceptować regulamin'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validate()) return
    
    try {
      setLoading(true)
      await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(formData),
      })
      success('Wiadomość wysłana pomyślnie!')
      setFormData({ name: '', email: '', subject: '', message: '', acceptTerms: false })
    } catch (err) {
      error('Wystąpił błąd podczas wysyłania wiadomości')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-4xl font-bold mb-8">Kontakt</h1>

      <InputField
        label="Imię i nazwisko"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        error={errors.name}
        required
      />

      <InputField
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        error={errors.email}
        required
      />

      <SelectField
        label="Temat"
        value={formData.subject}
        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
        options={[
          { value: '', label: 'Wybierz temat' },
          { value: 'order', label: 'Pytanie o zamówienie' },
          { value: 'product', label: 'Pytanie o produkt' },
          { value: 'other', label: 'Inne' },
        ]}
      />

      <TextareaField
        label="Wiadomość"
        rows={6}
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        error={errors.message}
        required
      />

      <CheckboxField
        label="Akceptuję regulamin i politykę prywatności"
        checked={formData.acceptTerms}
        onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
        error={errors.acceptTerms}
        required
      />

      <Button type="submit" size="lg" isLoading={loading} className="w-full">
        Wyślij wiadomość
      </Button>
    </form>
  )
}
```

---

## Strona Profilu

### Profil użytkownika z edycją

```tsx
'use client'

import { useState } from 'react'
import {
  InputField,
  Button,
  ModalTemplate,
  useNotification,
  InfoCardTemplate,
} from '@/components/templates'

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: 'Jan Kowalski',
    email: 'jan@example.com',
    phone: '+48 123 456 789',
  })
  const [showEditModal, setShowEditModal] = useState(false)
  const [editData, setEditData] = useState(user)
  const { success } = useNotification()

  const handleSave = () => {
    setUser(editData)
    setShowEditModal(false)
    success('Profil zaktualizowany!')
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Mój Profil</h1>

      {/* User Info */}
      <div className="bg-white rounded-lg p-8 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
            <p className="text-neutral-600">{user.email}</p>
          </div>
          <Button onClick={() => setShowEditModal(true)}>
            Edytuj profil
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-neutral-600">Email:</span>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <span className="text-sm text-neutral-600">Telefon:</span>
            <p className="font-medium">{user.phone}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InfoCardTemplate
          icon="📦"
          title="Zamówienia"
          description="Zobacz historię zamówień"
          link={{ href: '/orders', label: 'Zobacz' }}
        />
        <InfoCardTemplate
          icon="❤️"
          title="Ulubione"
          description="Twoje ulubione produkty"
          link={{ href: '/favorites', label: 'Zobacz' }}
        />
        <InfoCardTemplate
          icon="⚙️"
          title="Ustawienia"
          description="Zarządzaj kontem"
          link={{ href: '/settings', label: 'Zobacz' }}
        />
      </div>

      {/* Edit Modal */}
      <ModalTemplate
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edytuj profil"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Anuluj
            </Button>
            <Button onClick={handleSave}>
              Zapisz
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          <InputField
            label="Imię i nazwisko"
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
          />
          <InputField
            label="Email"
            type="email"
            value={editData.email}
            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
          />
          <InputField
            label="Telefon"
            value={editData.phone}
            onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
          />
        </div>
      </ModalTemplate>
    </div>
  )
}
```

---

## Dashboard Admina

### Panel administracyjny ze statystykami

```tsx
'use client'

import { useState, useEffect } from 'react'
import {
  StatCardTemplate,
  Button,
  ModalTemplate,
  useNotification,
} from '@/components/templates'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    customers: 0,
    revenue: 0,
  })
  const { success } = useNotification()

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    const response = await fetch('/api/admin/stats')
    const data = await response.json()
    setStats(data)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <Button onClick={() => success('Dane odświeżone!')}>
          Odśwież
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCardTemplate
          value={stats.products}
          label="Produkty"
          icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>}
          trend={{ value: 12, isPositive: true }}
        />
        
        <StatCardTemplate
          value={stats.orders}
          label="Zamówienia"
          icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>}
          trend={{ value: 8, isPositive: true }}
        />
        
        <StatCardTemplate
          value={stats.customers}
          label="Klienci"
          icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>}
          trend={{ value: 5, isPositive: true }}
        />
        
        <StatCardTemplate
          value={`${stats.revenue.toLocaleString()} PLN`}
          label="Przychód"
          icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>}
          trend={{ value: 23, isPositive: true }}
        />
      </div>
    </div>
  )
}
```

---

## Więcej Przykładów

Zobacz również:
- [Strona Demo](/templates-demo) - Wszystkie komponenty w akcji
- [Dokumentacja](./COMPONENT_TEMPLATES.md) - Pełna dokumentacja
- [README](./README.md) - Quick start guide
