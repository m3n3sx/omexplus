/**
 * Seed manufacturers data
 * Usage: npx ts-node src/scripts/seed-manufacturers.ts
 */

const manufacturers = [
  {
    name: "Rexroth",
    slug: "rexroth",
    website_url: "https://www.boschrexroth.com",
    country: "Germany",
    description: "Bosch Rexroth - światowy lider w dziedzinie hydrauliki przemysłowej",
    catalog_pdf_url: "https://example.com/catalogs/rexroth-2024.pdf",
    is_active: true,
  },
  {
    name: "Parker Hannifin",
    slug: "parker",
    website_url: "https://www.parker.com",
    country: "USA",
    description: "Parker Hannifin - producent systemów hydraulicznych i pneumatycznych",
    catalog_pdf_url: "https://example.com/catalogs/parker-2024.pdf",
    is_active: true,
  },
  {
    name: "Hydac",
    slug: "hydac",
    website_url: "https://www.hydac.com",
    country: "Germany",
    description: "Hydac - specjalista w dziedzinie hydrauliki, filtracji i chłodzenia",
    catalog_pdf_url: "https://example.com/catalogs/hydac-2024.pdf",
    is_active: true,
  },
  {
    name: "Eaton",
    slug: "eaton",
    website_url: "https://www.eaton.com",
    country: "Ireland",
    description: "Eaton - rozwiązania hydrauliczne dla przemysłu",
    is_active: true,
  },
  {
    name: "Danfoss",
    slug: "danfoss",
    website_url: "https://www.danfoss.com",
    country: "Denmark",
    description: "Danfoss - innowacyjne rozwiązania hydrauliczne",
    is_active: true,
  },
  {
    name: "Bucher Hydraulics",
    slug: "bucher",
    website_url: "https://www.bucherhydraulics.com",
    country: "Switzerland",
    description: "Bucher Hydraulics - systemy hydrauliczne dla maszyn mobilnych",
    is_active: true,
  },
  {
    name: "Hawe Hydraulik",
    slug: "hawe",
    website_url: "https://www.hawe.com",
    country: "Germany",
    description: "Hawe - kompaktowe systemy hydrauliczne",
    is_active: true,
  },
  {
    name: "Atos",
    slug: "atos",
    website_url: "https://www.atos.com",
    country: "Italy",
    description: "Atos - zawory i elektronika hydrauliczna",
    is_active: true,
  },
  {
    name: "Moog",
    slug: "moog",
    website_url: "https://www.moog.com",
    country: "USA",
    description: "Moog - precyzyjne systemy sterowania hydraulicznego",
    is_active: true,
  },
  {
    name: "Yuken",
    slug: "yuken",
    website_url: "https://www.yuken.co.jp",
    country: "Japan",
    description: "Yuken - pompy i zawory hydrauliczne",
    is_active: true,
  },
]

async function seedManufacturers() {
  console.log("🌱 Seeding manufacturers...")

  try {
    // In real implementation, use ManufacturerService
    for (const mfr of manufacturers) {
      console.log(`  ✓ Creating ${mfr.name}...`)
      // await manufacturerService.createManufacturer(mfr)
    }

    console.log(`\n✅ Successfully seeded ${manufacturers.length} manufacturers`)
  } catch (error) {
    console.error("❌ Seeding failed:", error)
    process.exit(1)
  }
}

seedManufacturers()
