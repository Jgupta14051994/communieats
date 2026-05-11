'use client'
import Image from 'next/image'
import { MOCK_ORDERS } from '@/lib/mock-data'
import { Leaf, HeartHandshake } from 'lucide-react'

export default function OrdersPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-[#1A1A1A] mb-6">Order History</h1>
      <div className="space-y-4">
        {MOCK_ORDERS.map(order => (
          <div key={order.id} className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                <Image src={order.restaurantImage} alt={order.restaurantName} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-[#1A1A1A]">{order.restaurantName}</h3>
                  {order.fulfillmentMode === 'community_courier' && (
                    <span className="flex items-center gap-1 bg-green-50 text-[#06C167] text-xs font-medium px-2 py-0.5 rounded-full">
                      <HeartHandshake className="w-3 h-3" />Community Courier
                    </span>
                  )}
                </div>
                <p className="text-[#6B6B6B] text-xs">{order.items.join(', ')}</p>
              </div>
              <span className="font-bold text-[#1A1A1A]">${order.total.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-[#6B6B6B]">
              <span>{order.date}</span>
              <span className="bg-green-50 text-[#06C167] px-2 py-0.5 rounded-full font-medium capitalize">{order.status}</span>
            </div>
            {order.co2Saved > 0 && (
              <div className="mt-2 flex items-center gap-1 text-xs text-[#2D6A4F]">
                <Leaf className="w-3 h-3" />Saved {order.co2Saved}kg CO&#x2082; • {order.neighborDeliveries} neighbor {order.neighborDeliveries === 1 ? 'delivery' : 'deliveries'}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
