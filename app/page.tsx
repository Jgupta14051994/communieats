'use client'
import { useState, useMemo, useEffect } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import RestaurantCard from '@/components/RestaurantCard'
import { RESTAURANTS as MOCK_RESTAURANTS } from '@/lib/mock-data'
import type { Restaurant } from '@/lib/mock-data'

type SortMode = 'popular' | 'nearest' | 'rating' | 'fastest'
type DietaryFilter = 'Vegan' | 'Vegetarian' | 'Halal' | 'Gluten-Free'

const sortOptions: { id: SortMode; label: string }[] = [
  { id: 'popular', label: '🔥 Popular' },
  { id: 'nearest', label: '📍 Nearest' },
  { id: 'rating', label: '⭐ Top Rated' },
  { id: 'fastest', label: '⚡ Fastest' },
]

const dietaryOptions: DietaryFilter[] = ['Vegan', 'Vegetarian', 'Halal', 'Gluten-Free']

const DIETARY_CUISINES: Record<DietaryFilter, string[]> = {
  'Vegan': ['Mediterranean', 'Thai', 'Indian', 'Vietnamese'],
  'Vegetarian': ['Indian', 'Mediterranean', 'Greek', 'Italian'],
  'Halal': ['Mediterranean', 'Indian', 'Greek', 'Korean'],
  'Gluten-Free': ['Japanese', 'Korean', 'Vietnamese', 'Mexican'],
}

export default function HomePage() {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortMode>('popular')
  const [dietary, setDietary] = useState<DietaryFilter[]>([])
  const [restaurants, setRestaurants] = useState<Restaurant[]>(MOCK_RESTAURANTS)
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetch('/api/restaurants')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) setRestaurants(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const toggleDietary = (f: DietaryFilter) =>
    setDietary(prev => prev.includes(f) ? prev.filter(d => d !== f) : [...prev, f])

  const filtered = useMemo(() => {
    let list = [...restaurants]
    if (search) list = list.filter(r =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(search.toLowerCase())
    )
    if (dietary.length > 0) {
      const allowedCuisines = new Set(dietary.flatMap(d => DIETARY_CUISINES[d]))
      list = list.filter(r => allowedCuisines.has(r.cuisine))
    }
    if (sort === 'popular') list.sort((a, b) => b.orderCount - a.orderCount)
    if (sort === 'nearest') list.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
    if (sort === 'rating') list.sort((a, b) => b.rating - a.rating)
    if (sort === 'fastest') list.sort((a, b) => a.deliveryTime - b.deliveryTime)
    return list
  }, [restaurants, search, sort, dietary])

  const trending = useMemo(() => restaurants.filter(r => r.orderCount > 200).slice(0, 5), [restaurants])
  const activeFilterCount = dietary.length

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#06C167] to-[#049652] rounded-3xl p-6 mb-6 text-white">
        <h1 className="text-2xl font-bold mb-1">Food delivered fast,<br />by your community 🌱</h1>
        <p className="text-green-100 text-sm mt-1">Pick up your order + carry a neighbor&apos;s. Earn up to 30% off.</p>
        <div className="flex gap-3 mt-4">
          <div className="bg-white/20 rounded-2xl px-3 py-2 text-center">
            <p className="text-xl font-bold">30%</p>
            <p className="text-xs opacity-80">max discount</p>
          </div>
          <div className="bg-white/20 rounded-2xl px-3 py-2 text-center">
            <p className="text-xl font-bold">0.4kg</p>
            <p className="text-xs opacity-80">CO₂ saved/trip</p>
          </div>
          <div className="bg-white/20 rounded-2xl px-3 py-2 text-center">
            <p className="text-xl font-bold">1.2k</p>
            <p className="text-xs opacity-80">community couriers</p>
          </div>
        </div>
      </motion.div>

      {/* Search + Filter */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B6B]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search restaurants or cuisines…"
            className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#06C167]"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-[#6B6B6B]" />
            </button>
          )}
        </div>
        <button onClick={() => setShowFilters(!showFilters)}
          className={`relative flex items-center gap-1.5 px-4 py-3 rounded-2xl border text-sm font-medium transition-colors ${
            showFilters || activeFilterCount > 0 ? 'bg-[#06C167] text-white border-[#06C167]' : 'bg-white text-[#6B6B6B] border-gray-200 hover:border-gray-300'
          }`}>
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-[#FF6B2C] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Dietary filters panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-4">
            <div className="bg-white rounded-2xl p-4 border border-gray-200">
              <p className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide mb-3">Dietary Preferences</p>
              <div className="flex flex-wrap gap-2">
                {dietaryOptions.map(f => (
                  <button key={f} onClick={() => toggleDietary(f)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                      dietary.includes(f) ? 'bg-[#06C167] text-white border-[#06C167]' : 'bg-white text-[#6B6B6B] border-gray-200 hover:border-gray-300'
                    }`}>
                    {f === 'Vegan' ? '🌱' : f === 'Vegetarian' ? '🥦' : f === 'Halal' ? '☪️' : '🌾'} {f}
                  </button>
                ))}
              </div>
              {activeFilterCount > 0 && (
                <button onClick={() => setDietary([])} className="mt-3 text-xs text-[#6B6B6B] hover:text-red-500 underline">
                  Clear filters
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
      {!search && dietary.length === 0 && trending.length > 0 && (
        <div className="mb-6">
          <h2 className="font-bold text-[#1A1A1A] text-lg mb-3">🔥 Trending Near You</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {trending.map(r => (
              <a key={r.id} href={`/restaurant/${r.id}`}
                className="flex-shrink-0 flex items-center gap-2 bg-white rounded-2xl px-4 py-2.5 border border-gray-200 hover:border-[#06C167] hover:shadow-sm transition-all">
                <span className="text-sm font-semibold text-[#1A1A1A]">{r.name}</span>
                <span className="text-xs text-orange-500 font-bold">{r.orderCount}+</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Grid header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold text-[#1A1A1A] text-lg">
          {search ? `Results for "${search}"` : dietary.length > 0 ? `${dietary.join(', ')} Restaurants` : 'All Restaurants'}
        </h2>
        {!loading && <span className="text-sm text-[#6B6B6B]">{filtered.length} places</span>}
      </div>

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
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🍽️</p>
          <h3 className="font-semibold text-[#1A1A1A] mb-1">No restaurants found</h3>
          <p className="text-[#6B6B6B] text-sm">Try a different search or adjust your filters.</p>
          {(search || dietary.length > 0) && (
            <button onClick={() => { setSearch(''); setDietary([]) }}
              className="mt-4 text-[#06C167] font-semibold text-sm hover:underline">
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(r => <RestaurantCard key={r.id} restaurant={r} />)}
        </div>
      )}
    </div>
  )
}
