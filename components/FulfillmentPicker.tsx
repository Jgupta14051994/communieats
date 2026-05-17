'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Truck, PersonStanding, HeartHandshake } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { NEIGHBOR_ORDERS } from '@/lib/mock-data'
import NeighborOrderCard from './NeighborOrderCard'

const modes = [
  {
    id: 'delivery' as const,
    icon: Truck,
    label: 'Delivery',
    desc: 'Delivered straight to your door',
    fee: '$6.99',
    badge: null,
  },
  {
    id: 'pickup' as const,
    icon: PersonStanding,
    label: 'Pick Up',
    desc: 'Pick up yourself — no delivery fee',
    fee: 'Free',
    badge: null,
  },
  {
    id: 'community_courier' as const,
    icon: HeartHandshake,
    label: 'Pickup + Neighbours',
    desc: "Pick up your order & a neighbour's — earn 20% off",
    fee: 'Free',
    badge: '20% OFF',
  },
]

export default function FulfillmentPicker({ restaurantId }: { restaurantId: string }) {
  const { fulfillmentMode, neighborOrders, setFulfillmentMode, setNeighborOrders, getDiscount } = useCartStore()
  const [availableNeighborOrders, setAvailableNeighborOrders] = useState(
    NEIGHBOR_ORDERS.filter(o => o.restaurantId === restaurantId).slice(0, 3)
  )

  useEffect(() => {
    if (!restaurantId) return
    fetch(`/api/community-courier?restaurantId=${restaurantId}`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) setAvailableNeighborOrders(data.slice(0, 3)) })
      .catch(() => {})
  }, [restaurantId])

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-[#1A1A1A] text-base">How do you want your order?</h3>
      <div className="grid grid-cols-1 gap-2">
        {modes.map(({ id, icon: Icon, label, desc, fee, badge }) => {
          const selected = fulfillmentMode === id
          return (
            <motion.button key={id} onClick={() => setFulfillmentMode(id)} whileTap={{ scale: 0.98 }}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 ${
                selected
                  ? id === 'community_courier'
                    ? 'border-[#06C167] bg-green-50 shadow-[0_0_0_4px_rgba(6,193,103,0.1)]'
                    : 'border-[#06C167] bg-green-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selected ? 'bg-[#06C167]' : 'bg-gray-100'}`}>
                  <Icon className={`w-5 h-5 ${selected ? 'text-white' : 'text-[#6B6B6B]'}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#1A1A1A] text-sm">{label}</span>
                    <div className="flex items-center gap-2">
                      {badge && (
                        <span className="bg-green-100 text-[#06C167] text-xs font-bold px-2 py-0.5 rounded-full">{badge}</span>
                      )}
                      <span className={`text-xs font-semibold ${id === 'delivery' ? 'text-[#6B6B6B]' : 'text-[#06C167]'}`}>{fee}</span>
                    </div>
                  </div>
                  <p className="text-[#6B6B6B] text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>

      <AnimatePresence>
        {fulfillmentMode === 'community_courier' && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="pt-2 space-y-3">
              <p className="text-sm text-[#6B6B6B]">
                <span className="font-semibold text-[#1A1A1A]">{availableNeighborOrders.length} neighbour{availableNeighborOrders.length !== 1 ? 's' : ''}</span> near you have orders ready at this restaurant:
              </p>
              {availableNeighborOrders.map((order, i) => (
                <NeighborOrderCard key={order.id} order={order} index={i}
                  selected={neighborOrders > i}
                  onToggle={() => setNeighborOrders(neighborOrders > i ? i : i + 1)} />
              ))}
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <p className="text-[#06C167] font-bold text-xl">You&apos;ll save ${getDiscount().toFixed(2)}</p>
                <p className="text-[#6B6B6B] text-sm mt-1">20% community discount applied 🎉</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
