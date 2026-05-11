'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Map, ClipboardList, User } from 'lucide-react'

const links = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/map', icon: Map, label: 'Map' },
  { href: '/orders', icon: ClipboardList, label: 'Orders' },
  { href: '/profile', icon: User, label: 'Profile' },
]

export default function BottomNav() {
  const pathname = usePathname()
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 md:hidden z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="grid grid-cols-4 h-16">
        {links.map(({ href, icon: Icon, label }) => {
          const active = pathname === href
          return (
            <Link key={href} href={href} className={`flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors ${active ? 'text-[#06C167]' : 'text-[#6B6B6B]'}`}>
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
