'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { Truck, PersonStanding, HeartHandshake } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { NEIGHBOR_ORDERS } from '@/lib/mock-data'
import NeighborOrderCard from './NeighborOrderCard'

const modes = [
  { id: 'delivery' as const, icon: Truck, label: 'Delivery', desc: 'Delivered to your door', color: '#6B6B6B' },
  { id: 'pickup' as const, icon: PersonStanding, label: 'Pick Up', desc: 'Save 10% by going yourself', color: '#06C167' },
  { id: 'community_courier' as const, icon: HeartHandshake, label: 'Community Courier', desc: "Pick up + deliver a neighbor's order", color: '#06C167' },
]

export default function FulfillmentPicker({ restaurantId }: { restaurantId: string }) {
  const { fulfillmentMode, neighborOrders, setFulfillmentMode, setNeighborOrders, getDiscountPercent, getDiscount } = useCartStore()
  const availableNeighborOrders = NEIGHBOR_ORDERS.filter(o => o.restaurantId === restaurantId).slice(0, 3)

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-[#1A1A1A] text-base">How do you want your order?</h3>
      <div className="grid grid-cols-1 gap-2">
        {modes.map(({ id, icon: Icon, label, desc }) => {
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
                    {id !== 'delivery' && (
                      <span className="text-[#06C167] text-xs font-bold">{id === 'pickup' ? '10% OFF' : '20-30% OFF'}</span>
                    )}
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
                <span className="font-semibold text-[#1A1A1A]">{availableNeighborOrders.length} neighbors</span> have orders ready at this restaurant. Carry 1–2 for extra discounts:
              </p>
              {availableNeighborOrders.map((order, i) => (
                <NeighborOrderCard key={order.id} order={order} index={i} selected={neighborOrders > i} onToggle={() => setNeighborOrders(neighborOrders > i ? i : i + 1)} />
              ))}
              {getDiscountPercent() > 0 && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                  <p className="text-[#06C167] font-bold text-xl">You&apos;ll save ${getDiscount().toFixed(2)}</p>
                  <p className="text-[#6B6B6B] text-sm mt-1">{getDiscountPercent()}% community courier discount applied</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
