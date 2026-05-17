import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { amount } = await req.json()

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    if (!stripeSecretKey) {
      // Stripe not configured — return a demo client secret so checkout still works in test mode
      return NextResponse.json({ clientSecret: null, demo: true })
    }

    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(stripeSecretKey)

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // convert dollars to cents
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: { app: 'communieats' },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (err) {
    console.error('Stripe error:', err)
    return NextResponse.json({ clientSecret: null, demo: true })
  }
}
