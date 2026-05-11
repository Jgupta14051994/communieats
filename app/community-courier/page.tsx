'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import { CheckCircle, Leaf, Package } from 'lucide-react'

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false })

const deliveries = [
  { id: 1, type: 'pickup', label: 'Pick up YOUR order', address: 'Sakura Sushi, 123 Spring St', done: false },
  { id: 2, type: 'neighbor', label: 'Deliver neighbor order #1', address: '47 Hudson St (2 boxes)', done: false },
  { id: 3, type: 'neighbor', label: 'Deliver neighbor order #2', address: '89 Chambers St (1 box)', done: false },
]

export default function CourierPage() {
  const [steps, setSteps] = useState(deliveries)
  const [co2, setCo2] = useState(0)

  const markDone = (id: number) => {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, done: true } : s))
    setCo2(prev => prev + 0.2)
  }

  const allDone = steps.every(s => s.done)

  if (allDone) return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Leaf className="w-12 h-12 text-[#06C167]" />
      </div>
      <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">You&apos;re a Community Hero! 🌱</h2>
      <p className="text-[#6B6B6B] mb-6">You saved ~{co2.toFixed(1)}kg of CO&#x2082; and helped 2 neighbors get their food faster.</p>
      <div className="bg-green-50 rounded-2xl p-4 mb-6">
        <p className="text-3xl font-bold text-[#06C167]">30% discount</p>
        <p className="text-[#6B6B6B] text-sm mt-1">applied to your next order</p>
      </div>
      <button onClick={() => window.location.href = '/'} className="w-full bg-[#06C167] text-white py-4 rounded-2xl font-bold hover:bg-[#049652] transition-colors">Back to Home</button>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">Active Courier Session</h1>
      <div className="flex items-center gap-2 mb-6">
        <Leaf className="w-4 h-4 text-[#06C167]" />
        <span className="text-sm text-[#6B6B6B]">CO&#x2082; saved so far: <strong className="text-[#06C167]">{co2.toFixed(1)}kg</strong></span>
      </div>

      <div className="h-48 rounded-2xl overflow-hidden mb-6 bg-gray-100">
        <MapView />
      </div>

      <div className="space-y-3">
        {steps.map(step => (
          <div key={step.id} className={`bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm transition-opacity ${step.done ? 'opacity-60' : ''}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${step.done ? 'bg-[#06C167]' : step.type === 'pickup' ? 'bg-blue-100' : 'bg-orange-100'}`}>
              {step.done ? <CheckCircle className="w-5 h-5 text-white" /> : <Package className={`w-5 h-5 ${step.type === 'pickup' ? 'text-[#00B4D8]' : 'text-[#FF6B2C]'}`} />}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-[#1A1A1A] text-sm">{step.label}</p>
              <p className="text-[#6B6B6B] text-xs">{step.address}</p>
            </div>
            {!step.done && (
              <button onClick={() => markDone(step.id)} className="bg-[#06C167] text-white px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-[#049652] transition-colors">
                Done
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
