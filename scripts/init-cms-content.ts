import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/medusa_db'
})

const defaultCMSContent = [
  {
    key: 'main-header',
    type: 'header',
    name: 'Główny Header',
    description: 'Header strony - logo, nawigacja, kontakt',
    locale: 'pl',
    content: {
      logoText: 'OMEX',
      topBarBackgroundColor: '#FFFFFF',
      topBarTextColor: '#374151',
      mainBackgroundColor: '#FFAA21',
      mainTextColor: '#111827',
      contact: {
        phone: '+48 500 169 060',
        email: 'omexplus@gmail.com'
      },
      navigation: [
        { text: 'PRODUKTY', url: '/products', style: 'link' },
        { text: 'O NAS', url: '/o-nas', style: 'link' },
        { text: 'PROMOCJE', url: '/promocje', style: 'link' },
        { text: 'KONTAKT', url: '/kontakt', style: 'link' }
      ],
      topBarLinks: [
        { text: 'FAQ', url: '/faq', style: 'link' },
        { text: 'ŚLEDŹ PACZKĘ', url: '/tracking', style: 'link' }
      ],
      showCart: true,
      showUser: true,
      showLanguageSwitcher: true,
      showCurrencySwitcher: true
    }
  },
  {
    key: 'main-footer',
    type: 'footer',
    name: 'Główny Footer',
    description: 'Footer strony - linki, social media, copyright',
    locale: 'pl',
    content: {
      backgroundColor: '#111827',
      textColor: '#9CA3AF',
      borderColor: '#1F2937',
      logoText: 'OMEX',
      description: 'Twój zaufany partner w dostawie części zamiennych do maszyn budowlanych. Najwyższa jakość, konkurencyjne ceny, szybka dostawa.',
      columns: [
        {
          title: 'Sklep',
          links: [
            { text: 'Wszystkie produkty', url: '/products' },
            { text: 'Kategorie', url: '/categories' },
            { text: 'Promocje', url: '/promocje' },
            { text: 'Nowości', url: '/nowosci' }
          ]
        },
        {
          title: 'Obsługa klienta',
          links: [
            { text: 'Kontakt', url: '/kontakt' },
            { text: 'FAQ', url: '/faq' },
            { text: 'Śledzenie paczki', url: '/tracking' },
            { text: 'Zwroty i reklamacje', url: '/zwroty' }
          ]
        },
        {
          title: 'Firma',
          links: [
            { text: 'O nas', url: '/o-nas' },
            { text: 'Regulamin', url: '/regulamin' },
            { text: 'Polityka prywatności', url: '/polityka-prywatnosci' }
          ]
        }
      ],
      socialLinks: [
        { platform: 'facebook', url: 'https://facebook.com/omex' },
        { platform: 'instagram', url: 'https://instagram.com/omex' }
      ],
      copyright: '© 2024 OMEX. Wszystkie prawa zastrzeżone.',
      paymentMethods: ['VISA', 'MC', 'BLIK', 'P24']
    }
  },
  {
    key: 'home-hero',
    type: 'hero',
    name: 'Hero Strony Głównej',
    description: 'Główna sekcja hero na stronie głównej',
    locale: 'pl',
    content: {
      badge: 'Nowa kolekcja 2024',
      title: 'Części do maszyn budowlanych',
      description: 'Odkryj najwyższej jakości części zamienne do koparek, ładowarek i innych maszyn budowlanych. Gwarancja najlepszych cen.',
      backgroundColor: '#F9FAFB',
      textColor: '#111827',
      buttons: [
        { text: 'Przeglądaj produkty', url: '/products', style: 'button', color: '#111827' },
        { text: 'Zobacz kategorie', url: '/categories', style: 'outline', color: '#111827' }
      ],
      stats: [
        { value: '5000+', label: 'Produktów' },
        { value: '50+', label: 'Marek' },
        { value: '24/7', label: 'Wsparcie' }
      ],
      layout: 'left'
    }
  }
]

async function initCMSContent() {
  const client = await pool.connect()
  
  try {
    console.log('Inicjalizacja domyślnych elementów CMS...')
    
    for (const item of defaultCMSContent) {
      // Sprawdź czy element już istnieje
      const existing = await client.query(
        'SELECT id FROM cms_content WHERE key = $1 AND locale = $2',
        [item.key, item.locale]
      )
      
      if (existing.rows.length > 0) {
        // Aktualizuj istniejący
        await client.query(
          `UPDATE cms_content 
           SET name = $1, description = $2, content = $3, type = $4, updated_at = NOW()
           WHERE key = $5 AND locale = $6`,
          [item.name, item.description, JSON.stringify(item.content), item.type, item.key, item.locale]
        )
        console.log(`✓ Zaktualizowano: ${item.key} (${item.locale})`)
      } else {
        // Utwórz nowy
        await client.query(
          `INSERT INTO cms_content (key, type, name, description, content, is_active, sort_order, locale)
           VALUES ($1, $2, $3, $4, $5, true, 0, $6)`,
          [item.key, item.type, item.name, item.description, JSON.stringify(item.content), item.locale]
        )
        console.log(`✓ Utworzono: ${item.key} (${item.locale})`)
      }
    }
    
    console.log('\n✅ Inicjalizacja CMS zakończona!')
    
  } catch (error) {
    console.error('Błąd podczas inicjalizacji CMS:', error)
  } finally {
    client.release()
    await pool.end()
  }
}

initCMSContent()
