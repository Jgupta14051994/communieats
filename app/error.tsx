'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])
  const router = useRouter()
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h2 className="text-xl font-bold text-[#1A1A1A] mb-2">Something went wrong</h2>
        <p className="text-[#6B6B6B] text-sm mb-6">{error.message}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="bg-[#06C167] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#049652] transition-colors">
            Try again
          </button>
          <button onClick={() => router.push('/')} className="border border-gray-200 text-[#1A1A1A] px-6 py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors">
            Go home
          </button>
        </div>
      </div>
    </div>
  )
}
