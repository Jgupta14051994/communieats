'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CreditCard } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { createClient } from '@/lib/supabase/client'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal, getSubtotal, getDiscount, getDiscountPercent, fulfillmentMode, clearCart } = useCartStore()
  const [placing, setPlacing] = useState(false)

  const handleOrder = async () => {
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
          subtotal: getSubtotal(),
          discount: getDiscount(),
          fulfillmentMode: fulfillmentMode,
          deliveryAddress: '123 Main St, NYC',
        }),
      })
    } catch {}

    await new Promise(r => setTimeout(r, 800))
    clearCart()
    const orderNum = `CE-${Math.floor(Math.random() * 90000 + 10000)}`
    router.push(`/orders/track?id=${orderNum}`)
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-[#1A1A1A] mb-6">Checkout</h1>

      {getDiscount() > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-4">
          <p className="text-[#06C167] font-bold">🎉 {getDiscountPercent()}% community discount applied — saving ${getDiscount().toFixed(2)}!</p>
        </div>
      )}

      <div className="bg-white rounded-2xl p-4 mb-4">
        <h3 className="font-semibold text-[#1A1A1A] mb-4 flex items-center gap-2"><CreditCard className="w-4 h-4" />Payment (Test Mode)</h3>
        <div className="space-y-3">
          <input placeholder="Card number" defaultValue="4242 4242 4242 4242" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#06C167]" />
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="MM/YY" defaultValue="12/28" className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#06C167]" />
            <input placeholder="CVC" defaultValue="123" className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#06C167]" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 mb-6">
        <div className="flex justify-between font-bold text-[#1A1A1A] text-lg">
          <span>Total due</span><span>${getTotal().toFixed(2)}</span>
        </div>
      </div>

      <button onClick={handleOrder} disabled={placing}
        className="w-full bg-[#06C167] text-white py-4 rounded-2xl font-bold text-base hover:bg-[#049652] transition-colors disabled:opacity-60 shadow-lg">
        {placing ? 'Placing order...' : `Place Order — $${getTotal().toFixed(2)}`}
      </button>
    </div>
  )
}
