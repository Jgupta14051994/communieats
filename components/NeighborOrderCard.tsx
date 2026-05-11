'use client'
import { motion } from 'framer-motion'
import { Package, MapPin, Check } from 'lucide-react'
import { NeighborOrder } from '@/lib/mock-data'

interface Props { order: NeighborOrder; index: number; selected: boolean; onToggle: () => void }

export default function NeighborOrderCard({ order, index, selected, onToggle }: Props) {
  return (
    <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}
      onClick={onToggle}
      className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
        selected ? 'border-[#06C167] bg-green-50' : 'border-gray-200 bg-white hover:border-gray-300'
      }`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${selected ? 'bg-[#06C167]' : 'bg-gray-100'}`}>
        {selected ? <Check className="w-4 h-4 text-white" /> : <Package className="w-4 h-4 text-[#6B6B6B]" />}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-[#1A1A1A]">{order.boxes} {order.boxes === 1 ? 'box' : 'boxes'}</p>
        <p className="flex items-center gap-1 text-xs text-[#6B6B6B]"><MapPin className="w-3 h-3" />{order.distance} away</p>
      </div>
      <span className="text-[#06C167] text-sm font-bold">+${order.reward.toFixed(2)} off</span>
    </motion.div>
  )
}
