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
  const [appleLoading, setAppleLoading] = useState(false)

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

  const handleAppleSignIn = async () => {
    setAppleLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${window.location.origin}/`,
        scopes: 'name email',
      },
    })
    if (error) {
      setError(error.message)
      setAppleLoading(false)
    }
    // On success, Supabase redirects — no further action needed
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

        {/* Sign in with Apple — required by Apple App Store guidelines */}
        <button
          onClick={handleAppleSignIn}
          disabled={appleLoading}
          className="w-full flex items-center justify-center gap-3 bg-[#1A1A1A] text-white py-3.5 rounded-2xl font-semibold hover:bg-black transition-colors disabled:opacity-60 mb-4"
        >
          {/* Apple logo SVG */}
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
          {appleLoading ? 'Signing in…' : 'Sign in with Apple'}
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-[#6B6B6B]">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

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
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-[#6B6B6B] mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="text-[#06C167] font-semibold hover:underline">Sign up</Link>
        </p>

        {/* Test credentials for App Store review team */}
        <div className="mt-4 p-3 bg-gray-50 rounded-xl text-xs text-[#6B6B6B] text-center">
          Reviewer demo: test@communieats.app / Review2026!
        </div>
      </div>
    </div>
  )
}
