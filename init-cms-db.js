// Standalone script do inicjalizacji CMS
const { Pool } = require('pg')

// Odczytaj DATABASE_URL z .env jeśli istnieje
require('dotenv').config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres@localhost/medusa-my-medusa-store'
})

async function initCMS() {
  const client = await pool.connect()
  
  try {
    console.log('🚀 Inicjalizacja CMS...')
    
    // Tworzenie tabel
    await client.query(`
      CREATE TABLE IF NOT EXISTS cms_content (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
        key VARCHAR UNIQUE NOT NULL,
        type VARCHAR NOT NULL,
        name VARCHAR NOT NULL,
        description TEXT,
        content JSONB NOT NULL DEFAULT '{}',
        is_active BOOLEAN DEFAULT true,
        sort_order INTEGER DEFAULT 0,
        locale VARCHAR DEFAULT 'pl',
        metadata JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS cms_menu (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
        key VARCHAR UNIQUE NOT NULL,
        name VARCHAR NOT NULL,
        position VARCHAR NOT NULL,
        is_active BOOLEAN DEFAULT true,
        locale VARCHAR DEFAULT 'pl',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS cms_menu_item (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
        menu_id VARCHAR NOT NULL,
        parent_id VARCHAR,
        label VARCHAR NOT NULL,
        url VARCHAR NOT NULL,
        link_type VARCHAR DEFAULT 'internal',
        icon VARCHAR,
        description TEXT,
        open_in_new_tab BOOLEAN DEFAULT false,
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        css_classes VARCHAR,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS cms_page (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
        slug VARCHAR UNIQUE NOT NULL,
        title VARCHAR NOT NULL,
        meta_description TEXT,
        meta_keywords TEXT,
        content JSONB NOT NULL DEFAULT '{}',
        template VARCHAR DEFAULT 'default',
        status VARCHAR DEFAULT 'draft',
        locale VARCHAR DEFAULT 'pl',
        published_at TIMESTAMP,
        seo_title VARCHAR,
        seo_image VARCHAR,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)
    
    console.log('✅ Tabele CMS utworzone')
    
    // Dodaj przykładowe dane
    await client.query(`
      INSERT INTO cms_content (key, type, name, description, content, locale)
      VALUES (
        'main-header',
        'header',
        'Główny Header',
        'Header strony głównej',
        '{"logo": "", "showSearch": true, "showCart": true, "showUser": true}',
        'pl'
      )
      ON CONFLICT (key) DO NOTHING
    `)
    
    await client.query(`
      INSERT INTO cms_content (key, type, name, description, content, locale)
      VALUES (
        'main-footer',
        'footer',
        'Główny Footer',
        'Footer strony',
        '{"copyright": "© 2024 OMEX. Wszystkie prawa zastrzeżone.", "columns": []}',
        'pl'
      )
      ON CONFLICT (key) DO NOTHING
    `)
    
    await client.query(`
      INSERT INTO cms_content (key, type, name, description, content, locale)
      VALUES (
        'home-hero',
        'hero',
        'Hero Strony Głównej',
        'Główna sekcja hero',
        '{"title": "Części do Maszyn Budowlanych", "subtitle": "Profesjonalny sklep B2B • 18 lat doświadczenia", "backgroundImage": ""}',
        'pl'
      )
      ON CONFLICT (key) DO NOTHING
    `)
    
    // Main Menu
    const menuResult = await client.query(`
      INSERT INTO cms_menu (key, name, position, locale)
      VALUES ('main-menu', 'Menu Główne', 'header-secondary', 'pl')
      ON CONFLICT (key) DO UPDATE SET name = EXCLUDED.name
      RETURNING id
    `)
    
    const menuId = menuResult.rows[0]?.id
    
    if (menuId) {
      const menuItems = [
        { label: 'Strona główna', url: '/pl', sort_order: 1 },
        { label: 'Produkty', url: '/pl/products', sort_order: 2 },
        { label: 'O nas', url: '/pl/o-nas', sort_order: 3 },
        { label: 'Kontakt', url: '/pl/kontakt', sort_order: 4 },
        { label: 'FAQ', url: '/pl/faq', sort_order: 5 },
      ]
      
      for (const item of menuItems) {
        await client.query(`
          INSERT INTO cms_menu_item (menu_id, label, url, sort_order)
          VALUES ($1, $2, $3, $4)
        `, [menuId, item.label, item.url, item.sort_order])
      }
    }
    
    console.log('✅ Przykładowe dane dodane')
    console.log('🎉 CMS zainicjalizowany!')
    
  } catch (error) {
    console.error('❌ Błąd:', error)
    throw error
  } finally {
    client.release()
    await pool.end()
  }
}

initCMS().catch(console.error)
