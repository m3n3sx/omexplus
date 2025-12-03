import { NextRequest, NextResponse } from 'next/server'

// Note: Install Stripe first: npm install stripe
// Uncomment when ready to use:
/*
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})
*/

export async function POST(request: NextRequest) {
  try {
    const { amount, currency, cartId, metadata } = await request.json()

    // Validate amount
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    // TODO: Uncomment when Stripe is configured
    /*
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Amount in cents
      currency: currency || 'pln',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        cart_id: cartId,
        ...metadata,
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
    */

    // Temporary mock response for testing
    return NextResponse.json({
      clientSecret: 'pi_test_secret_' + Math.random().toString(36).substring(7),
      paymentIntentId: 'pi_test_' + Math.random().toString(36).substring(7),
      message: 'Stripe not configured yet. Install stripe package and add API keys.',
    })
  } catch (error: any) {
    console.error('Payment intent creation failed:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}
