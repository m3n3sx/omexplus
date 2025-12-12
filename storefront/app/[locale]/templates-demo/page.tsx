'use client'

/**
 * Templates Demo Page
 * 
 * Demonstracja wszystkich dostępnych szablonów komponentów.
 * Użyj tej strony jako referencję podczas developmentu.
 */

import { useState } from 'react'
import {
  ProductCardTemplate,
  MainCategoryCard,
  Button,
  InputField,
  TextareaField,
  SelectField,
  CheckboxField,
  CartItemTemplate,
  InfoCardTemplate,
  FeatureCardTemplate,
  StatCardTemplate,
  ModalTemplate,
  ConfirmModalTemplate,
  NotificationTemplate,
  NotificationProvider,
  useNotification,
  EmptyState,
  ErrorMessage,
} from '@/components/templates'

function TemplatesDemoContent() {
  const [showModal, setShowModal] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const { success, error, warning, info } = useNotification()

  // Mock data
  const mockProduct = {
    id: '1',
    title: 'Pompa hydrauliczna CAT 320D',
    handle: 'pompa-hydrauliczna-cat-320d',
    thumbnail: '/placeholder.svg',
    description: 'Wysokiej jakości pompa hydrauliczna do koparek CAT',
    variants: [{
      prices: [{ amount: 29999, currency_code: 'PLN' }]
    }]
  }

  const mockCategory = {
    id: '1',
    name: 'Układ Hydrauliczny',
    slug: 'uklad-hydrauliczny',
    description: 'Pompy, silniki, zawory, cylindry hydrauliczne',
    product_count: 150
  }

  const mockCartItem = {
    id: '1',
    title: 'Pompa hydrauliczna',
    handle: 'pompa-hydrauliczna',
    thumbnail: '/placeholder.svg',
    quantity: 2,
    price: 299.99,
    currency: 'PLN'
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="container mx-auto px-4 max-w-[1400px]">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-neutral-900 mb-4">
            🎨 System Szablonów
          </h1>
          <p className="text-xl text-neutral-600">
            Demonstracja wszystkich dostępnych komponentów
          </p>
        </div>

        {/* Buttons Section */}
        <Section title="Przyciski (Button)">
          <div className="flex flex-wrap gap-4">
            <Button variant="primary" size="sm">Primary Small</Button>
            <Button variant="primary" size="md">Primary Medium</Button>
            <Button variant="primary" size="lg">Primary Large</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button isLoading>Loading...</Button>
            <Button disabled>Disabled</Button>
          </div>
        </Section>

        {/* Form Fields Section */}
        <Section title="Pola Formularzy">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            <InputField
              label="Pole tekstowe"
              placeholder="Wpisz tekst..."
              helperText="To jest tekst pomocniczy"
            />
            
            <InputField
              label="Pole z błędem"
              error="To pole jest wymagane"
            />
            
            <TextareaField
              label="Pole wieloliniowe"
              rows={4}
              placeholder="Wpisz dłuższy tekst..."
            />
            
            <SelectField
              label="Lista rozwijana"
              options={[
                { value: '', label: 'Wybierz opcję' },
                { value: '1', label: 'Opcja 1' },
                { value: '2', label: 'Opcja 2' },
              ]}
            />
            
            <div className="md:col-span-2">
              <CheckboxField label="Akceptuję regulamin" />
            </div>
          </div>
        </Section>

        {/* Product Card Section */}
        <Section title="Karta Produktu (ProductCardTemplate)">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ProductCardTemplate product={mockProduct} />
            <ProductCardTemplate product={mockProduct} />
            <ProductCardTemplate product={mockProduct} />
            <ProductCardTemplate product={mockProduct} />
          </div>
        </Section>

        {/* Category Card Section */}
        <Section title="Karta Kategorii (MainCategoryCard)">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <MainCategoryCard category={mockCategory} />
            <MainCategoryCard category={mockCategory} />
            <MainCategoryCard category={mockCategory} />
          </div>
        </Section>

        {/* Cart Item Section */}
        <Section title="Element Koszyka (CartItemTemplate)">
          <div className="max-w-2xl bg-white rounded-lg p-6">
            <CartItemTemplate item={mockCartItem} />
          </div>
        </Section>

        {/* Info Cards Section */}
        <Section title="Karty Informacyjne">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoCardTemplate
              icon="📦"
              title="Darmowa dostawa"
              description="Dla zamówień powyżej 500 PLN"
              variant="primary"
              link={{ href: '#', label: 'Dowiedz się więcej' }}
            />
            
            <InfoCardTemplate
              icon="✓"
              title="Gwarancja jakości"
              description="24 miesiące gwarancji na wszystkie produkty"
              variant="success"
            />
            
            <InfoCardTemplate
              icon="⚠"
              title="Uwaga"
              description="Niektóre produkty mogą być niedostępne"
              variant="warning"
            />
          </div>
        </Section>

        {/* Feature Cards Section */}
        <Section title="Karty Funkcji">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCardTemplate
              icon={<svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/></svg>}
              title="Bezpieczne płatności"
              description="Szyfrowane połączenie SSL"
            />
            
            <FeatureCardTemplate
              icon={<svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>}
              title="Sprawdzona jakość"
              description="Tylko oryginalne części"
            />
            
            <FeatureCardTemplate
              icon={<svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>}
              title="Szybka realizacja"
              description="Wysyłka w 24h"
            />
          </div>
        </Section>

        {/* Stat Cards Section */}
        <Section title="Karty Statystyk">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCardTemplate
              value="10,000+"
              label="Produktów"
              icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>}
              trend={{ value: 15, isPositive: true }}
            />
            
            <StatCardTemplate
              value="5,000+"
              label="Klientów"
              icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>}
            />
            
            <StatCardTemplate
              value="24h"
              label="Dostawa"
              icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>}
            />
          </div>
        </Section>

        {/* Modals Section */}
        <Section title="Modale">
          <div className="flex gap-4">
            <Button onClick={() => setShowModal(true)}>
              Otwórz Modal
            </Button>
            <Button onClick={() => setShowConfirm(true)} variant="outline">
              Otwórz Potwierdzenie
            </Button>
          </div>
        </Section>

        {/* Notifications Section */}
        <Section title="Notyfikacje">
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => success('Operacja zakończona sukcesem!')}>
              Success
            </Button>
            <Button onClick={() => error('Wystąpił błąd!')}>
              Error
            </Button>
            <Button onClick={() => warning('Uwaga! To jest ostrzeżenie')}>
              Warning
            </Button>
            <Button onClick={() => info('To jest informacja')}>
              Info
            </Button>
          </div>
        </Section>

        {/* Empty State Section */}
        <Section title="Pusty Stan">
          <EmptyState
            icon="🔍"
            title="Nie znaleziono wyników"
            description="Spróbuj zmienić kryteria wyszukiwania"
            action={{
              label: 'Wyczyść filtry',
              onClick: () => alert('Filtry wyczyszczone!')
            }}
          />
        </Section>

        {/* Error Message Section */}
        <Section title="Komunikat Błędu">
          <ErrorMessage
            title="Wystąpił błąd"
            message="Nie udało się załadować danych. Spróbuj ponownie."
            onRetry={() => alert('Ponowne ładowanie...')}
          />
        </Section>
      </div>

      {/* Modal Examples */}
      <ModalTemplate
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Przykładowy Modal"
        size="md"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Anuluj
            </Button>
            <Button onClick={() => setShowModal(false)}>
              Zapisz
            </Button>
          </div>
        }
      >
        <p className="text-neutral-600">
          To jest przykładowa treść modala. Możesz tutaj umieścić dowolną zawartość.
        </p>
      </ModalTemplate>

      <ConfirmModalTemplate
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => {
          success('Akcja potwierdzona!')
          setShowConfirm(false)
        }}
        title="Potwierdź akcję"
        message="Czy na pewno chcesz wykonać tę akcję?"
        variant="danger"
      />
    </div>
  )
}

export default function TemplatesDemoPage() {
  return (
    <NotificationProvider>
      <TemplatesDemoContent />
    </NotificationProvider>
  )
}

// Helper component for sections
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-16">
      <h2 className="text-3xl font-bold text-neutral-900 mb-6 pb-3 border-b-2 border-neutral-200">
        {title}
      </h2>
      {children}
    </div>
  )
}
