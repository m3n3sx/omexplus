#!/usr/bin/env node

const { Client } = require('pg')

const pages = [
  {
    id: 'page_regulamin',
    slug: 'regulamin',
    title: 'Regulamin sklepu',
    meta_description: 'Regulamin sklepu internetowego OMEX - zasady korzystania z serwisu',
    content: JSON.stringify({
      sections: [
        {
          type: 'hero',
          title: 'Regulamin sklepu',
          subtitle: 'Zasady korzystania z serwisu OMEX'
        },
        {
          type: 'text',
          content: '<h2>§1 Postanowienia ogólne</h2><p>Niniejszy Regulamin określa zasady korzystania ze sklepu internetowego OMEX dostępnego pod adresem ooxo.pl</p><h2>§2 Definicje</h2><p>Sklep - sklep internetowy OMEX prowadzony przez OMEX Sp. z o.o.</p><p>Klient - osoba fizyczna, osoba prawna lub jednostka organizacyjna nieposiadająca osobowości prawnej.</p><h2>§3 Zasady składania zamówień</h2><p>Zamówienia można składać 24 godziny na dobę przez cały rok.</p>'
        }
      ]
    }),
    template: 'default',
    status: 'published',
    locale: 'pl',
    published_at: new Date(),
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'page_polityka_prywatnosci',
    slug: 'polityka-prywatnosci',
    title: 'Polityka prywatności',
    meta_description: 'Polityka prywatności OMEX - jak chronimy Twoje dane osobowe',
    content: JSON.stringify({
      sections: [
        {
          type: 'hero',
          title: 'Polityka prywatności',
          subtitle: 'Dowiedz się jak chronimy Twoje dane osobowe'
        },
        {
          type: 'text',
          content: '<h2>1. Informacje ogólne</h2><p>Administratorem danych osobowych jest OMEX Sp. z o.o. z siedzibą w Warszawie.</p><h2>2. Zakres zbieranych danych</h2><p>Zbieramy dane niezbędne do realizacji zamówień: imię, nazwisko, adres, email, telefon.</p><h2>3. Cel przetwarzania danych</h2><p>Dane są przetwarzane w celu realizacji zamówień, obsługi klienta i marketingu (za zgodą).</p><h2>4. Prawa użytkownika</h2><p>Masz prawo do dostępu, poprawiania, usunięcia swoich danych oraz wniesienia sprzeciwu wobec ich przetwarzania.</p>'
        }
      ]
    }),
    template: 'default',
    status: 'published',
    locale: 'pl',
    published_at: new Date(),
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'page_zwroty',
    slug: 'zwroty',
    title: 'Zwroty i reklamacje',
    meta_description: 'Zasady zwrotów i reklamacji w sklepie OMEX',
    content: JSON.stringify({
      sections: [
        {
          type: 'hero',
          title: 'Zwroty i reklamacje',
          subtitle: 'Informacje o zwrotach produktów i procedurze reklamacyjnej'
        },
        {
          type: 'text',
          content: '<h2>Prawo do odstąpienia od umowy</h2><p>Masz prawo odstąpić od umowy w terminie 14 dni bez podania przyczyny.</p><h2>Jak zwrócić produkt?</h2><ol><li>Zaloguj się na swoje konto</li><li>Przejdź do "Moje zamówienia"</li><li>Wybierz zamówienie i kliknij "Zwróć produkt"</li><li>Wypełnij formularz zwrotu</li></ol><h2>Reklamacje</h2><p>Produkty objęte są gwarancją producenta. W przypadku wady produktu skontaktuj się z naszym działem obsługi klienta.</p><h2>Zwrot pieniędzy</h2><p>Zwrot następuje w ciągu 14 dni od otrzymania zwróconego produktu na konto, z którego dokonano płatności.</p>'
        }
      ]
    }),
    template: 'default',
    status: 'published',
    locale: 'pl',
    published_at: new Date(),
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'page_dostawa',
    slug: 'dostawa',
    title: 'Dostawa i płatność',
    meta_description: 'Informacje o dostawie i formach płatności w OMEX',
    content: JSON.stringify({
      sections: [
        {
          type: 'hero',
          title: 'Dostawa i płatność',
          subtitle: 'Wszystko o dostawie i metodach płatności'
        },
        {
          type: 'text',
          content: '<h2>Czas dostawy</h2><p>Standardowa dostawa: 1-3 dni robocze</p><p>Dostawa ekspresowa 24h: dostępna za dopłatą</p><h2>Koszty dostawy</h2><ul><li>Kurier InPost/DPD: od 15 PLN</li><li>Paczkomat InPost: 12 PLN</li><li>Odbiór osobisty: GRATIS</li><li>Darmowa dostawa przy zamówieniach powyżej 500 PLN</li></ul><h2>Formy płatności</h2><ul><li>Karta płatnicza (Visa, Mastercard)</li><li>Przelew bankowy</li><li>BLIK</li><li>Płatność przy odbiorze (pobranie)</li><li>Płatność odroczona dla firm (po weryfikacji)</li></ul>'
        }
      ]
    }),
    template: 'default',
    status: 'published',
    locale: 'pl',
    published_at: new Date(),
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'page_warunki_sprzedazy',
    slug: 'warunki-sprzedazy',
    title: 'Warunki sprzedaży',
    meta_description: 'Warunki sprzedaży produktów w sklepie OMEX',
    content: JSON.stringify({
      sections: [
        {
          type: 'hero',
          title: 'Warunki sprzedaży',
          subtitle: 'Ogólne warunki sprzedaży w sklepie OMEX'
        },
        {
          type: 'text',
          content: '<h2>1. Ceny</h2><p>Wszystkie ceny podane są w PLN i zawierają podatek VAT.</p><p>Ceny mogą ulec zmianie, obowiązuje cena z momentu złożenia zamówienia.</p><h2>2. Dostępność produktów</h2><p>Informacje o dostępności są aktualizowane na bieżąco.</p><p>W przypadku braku produktu na magazynie, skontaktujemy się z Tobą w celu ustalenia dalszego postępowania.</p><h2>3. Realizacja zamówienia</h2><p>Zamówienia złożone przed godz. 14:00 są wysyłane tego samego dnia.</p><p>Czas realizacji: 1-3 dni robocze.</p><h2>4. Gwarancja</h2><p>Wszystkie produkty objęte są gwarancją producenta (12-24 miesiące).</p><p>Szczegóły gwarancji znajdują się w opisie każdego produktu.</p>'
        }
      ]
    }),
    template: 'default',
    status: 'published',
    locale: 'pl',
    published_at: new Date(),
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'page_kontakt',
    slug: 'kontakt',
    title: 'Kontakt',
    meta_description: 'Skontaktuj się z OMEX - jesteśmy tutaj, aby pomóc',
    content: JSON.stringify({
      sections: [
        {
          type: 'hero',
          title: 'Skontaktuj się z nami',
          subtitle: 'Jesteśmy tutaj, aby pomóc. Skontaktuj się z nami w dowolny sposób.'
        },
        {
          type: 'contact_info',
          address: 'OMEX Sp. z o.o.\nul. Przemysłowa 15\n00-001 Warszawa, Polska',
          phone: '+48 22 123 45 67\n+48 600 123 456',
          email: 'kontakt@omex.pl\nsprzedaz@omex.pl',
          hours: 'Pon - Pt: 8:00 - 18:00\nSob: 9:00 - 14:00\nNiedz: Zamknięte'
        }
      ]
    }),
    template: 'contact',
    status: 'published',
    locale: 'pl',
    published_at: new Date(),
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'page_o_nas',
    slug: 'o-nas',
    title: 'O nas',
    meta_description: 'Poznaj historię OMEX - 18 lat doświadczenia w branży części zamiennych',
    content: JSON.stringify({
      sections: [
        {
          type: 'hero',
          title: 'O OMEX',
          subtitle: 'Od 18 lat jesteśmy liderem w dostarczaniu wysokiej jakości części zamiennych do maszyn budowlanych.'
        },
        {
          type: 'stats',
          items: [
            { icon: '📅', value: '18+', label: 'Lat doświadczenia' },
            { icon: '🏢', value: '500+', label: 'Zadowolonych klientów' },
            { icon: '📦', value: '10,000+', label: 'Części w magazynie' },
            { icon: '🚚', value: '24h', label: 'Szybka dostawa' }
          ]
        },
        {
          type: 'story',
          title: 'Nasza Historia',
          content: 'OMEX powstał w 2006 roku z pasji do maszyn budowlanych i chęci zapewnienia polskim firmom dostępu do najwyższej jakości części zamiennych.'
        }
      ]
    }),
    template: 'default',
    status: 'published',
    locale: 'pl',
    published_at: new Date(),
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'page_faq',
    slug: 'faq',
    title: 'FAQ - Często zadawane pytania',
    meta_description: 'Znajdź odpowiedzi na najczęściej zadawane pytania o OMEX',
    content: JSON.stringify({
      sections: [
        {
          type: 'hero',
          title: 'Często Zadawane Pytania',
          subtitle: 'Znajdź odpowiedzi na najczęściej zadawane pytania'
        },
        {
          type: 'faq',
          categories: [
            {
              id: 'shipping',
              label: 'Dostawa',
              questions: [
                {
                  question: 'Jak długo trwa dostawa?',
                  answer: 'Standardowa dostawa trwa 1-3 dni robocze.'
                },
                {
                  question: 'Jakie są koszty dostawy?',
                  answer: 'Koszt dostawy zależy od wagi i rozmiaru przesyłki. Standardowa dostawa kurierem kosztuje od 15 PLN.'
                }
              ]
            },
            {
              id: 'payment',
              label: 'Płatności',
              questions: [
                {
                  question: 'Jakie formy płatności akceptujecie?',
                  answer: 'Akceptujemy płatności kartą kredytową/debetową, przelewy bankowe, BLIK.'
                }
              ]
            }
          ]
        }
      ]
    }),
    template: 'default',
    status: 'published',
    locale: 'pl',
    published_at: new Date(),
    created_at: new Date(),
    updated_at: new Date()
  }
]

