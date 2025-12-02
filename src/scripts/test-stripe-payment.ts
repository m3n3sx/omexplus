/**
 * Test script for Stripe payment integration
 * Run: npx ts-node src/scripts/test-stripe-payment.ts
 */

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

async function testPaymentFlow() {
  console.log('🧪 Testing Stripe Payment Integration\n');

  try {
    // Test 1: Create PaymentIntent
    console.log('1️⃣ Creating PaymentIntent...');
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 9999, // $99.99
      currency: 'usd',
      metadata: {
        cart_id: 'test_cart_123',
        test: 'true',
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });
    console.log('✅ PaymentIntent created:', paymentIntent.id);
    console.log('   Client Secret:', paymentIntent.client_secret?.substring(0, 20) + '...');

    // Test 2: Retrieve PaymentIntent
    console.log('\n2️⃣ Retrieving PaymentIntent...');
    const retrieved = await stripe.paymentIntents.retrieve(paymentIntent.id);
    console.log('✅ PaymentIntent retrieved:', retrieved.id);
    console.log('   Status:', retrieved.status);
    console.log('   Amount:', retrieved.amount / 100, retrieved.currency.toUpperCase());

    // Test 3: Cancel PaymentIntent
    console.log('\n3️⃣ Canceling PaymentIntent...');
    const canceled = await stripe.paymentIntents.cancel(paymentIntent.id);
    console.log('✅ PaymentIntent canceled:', canceled.id);
    console.log('   Status:', canceled.status);

    // Test 4: Test Cards
    console.log('\n4️⃣ Stripe Test Cards:');
    console.log('   Success: 4242 4242 4242 4242');
    console.log('   3D Secure: 4000 0025 0000 3155');
    console.log('   Declined: 4000 0000 0000 0002');
    console.log('   Insufficient Funds: 4000 0000 0000 9995');

    console.log('\n✅ All tests passed!');
  } catch (error: any) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

testPaymentFlow();
