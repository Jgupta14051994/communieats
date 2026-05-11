'use client'
import dynamic from 'next/dynamic'
import { RESTAURANTS } from '@/lib/mock-data'
import { Flame, Users } from 'lucide-react'

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false })

export default function MapPage() {
  const sorted = [...RESTAURANTS].sort((a, b) => b.orderCount - a.orderCount)
  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)]">
      <div className="md:w-72 bg-white border-r border-gray-100 overflow-y-auto order-2 md:order-1 max-h-64 md:max-h-full">
        <div className="p-4">
          <h2 className="font-bold text-[#1A1A1A] mb-3">Live Activity</h2>
          <div className="space-y-2">
            {sorted.map(r => (
              <a key={r.id} href={`/restaurant/${r.id}`} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#1A1A1A] text-sm truncate">{r.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-1 text-xs text-orange-600"><Flame className="w-3 h-3" />{r.orderCount}</span>
                    {r.pendingCourierOrders > 0 && <span className="flex items-center gap-1 text-xs text-[#00B4D8]"><Users className="w-3 h-3" />{r.pendingCourierOrders}</span>}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 p-4 order-1 md:order-2">
        <MapView />
      </div>
    </div>
  )
}
