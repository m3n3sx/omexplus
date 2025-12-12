const { Client } = require('pg');

const DATABASE_URL = 'postgres://postgres:postgres@localhost/medusa_db';

const b2bCompanies = [
  {
    company_name: 'BudMech Sp. z o.o.',
    nip: '5252525252',
    email: 'zamowienia@budmech.pl',
    first_name: 'Jan',
    last_name: 'Kowalski',
    phone: '+48 22 123 45 67',
    address: 'ul. Budowlana 15',
    city: 'Warszawa',
    postal_code: '00-001',
    credit_limit: 50000000, // 500 000 PLN
    payment_terms: 'NET30',
    discount_percentage: 15
  },
  {
    company_name: 'TechMaszyny S.A.',
    nip: '6363636363',
    email: 'biuro@techmaszyny.pl',
    first_name: 'Anna',
    last_name: 'Nowak',
    phone: '+48 61 234 56 78',
    address: 'ul. Przemysłowa 42',
    city: 'Poznań',
    postal_code: '60-001',
    credit_limit: 100000000, // 1 000 000 PLN
    payment_terms: 'NET45',
    discount_percentage: 20
  },
  {
    company_name: 'Hydraulika Plus Sp. z o.o.',
    nip: '7474747474',
    email: 'handel@hydraulikaplus.pl',
    first_name: 'Piotr',
    last_name: 'Wiśniewski',
    phone: '+48 12 345 67 89',
    address: 'ul. Hydrauliczna 8',
    city: 'Kraków',
    postal_code: '30-001',
    credit_limit: 30000000, // 300 000 PLN
    payment_terms: 'NET30',
    discount_percentage: 12
  },
  {
    company_name: 'AutoParts Dystrybucja',
    nip: '8585858585',
    email: 'zamowienia@autoparts.pl',
    first_name: 'Marek',
    last_name: 'Lewandowski',
    phone: '+48 71 456 78 90',
    address: 'ul. Motoryzacyjna 23',
    city: 'Wrocław',
    postal_code: '50-001',
    credit_limit: 75000000, // 750 000 PLN
    payment_terms: 'NET60',
    discount_percentage: 18
  },
  {
    company_name: 'Maszyny Budowlane Sp. j.',
    nip: '9696969696',
    email: 'biuro@maszynybudowlane.pl',
    first_name: 'Katarzyna',
    last_name: 'Kamińska',
    phone: '+48 58 567 89 01',
    address: 'ul. Budowlanych 56',
    city: 'Gdańsk',
    postal_code: '80-001',
    credit_limit: 60000000, // 600 000 PLN
    payment_terms: 'NET45',
    discount_percentage: 16
  },
  {
    company_name: 'Przemysł-Tech S.A.',
    nip: '1212121212',
    email: 'handel@przemysltech.pl',
    first_name: 'Tomasz',
    last_name: 'Zieliński',
    phone: '+48 32 678 90 12',
    address: 'ul. Przemysłowa 89',
    city: 'Katowice',
    postal_code: '40-001',
    credit_limit: 120000000, // 1 200 000 PLN
    payment_terms: 'NET60',
    discount_percentage: 22
  },
  {
    company_name: 'Serwis Maszyn Sp. z o.o.',
    nip: '2323232323',
    email: 'zamowienia@serwismaszyn.pl',
    first_name: 'Magdalena',
    last_name: 'Szymańska',
    phone: '+48 42 789 01 23',
    address: 'ul. Serwisowa 34',
    city: 'Łódź',
    postal_code: '90-001',
    credit_limit: 40000000, // 400 000 PLN
    payment_terms: 'NET30',
    discount_percentage: 14
  },
  {
    company_name: 'Hurtownia Części Sp. z o.o.',
    nip: '3434343434',
    email: 'biuro@hurtowniaczesci.pl',
    first_name: 'Andrzej',
    last_name: 'Woźniak',
    phone: '+48 81 890 12 34',
    address: 'ul. Hurtowa 67',
    city: 'Lublin',
    postal_code: '20-001',
    credit_limit: 55000000, // 550 000 PLN
    payment_terms: 'NET45',
    discount_percentage: 17
  },
  {
    company_name: 'Logistyka Maszyn S.A.',
    nip: '4545454545',
    email: 'zamowienia@logistykamaszyn.pl',
    first_name: 'Joanna',
    last_name: 'Dąbrowska',
    phone: '+48 91 901 23 45',
    address: 'ul. Logistyczna 12',
    city: 'Szczecin',
    postal_code: '70-001',
    credit_limit: 85000000, // 850 000 PLN
    payment_terms: 'NET60',
    discount_percentage: 19
  },
  {
    company_name: 'Części Przemysłowe Sp. j.',
    nip: '5656565656',
    email: 'handel@czesciprzem.pl',
    first_name: 'Krzysztof',
    last_name: 'Kozłowski',
    phone: '+48 85 012 34 56',
    address: 'ul. Przemysłowa 90',
    city: 'Białystok',
    postal_code: '15-001',
    credit_limit: 45000000, // 450 000 PLN
    payment_terms: 'NET30',
    discount_percentage: 13
  }
];

