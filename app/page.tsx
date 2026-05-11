'use client'
import { useState, useMemo, useEffect } from 'react'
import { Search } from 'lucide-react'
import RestaurantCard from '@/components/RestaurantCard'
import { RESTAURANTS as MOCK_RESTAURANTS } from '@/lib/mock-data'
import type { Restaurant } from '@/lib/mock-data'

type SortMode = 'popular' | 'nearest' | 'rating' | 'fastest'

const sortOptions: { id: SortMode; label: string }[] = [
  { id: 'popular', label: '🔥 Most Popular' },
  { id: 'nearest', label: '📍 Nearest' },
  { id: 'rating', label: '⭐ Top Rated' },
  { id: 'fastest', label: '⚡ Fastest' },
]

export default function HomePage() {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortMode>('popular')
  const [restaurants, setRestaurants] = useState<Restaurant[]>(MOCK_RESTAURANTS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/restaurants')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setRestaurants(data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    let list = [...restaurants]
    if (search) list = list.filter(r =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(search.toLowerCase())
    )
    if (sort === 'popular') list.sort((a, b) => b.orderCount - a.orderCount)
    if (sort === 'nearest') list.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
    if (sort === 'rating') list.sort((a, b) => b.rating - a.rating)
    if (sort === 'fastest') list.sort((a, b) => a.deliveryTime - b.deliveryTime)
    return list
  }, [restaurants, search, sort])

  const trending = useMemo(() => restaurants.filter(r => r.orderCount > 200).slice(0, 5), [restaurants])

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#06C167] to-[#049652] rounded-3xl p-6 mb-6 text-white">
        <h1 className="text-2xl font-bold mb-1">Food delivered fast,<br />by your community 🌱</h1>
        <p className="text-green-100 text-sm">Pick up your order + deliver a neighbor&apos;s. Earn up to 30% off.</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B6B]" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search restaurants or cuisines..."
          className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#06C167]"
        />
      </div>

      {/* Sort Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
        {sortOptions.map(opt => (
          <button key={opt.id} onClick={() => setSort(opt.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              sort === opt.id ? 'bg-[#06C167] text-white' : 'bg-white text-[#6B6B6B] border border-gray-200 hover:border-gray-300'
            }`}>
            {opt.label}
          </button>
        ))}
      </div>

      {/* Trending */}
      {!search && trending.length > 0 && (
        <div className="mb-6">
          <h2 className="font-bold text-[#1A1A1A] text-lg mb-3">🔥 Trending Near You</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {trending.map(r => (
              <a key={r.id} href={`/restaurant/${r.id}`}
                className="flex-shrink-0 flex items-center gap-2 bg-white rounded-2xl px-4 py-2 border border-gray-200 hover:border-[#06C167] transition-colors">
                <span className="text-sm font-medium text-[#1A1A1A]">{r.name}</span>
                <span className="text-xs text-orange-500 font-bold">{r.orderCount}+</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Grid */}
      <h2 className="font-bold text-[#1A1A1A] text-lg mb-3">
        {search ? `Results for "${search}"` : 'All Restaurants'}
      </h2>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="h-44 bg-gray-200 animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-[#6B6B6B]">No restaurants found. Try a different search.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(r => <RestaurantCard key={r.id} restaurant={r} />)}
        </div>
      )}
    </div>
  )
}
