// Szybki test połączenia ze Stripe
require('dotenv').config();
const Stripe = require('stripe');

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ Brak STRIPE_SECRET_KEY w .env');
  process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

console.log('🧪 Testowanie połączenia ze Stripe...\n');

async function testStripe() {
  try {
    // Test 1: Utworzenie PaymentIntent
    console.log('1️⃣ Tworzenie PaymentIntent...');
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 9999, // $99.99
      currency: 'usd',
      metadata: {
        test: 'true',
        cart_id: 'test_cart_123',
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });
    
    console.log('✅ PaymentIntent utworzony!');
    console.log('   ID:', paymentIntent.id);
    console.log('   Kwota:', paymentIntent.amount / 100, paymentIntent.currency.toUpperCase());
    console.log('   Status:', paymentIntent.status);
    
    // Test 2: Pobranie PaymentIntent
    console.log('\n2️⃣ Pobieranie PaymentIntent...');
    const retrieved = await stripe.paymentIntents.retrieve(paymentIntent.id);
    console.log('✅ PaymentIntent pobrany!');
    console.log('   ID:', retrieved.id);
    console.log('   Status:', retrieved.status);
    
    // Test 3: Anulowanie PaymentIntent
    console.log('\n3️⃣ Anulowanie PaymentIntent...');
    const canceled = await stripe.paymentIntents.cancel(paymentIntent.id);
    console.log('✅ PaymentIntent anulowany!');
    console.log('   Status:', canceled.status);
    
    console.log('\n╔══════════════════════════════════════════════════════╗');
    console.log('║  ✅ WSZYSTKIE TESTY PRZESZŁY POMYŚLNIE!             ║');
    console.log('╚══════════════════════════════════════════════════════╝');
    console.log('\n🎉 Stripe działa poprawnie!');
    console.log('\n📝 Następne kroki:');
    console.log('   1. Uruchom backend: npm run dev');
    console.log('   2. Uruchom frontend: cd storefront && npm run dev');
    console.log('   3. Otwórz: http://localhost:3000/checkout/payment');
    console.log('   4. Użyj karty testowej: 4242 4242 4242 4242');
    
  } catch (error) {
    console.error('\n❌ Błąd:', error.message);
    console.error('\n💡 Sprawdź:');
    console.error('   - Czy klucz STRIPE_SECRET_KEY jest poprawny w .env');
    console.error('   - Czy masz połączenie z internetem');
    process.exit(1);
  }
}

testStripe();
