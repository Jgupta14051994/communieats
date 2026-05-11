'use client'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ShoppingCart, Leaf, User, LogOut, Bell, X, Package, Tag, HeartHandshake } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/lib/store'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

const NOTIFICATIONS = [
  { id: 1, icon: HeartHandshake, color: 'text-[#06C167]', bg: 'bg-green-50', title: '2 neighbors need a courier', body: 'Nearby restaurants have pending orders.', time: '2m ago', unread: true },
  { id: 2, icon: Tag, color: 'text-[#FF6B2C]', bg: 'bg-orange-50', title: 'Promo: WELCOME10', body: '10% off your next order. Valid today only!', time: '1h ago', unread: true },
  { id: 3, icon: Package, color: 'text-[#00B4D8]', bg: 'bg-blue-50', title: 'Order delivered', body: 'Your last order was delivered successfully.', time: '3h ago', unread: false },
]

export default function Navbar() {
  const count = useCartStore(s => s.getItemCount())
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [showNotifs, setShowNotifs] = useState(false)
  const [readIds, setReadIds] = useState<number[]>([])
  const notifRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifs(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const unreadCount = NOTIFICATIONS.filter(n => !readIds.includes(n.id) && n.unread).length

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

        <div className="flex items-center gap-2">
          {/* Notifications bell */}
          <div className="relative" ref={notifRef}>
            <button onClick={() => { setShowNotifs(!showNotifs); setReadIds(NOTIFICATIONS.map(n => n.id)) }}
              className="relative p-2 text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#FF6B2C] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifs && (
                <motion.div initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }} transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <h3 className="font-semibold text-[#1A1A1A] text-sm">Notifications</h3>
                    <button onClick={() => setShowNotifs(false)} className="text-[#6B6B6B] hover:text-[#1A1A1A]">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {NOTIFICATIONS.map((n, i) => {
                    const Icon = n.icon
                    const isRead = readIds.includes(n.id)
                    return (
                      <div key={n.id} className={`flex items-start gap-3 px-4 py-3 ${!isRead && n.unread ? 'bg-blue-50/50' : 'bg-white'} ${i < NOTIFICATIONS.length - 1 ? 'border-b border-gray-100' : ''}`}>
                        <div className={`w-9 h-9 rounded-xl ${n.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <Icon className={`w-4 h-4 ${n.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[#1A1A1A] text-sm">{n.title}</p>
                          <p className="text-xs text-[#6B6B6B] mt-0.5 leading-relaxed">{n.body}</p>
                          <p className="text-xs text-[#6B6B6B] mt-1">{n.time}</p>
                        </div>
                        {!isRead && n.unread && <div className="w-2 h-2 rounded-full bg-[#06C167] mt-1.5 flex-shrink-0" />}
                      </div>
                    )
                  })}
                  <div className="px-4 py-3 bg-gray-50">
                    <p className="text-xs text-[#6B6B6B] text-center">You&apos;re all caught up 🎉</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Auth */}
          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm text-[#6B6B6B]">{user.user_metadata?.name || user.email?.split('@')[0]}</span>
              <button onClick={handleSignOut} className="p-2 text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors" title="Sign out">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link href="/auth/login" className="hidden md:flex items-center gap-1.5 text-sm font-medium text-[#06C167] hover:text-[#049652] transition-colors">
              <User className="w-4 h-4" />Sign In
            </Link>
          )}

          {/* Cart */}
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
