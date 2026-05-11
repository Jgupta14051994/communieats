'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CreditCard, MapPin, Tag, ChevronRight } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { createClient } from '@/lib/supabase/client'

const PROMO_CODES: Record<string, number> = {
  'WELCOME10': 10,
  'COMMUNITY': 15,
  'GREENEATS': 20,
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal, getSubtotal, getDiscount, getDiscountPercent, fulfillmentMode, clearCart } = useCartStore()
  const [placing, setPlacing] = useState(false)
  const [address, setAddress] = useState('123 Main St, New York, NY')
  const [promoCode, setPromoCode] = useState('')
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [promoError, setPromoError] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)

  useEffect(() => {
    if (items.length === 0) router.replace('/')
  }, [items.length, router])

  const applyPromo = () => {
    const pct = PROMO_CODES[promoCode.toUpperCase().trim()]
    if (pct) {
      setPromoDiscount(pct)
      setPromoApplied(true)
      setPromoError('')
    } else {
      setPromoError('Invalid promo code')
      setPromoDiscount(0)
    }
  }

  const deliveryFee = fulfillmentMode === 'delivery' ? 2.99 : 0
  const subtotal = getSubtotal()
  const communityDiscount = getDiscount()
  const promoAmount = promoApplied ? subtotal * (promoDiscount / 100) : 0
  const total = subtotal - communityDiscount - promoAmount + deliveryFee

  const handleOrder = async () => {
    if (!address.trim()) return
    setPlacing(true)
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

    await new Promise(r => setTimeout(r, 800))
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
        <h3 className="font-semibold text-[#1A1A1A] mb-3 text-sm uppercase tracking-wide text-[#6B6B6B]">Your order</h3>
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
            <span className="text-[#06C167] font-semibold text-sm flex-1">"{promoCode.toUpperCase()}" — {promoDiscount}% off applied!</span>
            <button onClick={() => { setPromoApplied(false); setPromoDiscount(0); setPromoCode('') }}
              className="text-xs text-[#6B6B6B] hover:text-red-500">Remove</button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              value={promoCode}
              onChange={e => { setPromoCode(e.target.value); setPromoError('') }}
              placeholder="Enter code (try WELCOME10)"
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#06C167] uppercase"
              onKeyDown={e => e.key === 'Enter' && applyPromo()}
            />
            <button onClick={applyPromo}
              className="bg-[#1A1A1A] text-white px-4 py-3 rounded-xl text-sm font-semibold hover:bg-[#333] transition-colors">
              Apply
            </button>
          </div>
        )}
        {promoError && <p className="text-red-500 text-xs mt-1">{promoError}</p>}
        {!promoApplied && <p className="text-[#6B6B6B] text-xs mt-1">Try: WELCOME10 · COMMUNITY · GREENEATS</p>}
      </div>

      {/* Payment */}
      <div className="bg-white rounded-2xl p-4 mb-4">
        <h3 className="font-semibold text-[#1A1A1A] mb-4 flex items-center gap-2 text-sm">
          <CreditCard className="w-4 h-4 text-[#06C167]" />Payment (Demo Mode)
        </h3>
        <div className="space-y-3">
          <input readOnly defaultValue="4242 4242 4242 4242" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 text-[#6B6B6B]" />
          <div className="grid grid-cols-2 gap-3">
            <input readOnly defaultValue="12/28" className="border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 text-[#6B6B6B]" />
            <input readOnly defaultValue="123" className="border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 text-[#6B6B6B]" />
          </div>
          <p className="text-xs text-[#6B6B6B] text-center">Test mode — no real charge</p>
        </div>
      </div>

      {/* Price breakdown */}
      <div className="bg-white rounded-2xl p-4 mb-6 space-y-2">
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

      <button onClick={handleOrder} disabled={placing || !address.trim()}
        className="w-full bg-[#06C167] text-white py-4 rounded-2xl font-bold text-base hover:bg-[#049652] transition-colors disabled:opacity-60 shadow-lg flex items-center justify-center gap-2">
        {placing ? 'Placing order…' : (
          <><span>Place Order — ${total.toFixed(2)}</span><ChevronRight className="w-5 h-5" /></>
        )}
      </button>
    </div>
  )
}
