'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CreditCard, CheckCircle, Leaf } from 'lucide-react'
import { useCartStore } from '@/lib/store'

export default function CheckoutPage() {
  const router = useRouter()
  const { getTotal, getDiscount, getDiscountPercent, fulfillmentMode, clearCart } = useCartStore()
  const [placing, setPlacing] = useState(false)
  const [done, setDone] = useState(false)

  const handleOrder = async () => {
    setPlacing(true)
    await new Promise(r => setTimeout(r, 1800))
    setDone(true)
    clearCart()
  }

  if (done) return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-[#06C167]" />
      </div>
      <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">Order Confirmed!</h2>
      <p className="text-[#6B6B6B] mb-2">Order #CE-{Math.floor(Math.random() * 90000 + 10000)}</p>
      {fulfillmentMode === 'community_courier' && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <Leaf className="w-6 h-6 text-[#06C167] flex-shrink-0" />
          <div className="text-left">
            <p className="font-semibold text-[#06C167] text-sm">You saved ~0.4kg CO&#x2082; today</p>
            <p className="text-[#6B6B6B] text-xs mt-0.5">Thanks for being a Community Courier! 🌱</p>
          </div>
        </div>
      )}
      <div className="flex gap-3">
        <button onClick={() => router.push('/orders')} className="flex-1 border border-gray-200 text-[#1A1A1A] py-3 rounded-2xl font-semibold hover:bg-gray-50 transition-colors">View Orders</button>
        <button onClick={() => router.push('/')} className="flex-1 bg-[#06C167] text-white py-3 rounded-2xl font-semibold hover:bg-[#049652] transition-colors">Back to Home</button>
      </div>
    </div>
  )

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
