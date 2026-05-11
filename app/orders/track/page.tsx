'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle, Clock, Bike, Package, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'

const STATUSES = [
  { id: 'confirmed', icon: CheckCircle, label: 'Order Confirmed', desc: 'Restaurant received your order' },
  { id: 'preparing', icon: Package, label: 'Preparing', desc: 'Kitchen is preparing your food' },
  { id: 'ready', icon: Bike, label: 'Ready for Pickup', desc: 'Your order is packaged and ready' },
  { id: 'delivering', icon: MapPin, label: 'On the Way', desc: 'Courier is heading to you' },
  { id: 'delivered', icon: CheckCircle, label: 'Delivered!', desc: 'Enjoy your meal 🌱' },
]

function TrackingContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get('id') || `CE-${Math.floor(Math.random() * 90000 + 10000)}`
  const [currentStep, setCurrentStep] = useState(0)
  const [eta, setEta] = useState(28)

  useEffect(() => {
    const intervals = [3000, 8000, 14000, 22000]
    const timers = intervals.map((delay, i) =>
      setTimeout(() => {
        setCurrentStep(i + 1)
        setEta(prev => Math.max(0, prev - Math.floor(Math.random() * 6 + 4)))
      }, delay)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  const done = currentStep >= STATUSES.length - 1

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.push('/orders')} className="p-2 rounded-full bg-white shadow-sm">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div>
          <h1 className="text-xl font-bold text-[#1A1A1A]">Track Order</h1>
          <p className="text-xs text-[#6B6B6B]">#{orderId}</p>
        </div>
      </div>

      {!done && (
        <div className="bg-[#06C167] rounded-2xl p-4 mb-6 text-white text-center">
          <p className="text-sm opacity-80 mb-1">Estimated arrival</p>
          <motion.p className="text-4xl font-bold" key={eta} initial={{ scale: 1.1 }} animate={{ scale: 1 }}>
            {eta} min
          </motion.p>
        </div>
      )}

      {done && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6 text-center">
          <div className="text-5xl mb-2">🎉</div>
          <h2 className="text-xl font-bold text-[#1A1A1A] mb-1">Order Delivered!</h2>
          <p className="text-[#6B6B6B] text-sm">We hope you enjoy your meal. Rate your experience below.</p>
        </motion.div>
      )}

      <div className="bg-white rounded-2xl p-4 space-y-4">
        {STATUSES.map((status, i) => {
          const Icon = status.icon
          const active = i === currentStep
          const completed = i < currentStep
          return (
            <div key={status.id} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <motion.div
                  animate={active ? { scale: [1, 1.15, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    completed ? 'bg-[#06C167]' : active ? 'bg-[#06C167] ring-4 ring-green-100' : 'bg-gray-100'
                  }`}>
                  <Icon className={`w-5 h-5 ${completed || active ? 'text-white' : 'text-gray-400'}`} />
                </motion.div>
                {i < STATUSES.length - 1 && (
                  <div className={`w-0.5 h-6 mt-1 ${completed ? 'bg-[#06C167]' : 'bg-gray-200'}`} />
                )}
              </div>
              <div className="pt-2">
                <p className={`font-semibold text-sm ${completed || active ? 'text-[#1A1A1A]' : 'text-gray-400'}`}>{status.label}</p>
                <p className="text-xs text-[#6B6B6B]">{status.desc}</p>
              </div>
            </div>
          )
        })}
      </div>

      {done && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button onClick={() => router.push('/')}
            className="border border-gray-200 text-[#1A1A1A] py-3 rounded-2xl font-semibold text-sm hover:bg-gray-50 transition-colors">
            Back to Home
          </button>
          <button onClick={() => router.push('/profile')}
            className="bg-[#06C167] text-white py-3 rounded-2xl font-semibold text-sm hover:bg-[#049652] transition-colors">
            View Profile
          </button>
        </div>
      )}
    </div>
  )
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="max-w-lg mx-auto px-4 py-6 space-y-4">{[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl h-20 animate-pulse" />)}</div>}>
      <TrackingContent />
    </Suspense>
  )
}
