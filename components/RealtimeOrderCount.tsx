'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  restaurantId: string
  initialCount: number
}

export default function RealtimeOrderCount({ restaurantId, initialCount }: Props) {
  const [count, setCount] = useState(initialCount)
  const [flashing, setFlashing] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel(`order-count-${restaurantId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'restaurant_order_counts',
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (payload: any) => {
          const newCount = payload.new?.count
          if (newCount !== undefined && newCount !== count) {
            setCount(newCount)
            setFlashing(true)
            setTimeout(() => setFlashing(false), 1000)
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [restaurantId, count])

  // NOTE: Run this SQL in the Supabase dashboard to enable realtime:
  // ALTER PUBLICATION supabase_realtime ADD TABLE restaurant_order_counts;
  // ALTER PUBLICATION supabase_realtime ADD TABLE orders;

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={count}
        initial={{ scale: 1 }}
        animate={flashing ? { scale: [1, 1.3, 1] } : { scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-1 bg-orange-50 text-orange-700 text-xs font-medium px-2 py-1 rounded-full"
      >
        <Flame className="w-3 h-3" />{count} orders today
      </motion.span>
    </AnimatePresence>
  )
}
