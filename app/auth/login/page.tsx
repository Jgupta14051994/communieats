'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Leaf } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F6F6] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Leaf className="w-8 h-8 text-[#06C167]" />
          <span className="text-2xl font-bold text-[#1A1A1A]">CommuniEats</span>
        </div>
        <h1 className="text-xl font-bold text-[#1A1A1A] mb-2 text-center">Welcome back</h1>
        <p className="text-[#6B6B6B] text-sm text-center mb-6">Sign in to continue ordering</p>

        {error && <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[#1A1A1A] block mb-1.5">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder="you@example.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#06C167]" />
          </div>
          <div>
            <label className="text-sm font-medium text-[#1A1A1A] block mb-1.5">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#06C167]" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-[#06C167] text-white py-3.5 rounded-2xl font-semibold hover:bg-[#049652] transition-colors disabled:opacity-60 mt-2">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-[#6B6B6B] mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="text-[#06C167] font-semibold hover:underline">Sign up</Link>
        </p>

        <div className="mt-4 p-3 bg-gray-50 rounded-xl text-xs text-[#6B6B6B] text-center">
          Demo: test@communieats.com / password123
        </div>
      </div>
    </div>
  )
}
