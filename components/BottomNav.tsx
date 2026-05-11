'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Map, ClipboardList, User, ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/lib/store'

export default function BottomNav() {
  const pathname = usePathname()
  const count = useCartStore(s => s.getItemCount())

  const links = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/map', icon: Map, label: 'Map' },
    { href: '/cart', icon: ShoppingCart, label: 'Cart', badge: count > 0 ? count : null },
    { href: '/orders', icon: ClipboardList, label: 'Orders' },
    { href: '/profile', icon: User, label: 'Profile' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 md:hidden z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="grid grid-cols-5 h-16">
        {links.map(({ href, icon: Icon, label, badge }) => {
          const active = pathname === href
          return (
            <Link key={href} href={href} className={`flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors relative ${active ? 'text-[#06C167]' : 'text-[#6B6B6B]'}`}>
              <div className="relative">
                <Icon className="w-5 h-5" />
                {badge != null && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#06C167] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                    {badge > 9 ? '9+' : badge}
                  </span>
                )}
              </div>
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
