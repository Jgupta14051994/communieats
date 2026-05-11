'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ShoppingCart, Leaf, User, LogOut } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export default function Navbar() {
  const count = useCartStore(s => s.getItemCount())
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Leaf className="w-6 h-6 text-[#06C167]" />
          <span className="text-xl font-bold text-[#1A1A1A]">CommuniEats</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {[['/', 'Home'], ['/map', 'Map'], ['/orders', 'Orders'], ['/profile', 'Profile']].map(([href, label]) => (
            <Link key={href} href={href} className="text-sm font-medium text-[#6B6B6B] hover:text-[#06C167] transition-colors">{label}</Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden md:block text-sm text-[#6B6B6B]">{user.user_metadata?.name || user.email?.split('@')[0]}</span>
              <button onClick={handleSignOut} className="p-2 text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link href="/auth/login" className="hidden md:flex items-center gap-1.5 text-sm font-medium text-[#06C167] hover:text-[#049652] transition-colors">
              <User className="w-4 h-4" />Sign In
            </Link>
          )}
          <Link href="/cart" className="relative p-2">
            <ShoppingCart className="w-6 h-6 text-[#1A1A1A]" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#06C167] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{count}</span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  )
}
