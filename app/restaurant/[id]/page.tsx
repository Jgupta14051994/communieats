'use client'
import { use, useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Star, Clock, MapPin, Flame, ArrowLeft, Plus, Minus, ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { hapticLight, hapticMedium } from '@/lib/native'
import type { Restaurant, MenuItem } from '@/lib/mock-data'

export default function RestaurantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [activeCategory, setActiveCategory] = useState('Mains')
  const [loading, setLoading] = useState(true)

  const { addItem, items, updateQuantity, getItemCount, getSubtotal } = useCartStore()

  useEffect(() => {
    fetch(`/api/restaurants/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.restaurant) setRestaurant(data.restaurant)
        if (data.menu) setMenuItems(data.menu)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  const categories = ['Mains', 'Appetizers', 'Desserts', 'Drinks']
  const getItemQty = (itemId: string) => items.find(i => i.id === itemId)?.quantity || 0
  const filteredItems = menuItems.filter(m => m.category === activeCategory)

  if (loading) return (
    <div className="max-w-3xl mx-auto">
      <div className="h-64 bg-gray-200 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
      </div>
    </div>
  )

  if (!restaurant) return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <p className="text-[#6B6B6B] mb-4">Restaurant not found.</p>
      <button onClick={() => router.push('/')} className="bg-[#06C167] text-white px-6 py-3 rounded-full font-semibold">
        Back to Home
      </button>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto">
      <div className="relative h-64 w-full">
        <Image src={restaurant.image} alt={restaurant.name} fill className="object-cover" priority />
        <button onClick={() => router.back()} className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-md">
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-white px-4 pt-4 pb-2">
        <div className="flex items-start justify-between mb-1">
          <h1 className="text-2xl font-bold text-[#1A1A1A]">{restaurant.name}</h1>
          <span className="flex items-center gap-1 font-semibold">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />{restaurant.rating}
          </span>
        </div>
        <p className="text-[#6B6B6B] text-sm mb-2">{restaurant.cuisine}</p>
        <div className="flex items-center gap-4 text-xs text-[#6B6B6B] mb-3">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{restaurant.deliveryTime} min</span>
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{restaurant.distance}</span>
        </div>
        <div className="flex gap-2 flex-wrap mb-2">
          <span className="bg-orange-50 text-orange-700 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
            <Flame className="w-3 h-3" />{restaurant.orderCount} orders today
          </span>
          {restaurant.pendingCourierOrders > 0 && (
            <span className="bg-blue-50 text-[#00B4D8] text-xs font-medium px-3 py-1 rounded-full">
              👥 {restaurant.pendingCourierOrders} neighbors waiting for community pickup
            </span>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white border-b border-gray-100 px-4">
        <div className="flex gap-0">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeCategory === cat
                  ? 'border-[#06C167] text-[#06C167]'
                  : 'border-transparent text-[#6B6B6B] hover:text-[#1A1A1A]'
              }`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 py-4 space-y-3 pb-32">
        {filteredItems.length === 0 ? (
          <p className="text-[#6B6B6B] text-sm py-8 text-center">No items in this category</p>
        ) : filteredItems.map(item => {
          const qty = getItemQty(item.id)
          return (
            <div key={item.id} className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm">
              <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-semibold text-[#1A1A1A] text-sm">{item.name}</h3>
                  {item.isPopular && (
                    <span className="bg-orange-50 text-orange-600 text-xs px-1.5 py-0.5 rounded-full font-medium">Popular</span>
                  )}
                </div>
                <p className="text-[#6B6B6B] text-xs line-clamp-2 mb-2">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1A1A1A]">${Number(item.price).toFixed(2)}</span>
                  {qty === 0 ? (
                    <button
                      onClick={() => { hapticLight(); addItem({ id: item.id, name: item.name, price: Number(item.price), restaurantId: restaurant.id, restaurantName: restaurant.name }) }}
                      className="bg-[#06C167] text-white rounded-full p-1.5 hover:bg-[#049652] transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button onClick={() => { hapticLight(); updateQuantity(item.id, qty - 1) }}
                        className="bg-gray-100 rounded-full p-1.5 hover:bg-gray-200 transition-colors">
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-semibold text-[#1A1A1A] w-4 text-center text-sm">{qty}</span>
                      <button onClick={() => { hapticLight(); updateQuantity(item.id, qty + 1) }}
                        className="bg-[#06C167] text-white rounded-full p-1.5 hover:bg-[#049652] transition-colors">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Sticky Cart Button */}
      {getItemCount() > 0 && (
        <div className="fixed bottom-20 md:bottom-6 left-0 right-0 px-4 z-40">
          <button onClick={() => router.push('/cart')}
            className="w-full bg-[#06C167] text-white rounded-2xl p-4 font-semibold flex items-center justify-between shadow-lg hover:bg-[#049652] transition-colors">
            <span className="bg-[#049652] text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">
              {getItemCount()}
            </span>
            <span className="flex items-center gap-2"><ShoppingCart className="w-5 h-5" />View Cart</span>
            <span>${getSubtotal().toFixed(2)}</span>
          </button>
        </div>
      )}
    </div>
  )
}
