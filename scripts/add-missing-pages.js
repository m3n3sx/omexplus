#!/usr/bin/env node

const { Client } = require('pg')

const additionalPages = [
  {
    id: 'page_about',
    slug: 'about',
    title: 'About Us',
    meta_description: 'Learn more about OMEX - 18 years of experience in construction machinery parts',
    content: JSON.stringify({
      sections: [
        {
          type: 'hero',
          title: 'About OMEX',
          subtitle: 'For 18 years, we have been a leader in providing high-quality spare parts for construction machinery.'
        },
        {
          type: 'stats',
          items: [
            { icon: '📅', value: '18+', label: 'Years of experience' },
            { icon: '🏢', value: '500+', label: 'Satisfied customers' },
            { icon: '📦', value: '10,000+', label: 'Parts in stock' },
            { icon: '🚚', value: '24h', label: 'Fast delivery' }
          ]
        },
        {
          type: 'story',
          title: 'Our Story',
          content: 'OMEX was founded in 2006 with a passion for construction machinery and a desire to provide Polish companies with access to the highest quality spare parts.'
        }
      ]
    }),
    template: 'default',
    status: 'published',
    locale: 'en',
    published_at: new Date(),
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'page_sledzenie_przesylki',
    slug: 'sledzenie-przesylki',
    title: 'Śledzenie przesyłki',
    meta_description: 'Śledź swoją przesyłkę z OMEX - sprawdź status zamówienia',
    content: JSON.stringify({
      sections: [
        {
          type: 'hero',
          title: 'Śledzenie przesyłki',
          subtitle: 'Sprawdź status swojego zamówienia'
        },
        {
          type: 'tracking_form',
          description: 'Wpisz numer zamówienia lub numer przesyłki, aby sprawdzić jej status.'
        },
        {
          type: 'text',
          content: '<h2>Jak śledzić przesyłkę?</h2><p>Po wysłaniu zamówienia otrzymasz email z numerem śledzenia przesyłki.</p><p>Możesz również śledzić status zamówienia w swoim koncie w sekcji "Moje zamówienia".</p><h2>Przewoźnicy</h2><ul><li><strong>InPost</strong> - śledzenie na inpost.pl</li><li><strong>DPD</strong> - śledzenie na dpd.com.pl</li><li><strong>DHL</strong> - śledzenie na dhl.com.pl</li></ul>'
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

async function addPages() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgres://medusa_user:medusa_password@localhost/medusa_db'
  })

  try {
    await client.connect()
    console.log('✅ Connected to database')

    // Check existing pages
    const existing = await client.query('SELECT slug FROM cms_page')
    console.log(`📊 Current pages in database: ${existing.rows.length}`)
    existing.rows.forEach(row => console.log(`   - ${row.slug}`))

    // Add new pages
    for (const page of additionalPages) {
      // Check if page already exists
      const check = await client.query('SELECT id FROM cms_page WHERE slug = $1', [page.slug])
      
      if (check.rows.length > 0) {
        console.log(`⚠️  Page ${page.slug} already exists, skipping...`)
        continue
      }

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
      console.log(`✅ Added page: ${page.title} (/${page.slug})`)
    }

    // Show final count
    const final = await client.query('SELECT COUNT(*) as total FROM cms_page')
    console.log(`\n🎉 Total pages in database: ${final.rows[0].total}`)

  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

addPages()
