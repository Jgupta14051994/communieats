'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Leaf, HeartHandshake, ShoppingBag } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { RESTAURANTS, MOCK_ORDERS } from '@/lib/mock-data'

interface Order {
  id: string
  restaurant_id: string
  items: Array<{ name: string; quantity: number }>
  subtotal: number
  discount_applied: number
  fulfillment_mode: string
  status: string
  created_at: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        setIsAuthed(true)
        const { data: userOrders } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', data.user.id)
          .order('created_at', { ascending: false })
        setOrders(userOrders || [])
      }
      setLoading(false)
    })
  }, [])

  const getRestaurant = (id: string) => RESTAURANTS.find(r => r.id === id) || RESTAURANTS[0]

  if (loading) return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl h-24 animate-pulse" />)}
    </div>
  )

  const displayOrders = isAuthed && orders.length > 0 ? orders : MOCK_ORDERS

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-[#1A1A1A] mb-6">Order History</h1>

      {!isAuthed && (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-4 flex items-center justify-between">
          <p className="text-sm text-[#6B6B6B]">Sign in to see your real orders</p>
          <Link href="/auth/login" className="text-sm font-semibold text-[#06C167] hover:underline">Sign in</Link>
        </div>
      )}

      {displayOrders.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-[#1A1A1A] mb-2">No orders yet</h2>
          <p className="text-[#6B6B6B] text-sm mb-6">Start ordering from your favourite restaurants</p>
          <Link href="/" className="bg-[#06C167] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#049652] transition-colors">
            Browse Restaurants
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {displayOrders.map((order: any) => {
            const restaurant = getRestaurant(order.restaurant_id || order.restaurantName)
            const isCourier = (order.fulfillment_mode || order.fulfillmentMode) === 'community_courier'
            const itemNames = Array.isArray(order.items)
              ? order.items.map((i: any) => i.name || i).join(', ')
              : (order.items || '')
            const total = order.total || (Number(order.subtotal) - Number(order.discount_applied || 0))
            const date = order.created_at ? new Date(order.created_at).toLocaleDateString() : order.date

            return (
              <div key={order.id} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                    <Image src={restaurant.image} alt={restaurant.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-[#1A1A1A]">{restaurant.name}</h3>
                      {isCourier && (
                        <span className="flex items-center gap-1 bg-green-50 text-[#06C167] text-xs font-medium px-2 py-0.5 rounded-full">
                          <HeartHandshake className="w-3 h-3" />Community Courier
                        </span>
                      )}
                    </div>
                    <p className="text-[#6B6B6B] text-xs mt-0.5 line-clamp-1">{itemNames}</p>
                  </div>
                  <span className="font-bold text-[#1A1A1A]">${Number(total).toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#6B6B6B]">
                  <span>{date}</span>
                  <span className="bg-green-50 text-[#06C167] px-2 py-0.5 rounded-full font-medium capitalize">
                    {order.status || 'delivered'}
                  </span>
                </div>
                {order.co2Saved > 0 && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-[#2D6A4F]">
                    <Leaf className="w-3 h-3" />Saved {order.co2Saved}kg CO&#x2082;
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
