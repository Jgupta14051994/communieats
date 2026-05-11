'use client'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Flame, Users, MapPin } from 'lucide-react'
import { RESTAURANTS as MOCK_RESTAURANTS } from '@/lib/mock-data'
import type { Restaurant } from '@/lib/mock-data'

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false })

export default function MapPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(MOCK_RESTAURANTS)

  useEffect(() => {
    fetch('/api/restaurants')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) setRestaurants(data) })
      .catch(() => {})
  }, [])

  const sorted = [...restaurants].sort((a, b) => b.orderCount - a.orderCount)

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <div className="md:w-72 bg-white border-r border-gray-100 overflow-y-auto order-2 md:order-1 max-h-64 md:max-h-full">
        <div className="p-4">
          <h2 className="font-bold text-[#1A1A1A] mb-1">Live Activity</h2>
          <p className="text-xs text-[#6B6B6B] mb-3 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#06C167] animate-pulse inline-block" />
            Updating in real-time
          </p>
          <div className="space-y-1">
            {sorted.map(r => (
              <a key={r.id} href={`/restaurant/${r.id}`}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0 group-hover:bg-green-100 transition-colors">
                  <MapPin className="w-4 h-4 text-[#06C167]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#1A1A1A] text-sm truncate">{r.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-1 text-xs text-orange-600">
                      <Flame className="w-3 h-3" />{r.orderCount} orders
                    </span>
                    {r.pendingCourierOrders > 0 && (
                      <span className="flex items-center gap-1 text-xs text-[#00B4D8]">
                        <Users className="w-3 h-3" />{r.pendingCourierOrders}
                      </span>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 order-1 md:order-2">
        <MapView restaurants={restaurants} />
      </div>
    </div>
  )
}