async function importPages() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgres://medusa_user:medusa_password@localhost/medusa_db'
  })

  try {
    await client.connect()
    console.log('✅ Connected to database')

    // Check if table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'cms_page'
      );
    `)

    if (!tableCheck.rows[0].exists) {
      console.log('❌ Table cms_page does not exist. Run migrations first.')
      process.exit(1)
    }

    console.log('✅ Table cms_page exists')

    // Clear existing pages
    await client.query('DELETE FROM cms_page WHERE slug IN ($1, $2, $3, $4, $5, $6, $7, $8)', 
      ['kontakt', 'o-nas', 'faq', 'regulamin', 'polityka-prywatnosci', 'zwroty', 'dostawa', 'warunki-sprzedazy'])
    console.log('🗑️  Cleared existing pages')

    // Insert pages
    for (const page of pages) {
      await client.query(`
        INSERT INTO cms_page (
          id, slug, title, meta_description, content, 
          template, status, locale, published_at, 
          created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `, [
        page.id,
        page.slug,
        page.title,
        page.meta_description,
        page.content,
        page.template,
        page.status,
        page.locale,
        page.published_at,
        page.created_at,
        page.updated_at
      ])
      console.log(`✅ Imported page: ${page.title} (/${page.slug})`)
    }

    console.log('\n🎉 Successfully imported all CMS pages!')
    console.log('\nPages available:')
    pages.forEach(page => {
      console.log(`  - ${page.title}: /${page.slug}`)
    })

  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

importPages()
