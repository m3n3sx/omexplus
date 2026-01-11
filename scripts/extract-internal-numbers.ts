/**
 * Skrypt wyodrębniający numery wewnętrzne z nazw produktów
 * Przenosi numery z początku nazwy do metadata.internal_number
 */

import { Client } from "pg"

const DATABASE_URL = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost/medusa_db"

// Wzorce numerów na początku nazwy:
// "020560A/ 20/950730A Nazwa produktu" -> internal: "020560A/ 20/950730A", title: "Nazwa produktu"
// "167187 Nazwa produktu" -> internal: "167187", title: "Nazwa produktu"
// "G65 Nazwa produktu" -> internal: "G65", title: "Nazwa produktu"
// "010350A Nazwa produktu" -> internal: "010350A", title: "Nazwa produktu"

function extractInternalNumber(title: string): { internalNumber: string | null, cleanTitle: string } {
  // Wzorce numerów:
  // "895854 Uszczelka..." -> "895854"
  // "828/00207 Oring..." -> "828/00207"
  // "G65 Tuleja..." -> "G65"
  // "1208/0031 Tulejka..." -> "1208/0031"
  // "20/915901 Uszczelnienie..." -> "20/915901"
  // "6194574M91 Siłownik..." -> "6194574M91"
  // "010350A Wałek..." -> "010350A"
  
  // Wzorzec: numer (cyfry, litery, /, -) na początku, potem spacja i nazwa zaczynająca się od litery
  const match = title.match(/^([A-Z0-9][A-Z0-9\/\-]*[A-Z0-9])\s+([A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż].+)$/u)
  
  if (match) {
    const potentialNumber = match[1]
    const potentialTitle = match[2]
    
    // Sprawdź czy to rzeczywiście numer (nie samo słowo)
    // Numer powinien zawierać cyfrę lub być krótki (max 15 znaków)
    if (/\d/.test(potentialNumber) || potentialNumber.length <= 6) {
      return {
        internalNumber: potentialNumber,
        cleanTitle: potentialTitle
      }
    }
  }
  
  // Wzorzec dla samych cyfr na początku
  const numericMatch = title.match(/^(\d+)\s+(.+)$/)
  if (numericMatch) {
    return {
      internalNumber: numericMatch[1],
      cleanTitle: numericMatch[2]
    }
  }
  
  return { internalNumber: null, cleanTitle: title }
}

async function extractInternalNumbers() {
  console.log("🔧 Wyodrębniam numery wewnętrzne z nazw produktów...\n")

  const client = new Client({ connectionString: DATABASE_URL })
  await client.connect()

  // Pobierz wszystkie produkty
  const result = await client.query(`
    SELECT id, title, metadata FROM product WHERE deleted_at IS NULL
  `)

  console.log(`Znaleziono ${result.rows.length} produktów\n`)

  let updated = 0
  let skipped = 0

  for (const row of result.rows) {
    const { internalNumber, cleanTitle } = extractInternalNumber(row.title)
    
    if (internalNumber && cleanTitle !== row.title) {
      // Aktualizuj produkt
      const metadata = row.metadata || {}
      metadata.internal_number = internalNumber
      
      // Zachowaj istniejące part_number jeśli jest
      if (!metadata.part_number) {
        metadata.part_number = internalNumber
      }

      await client.query(`
        UPDATE product 
        SET title = $1, metadata = $2, updated_at = NOW()
        WHERE id = $3
      `, [cleanTitle, JSON.stringify(metadata), row.id])

      updated++
      
      if (updated <= 10) {
        console.log(`✅ "${row.title.substring(0, 50)}..."`)
        console.log(`   → Numer: "${internalNumber}"`)
        console.log(`   → Nazwa: "${cleanTitle.substring(0, 50)}..."\n`)
      } else if (updated % 100 === 0) {
        console.log(`   Zaktualizowano ${updated} produktów...`)
      }
    } else {
      skipped++
    }
  }

  await client.end()

  console.log(`\n🏁 Zakończono!`)
  console.log(`   ✅ Zaktualizowano: ${updated} produktów`)
  console.log(`   ⏭️ Pominięto: ${skipped} produktów (brak numeru na początku)`)
}

extractInternalNumbers().catch(console.error)