async function main() {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();

  console.log('\n🏢 Dodawanie klientów B2B...\n');

  try {
    for (const company of b2bCompanies) {
      // Wygeneruj ID
      const customerId = `cus_b2b_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Utwórz klienta
      const customerResult = await client.query(`
        INSERT INTO customer (
          id,
          email,
          first_name,
          last_name,
          phone,
          has_account,
          metadata,
          created_at,
          updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
        RETURNING id
      `, [
        customerId,
        company.email,
        company.first_name,
        company.last_name,
        company.phone,
        true,
        JSON.stringify({
          is_b2b: true,
          company_name: company.company_name,
          nip: company.nip,
          credit_limit: company.credit_limit,
          payment_terms: company.payment_terms,
          discount_percentage: company.discount_percentage
        })
      ]);

      // Wygeneruj ID adresu
      const addressId = `addr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Dodaj adres
      await client.query(`
        INSERT INTO customer_address (
          id,
          customer_id,
          company,
          first_name,
          last_name,
          address_1,
          city,
          postal_code,
          country_code,
          phone,
          metadata,
          created_at,
          updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
      `, [
        addressId,
        customerId,
        company.company_name,
        company.first_name,
        company.last_name,
        company.address,
        company.city,
        company.postal_code,
        'pl',
        company.phone,
        JSON.stringify({ is_billing: true, is_shipping: true })
      ]);

      console.log(`✅ ${company.company_name} - ${company.email}`);
      console.log(`   NIP: ${company.nip}, Limit: ${(company.credit_limit / 100).toLocaleString('pl-PL')} PLN, Rabat: ${company.discount_percentage}%`);
    }

    console.log(`\n✅ Dodano ${b2bCompanies.length} klientów B2B!\n`);

    // Pokaż statystyki
    const stats = await client.query(`
      SELECT 
        COUNT(*) as total_b2b,
        SUM((metadata->>'credit_limit')::numeric) as total_credit_limit,
        AVG((metadata->>'discount_percentage')::numeric) as avg_discount
      FROM customer
      WHERE metadata->>'is_b2b' = 'true'
    `);

    const stat = stats.rows[0];
    console.log('📊 Statystyki B2B:');
    console.log(`   Klienci B2B: ${stat.total_b2b}`);
    console.log(`   Łączny limit kredytowy: ${(stat.total_credit_limit / 100).toLocaleString('pl-PL')} PLN`);
    console.log(`   Średni rabat: ${parseFloat(stat.avg_discount).toFixed(1)}%`);
    console.log('');

  } catch (error) {
    console.error('❌ Błąd:', error.message);
  } finally {
    await client.end();
  }
}

main();
