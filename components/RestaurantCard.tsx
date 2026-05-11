'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Clock, MapPin, Users } from 'lucide-react'
import { Restaurant } from '@/lib/mock-data'
import RealtimeOrderCount from './RealtimeOrderCount'

export default function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <Link href={`/restaurant/${restaurant.id}`}>
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer">
        <div className="relative h-44 w-full">
          <Image src={restaurant.image} alt={restaurant.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
          {restaurant.orderCount > 200 && (
            <span className="absolute top-3 left-3 bg-[#FF6B2C] text-white text-xs font-bold px-2 py-1 rounded-full">🔥 Popular</span>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-semibold text-[#1A1A1A] text-base">{restaurant.name}</h3>
            <span className="flex items-center gap-1 text-sm font-medium text-[#1A1A1A]">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />{restaurant.rating}
            </span>
          </div>
          <p className="text-[#6B6B6B] text-sm mb-3">{restaurant.cuisine}</p>
          <div className="flex items-center gap-3 text-xs text-[#6B6B6B] mb-3">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{restaurant.deliveryTime} min</span>
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{restaurant.distance}</span>
          </div>
          <div className="flex items-center justify-between">
            <RealtimeOrderCount restaurantId={restaurant.id} initialCount={restaurant.orderCount} />
            {restaurant.pendingCourierOrders > 0 && (
              <span className="flex items-center gap-1 bg-blue-50 text-[#00B4D8] text-xs font-medium px-2 py-1 rounded-full">
                <Users className="w-3 h-3" />{restaurant.pendingCourierOrders} waiting
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
