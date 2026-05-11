'use client'
import Link from 'next/link'
import { ShoppingCart, Leaf } from 'lucide-react'
import { useCartStore } from '@/lib/store'

export default function Navbar() {
  const count = useCartStore(s => s.getItemCount())
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
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
        <Link href="/cart" className="relative p-2">
          <ShoppingCart className="w-6 h-6 text-[#1A1A1A]" />
          {count > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#06C167] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{count}</span>
          )}
        </Link>
      </div>
    </nav>
  )
}
