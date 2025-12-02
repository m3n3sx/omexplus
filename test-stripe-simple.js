const Stripe = require('stripe');

// Bezpośrednie użycie klucza do testu
const stripe = new Stripe('sk_test_51SZb2ZBEhIjq58F93uJtuXvBCZ5zpTTFfz0xZ3yGceR8DKeyoxIBHDqsqbBqR3vpmrKXW3n3KmbHaJdBoUAYrVEi00ASrK8U8f', {
  apiVersion: '2023-10-16',
});

console.log('🧪 Testowanie Stripe API...\n');

async function test() {
  try {
    console.log('Tworzenie PaymentIntent...');
    const pi = await stripe.paymentIntents.create({
      amount: 9999,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    });
    
    console.log('✅ SUKCES!');
    console.log('PaymentIntent ID:', pi.id);
    console.log('Status:', pi.status);
    console.log('Kwota:', pi.amount / 100, 'USD');
    
    // Anuluj
    await stripe.paymentIntents.cancel(pi.id);
    console.log('✅ PaymentIntent anulowany');
    
    console.log('\n╔══════════════════════════════════════════╗');
    console.log('║  ✅ STRIPE DZIAŁA POPRAWNIE!            ║');
    console.log('╚══════════════════════════════════════════╝');
    console.log('\n🚀 Możesz uruchomić aplikację:');
    console.log('   npm run dev');
    
  } catch (err) {
    console.error('❌ Błąd:', err.message);
  }
}

test();
