'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Tag, ChevronRight, Lock } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { createClient } from '@/lib/supabase/client'
import { hapticSuccess } from '@/lib/native'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'

const PROMO_CODES: Record<string, number> = {
  'WELCOME10': 10,
  'COMMUNITY': 15,
  'GREENEATS': 20,
}

// Initialise Stripe outside component so it's not re-created on each render
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null

// ─── Stripe Elements payment form ────────────────────────────────────────────
function StripePaymentForm({
  total,
  address,
  onSuccess,
}: {
  total: number
  address: string
  onSuccess: () => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setPlacing(true)
    setError('')

    const { error: submitErr } = await elements.submit()
    if (submitErr) { setError(submitErr.message || 'Payment failed'); setPlacing(false); return }

    // Get a fresh payment intent for the current total
    const res = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: total }),
    })
    const { clientSecret, demo } = await res.json()

    if (demo || !clientSecret) {
      await hapticSuccess()
      onSuccess()
      return
    }

    const { error: confirmErr } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: { return_url: `${window.location.origin}/orders/track` },
      redirect: 'if_required',
    })

    if (confirmErr) {
      setError(confirmErr.message || 'Payment failed')
      setPlacing(false)
    } else {
      await hapticSuccess()
      onSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement options={{ layout: 'tabs' }} />
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      <button
        type="submit"
        disabled={placing || !address.trim()}
        className="w-full mt-4 bg-[#06C167] text-white py-4 rounded-2xl font-bold text-base hover:bg-[#049652] transition-colors disabled:opacity-60 shadow-lg flex items-center justify-center gap-2"
      >
        {placing ? 'Processing…' : (
          <><Lock className="w-4 h-4" /><span>Pay ${total.toFixed(2)}</span><ChevronRight className="w-5 h-5" /></>
        )}
      </button>
      <p className="text-center text-xs text-[#6B6B6B] mt-2 flex items-center justify-center gap-1">
        <Lock className="w-3 h-3" /> Secured by Stripe
      </p>
    </form>
  )
}

// ─── Demo pay button shown when Stripe keys aren't configured ─────────────────
function DemoPayButton({
  total,
  address,
  onSuccess,
}: {
  total: number
  address: string
  onSuccess: () => void
}) {
  const [placing, setPlacing] = useState(false)

  const handlePay = async () => {
    if (!address.trim()) return
    setPlacing(true)
    await new Promise(r => setTimeout(r, 900))
    await hapticSuccess()
    onSuccess()
  }

  return (
    <div>
      <div className="border border-dashed border-gray-300 rounded-xl p-4 mb-4 bg-gray-50 text-center">
        <p className="text-sm font-medium text-[#1A1A1A] mb-1">Payment Ready</p>
        <p className="text-xs text-[#6B6B6B]">
          Connect Stripe by adding <code className="bg-gray-200 px-1 rounded text-[10px]">STRIPE_SECRET_KEY</code> to Vercel env vars to accept real payments.
        </p>
      </div>
      <button
        onClick={handlePay}
        disabled={placing || !address.trim()}
        className="w-full bg-[#06C167] text-white py-4 rounded-2xl font-bold text-base hover:bg-[#049652] transition-colors disabled:opacity-60 shadow-lg flex items-center justify-center gap-2"
      >
        {placing ? 'Processing…' : (
          <><span>Place Order — ${total.toFixed(2)}</span><ChevronRight className="w-5 h-5" /></>
        )}
      </button>
    </div>
  )
}

