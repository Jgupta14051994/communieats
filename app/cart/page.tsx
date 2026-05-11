'use client'
import { useRouter } from 'next/navigation'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import FulfillmentPicker from '@/components/FulfillmentPicker'

export default function CartPage() {
  const router = useRouter()
  const { items, updateQuantity, removeItem, fulfillmentMode, getSubtotal, getDiscount, getDiscountPercent, getTotal } = useCartStore()
  const restaurantId = items[0]?.restaurantId || '1'

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-[#1A1A1A] mb-2">Your cart is empty</h2>
        <p className="text-[#6B6B6B] mb-6">Add some food from a restaurant to get started!</p>
        <button onClick={() => router.push('/')} className="bg-[#06C167] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#049652] transition-colors">Browse Restaurants</button>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 pb-32">
      <h1 className="text-2xl font-bold text-[#1A1A1A] mb-6">Your Cart</h1>
      <div className="bg-white rounded-2xl p-4 mb-4 space-y-3">
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="bg-gray-100 rounded-full p-1 hover:bg-gray-200"><Minus className="w-3 h-3" /></button>
              <span className="font-semibold text-[#1A1A1A] w-4 text-center text-sm">{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="bg-[#06C167] text-white rounded-full p-1 hover:bg-[#049652]"><Plus className="w-3 h-3" /></button>
            </div>
            <div className="flex-1">
              <p className="font-medium text-[#1A1A1A] text-sm">{item.name}</p>
              <p className="text-[#6B6B6B] text-xs">{item.restaurantName}</p>
            </div>
            <span className="font-semibold text-[#1A1A1A] text-sm">${(item.price * item.quantity).toFixed(2)}</span>
            <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-4 mb-4">
        <FulfillmentPicker restaurantId={restaurantId} />
      </div>

      <div className="bg-white rounded-2xl p-4 mb-6 space-y-2">
        <div className="flex justify-between text-sm"><span className="text-[#6B6B6B]">Subtotal</span><span className="font-medium">${getSubtotal().toFixed(2)}</span></div>
        {getDiscount() > 0 && (
          <div className="flex justify-between text-sm text-[#06C167] font-medium">
            <span>Community discount ({getDiscountPercent()}%)</span>
            <span>-${getDiscount().toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm"><span className="text-[#6B6B6B]">Delivery fee</span><span className="font-medium">{fulfillmentMode === 'delivery' ? '$2.99' : 'Free'}</span></div>
        <div className="border-t pt-2 flex justify-between font-bold text-[#1A1A1A]">
          <span>Total</span>
          <span>${(getTotal() + (fulfillmentMode === 'delivery' ? 2.99 : 0)).toFixed(2)}</span>
        </div>
      </div>

      <button onClick={() => router.push('/checkout')} className="w-full bg-[#06C167] text-white py-4 rounded-2xl font-bold text-base hover:bg-[#049652] transition-colors shadow-lg">
        Proceed to Checkout
      </button>
    </div>
  )
}