// ─── Main checkout page ───────────────────────────────────────────────────────
export default function CheckoutPage() {
  const router = useRouter()
  const { items, getSubtotal, getDiscount, getDiscountPercent, fulfillmentMode, clearCart } = useCartStore()
  const [address, setAddress] = useState('123 Main St, New York, NY')
  const [promoCode, setPromoCode] = useState('')
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [promoError, setPromoError] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  useEffect(() => {
    if (items.length === 0) router.replace('/')
  }, [items.length, router])

  const deliveryFee = fulfillmentMode === 'delivery' ? 6.99 : 0
  const subtotal = getSubtotal()
  const communityDiscount = getDiscount()
  const promoAmount = promoApplied ? subtotal * (promoDiscount / 100) : 0
  const total = Math.max(0, subtotal - communityDiscount - promoAmount + deliveryFee)

  // Pre-load Stripe PaymentIntent when keys are present
  useEffect(() => {
    if (!stripePromise || total <= 0) return
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: total }),
    })
      .then(r => r.json())
      .then(({ clientSecret: cs }) => { if (cs) setClientSecret(cs) })
      .catch(() => {})
  }, [total])

  const applyPromo = () => {
    const pct = PROMO_CODES[promoCode.toUpperCase().trim()]
    if (pct) { setPromoDiscount(pct); setPromoApplied(true); setPromoError('') }
    else { setPromoError('Invalid promo code'); setPromoDiscount(0) }
  }

  const handleSuccess = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          restaurantId: items[0]?.restaurantId,
          items: items.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })),
          subtotal,
          discount: communityDiscount + promoAmount,
          fulfillmentMode,
          deliveryAddress: address,
        }),
      })
    } catch {}
    clearCart()
    const orderNum = `CE-${Math.floor(Math.random() * 90000 + 10000)}`
    router.push(`/orders/track?id=${orderNum}`)
  }

  if (items.length === 0) return null

  return (
    <div className="max-w-lg mx-auto px-4 py-6 pb-10">
      <h1 className="text-2xl font-bold text-[#1A1A1A] mb-6">Checkout</h1>

      {/* Order summary */}
      <div className="bg-white rounded-2xl p-4 mb-4 space-y-2">
        <h3 className="font-semibold text-[#6B6B6B] mb-3 text-xs uppercase tracking-wide">Your order</h3>
        {items.map(item => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-[#1A1A1A]">{item.quantity}× {item.name}</span>
            <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Delivery address */}
      {fulfillmentMode === 'delivery' && (
        <div className="bg-white rounded-2xl p-4 mb-4">
          <h3 className="font-semibold text-[#1A1A1A] mb-3 flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-[#06C167]" />Delivery Address
          </h3>
          <input
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="Enter your delivery address"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#06C167]"
          />
        </div>
      )}

      {/* Promo code */}
      <div className="bg-white rounded-2xl p-4 mb-4">
        <h3 className="font-semibold text-[#1A1A1A] mb-3 flex items-center gap-2 text-sm">
          <Tag className="w-4 h-4 text-[#06C167]" />Promo Code
        </h3>
        {promoApplied ? (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
            <span className="text-[#06C167] font-semibold text-sm flex-1">
              &quot;{promoCode.toUpperCase()}&quot; — {promoDiscount}% off applied!
            </span>
            <button
              onClick={() => { setPromoApplied(false); setPromoDiscount(0); setPromoCode('') }}
              className="text-xs text-[#6B6B6B] hover:text-red-500"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              value={promoCode}
              onChange={e => { setPromoCode(e.target.value); setPromoError('') }}
              placeholder="Enter promo code"
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#06C167] uppercase"
              onKeyDown={e => e.key === 'Enter' && applyPromo()}
            />
            <button
              onClick={applyPromo}
              className="bg-[#1A1A1A] text-white px-4 py-3 rounded-xl text-sm font-semibold hover:bg-[#333] transition-colors"
            >
              Apply
            </button>
          </div>
        )}
        {promoError && <p className="text-red-500 text-xs mt-1">{promoError}</p>}
        {!promoApplied && <p className="text-[#6B6B6B] text-xs mt-1">Try: WELCOME10 · COMMUNITY · GREENEATS</p>}
      </div>

      {/* Price breakdown */}
      <div className="bg-white rounded-2xl p-4 mb-4 space-y-2">
        <div className="flex justify-between text-sm"><span className="text-[#6B6B6B]">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
        {communityDiscount > 0 && (
          <div className="flex justify-between text-sm text-[#06C167] font-medium">
            <span>Community discount ({getDiscountPercent()}%)</span>
            <span>−${communityDiscount.toFixed(2)}</span>
          </div>
        )}
        {promoAmount > 0 && (
          <div className="flex justify-between text-sm text-[#06C167] font-medium">
            <span>Promo ({promoDiscount}%)</span>
            <span>−${promoAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-[#6B6B6B]">Delivery fee</span>
          <span>{deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}</span>
        </div>
        <div className="border-t pt-2 flex justify-between font-bold text-[#1A1A1A] text-lg">
          <span>Total</span><span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment section */}
      <div className="bg-white rounded-2xl p-4 mb-4">
        <h3 className="font-semibold text-[#1A1A1A] mb-4 flex items-center gap-2 text-sm">
          <Lock className="w-4 h-4 text-[#06C167]" />Payment
        </h3>

        {stripePromise && clientSecret ? (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: 'stripe',
                variables: { colorPrimary: '#06C167', borderRadius: '12px' },
              },
            }}
          >
            <StripePaymentForm total={total} address={address} onSuccess={handleSuccess} />
          </Elements>
        ) : (
          <DemoPayButton total={total} address={address} onSuccess={handleSuccess} />
        )}
      </div>
    </div>
  )
}
