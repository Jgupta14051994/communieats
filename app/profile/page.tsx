'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Leaf, Award, TrendingUp, DollarSign, Users, LogOut, Settings, ChevronRight, Bell, Shield, HelpCircle, Star } from 'lucide-react'
import { MOCK_USER, LEADERBOARD } from '@/lib/mock-data'
import { createClient } from '@/lib/supabase/client'

function AnimatedNumber({ target, decimals = 0 }: { target: number; decimals?: number }) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    const step = target / 60
    let current = 0
    const timer = setInterval(() => {
      current = Math.min(current + step, target)
      setValue(current)
      if (current >= target) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [target])
  return <>{decimals > 0 ? value.toFixed(decimals) : Math.floor(value)}</>
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState(MOCK_USER)
  const [isAuthed, setIsAuthed] = useState(false)
  const [activeTab, setActiveTab] = useState<'stats' | 'settings'>('stats')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        setIsAuthed(true)
        const { data: prof } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()
        if (prof) {
          setProfile({
            name: prof.name || data.user.email?.split('@')[0] || 'User',
            email: data.user.email || '',
            avatar: prof.avatar_url || MOCK_USER.avatar,
            community_points: prof.community_points || 0,
            total_co2_saved: prof.total_co2_saved || 0,
            deliveries_completed: prof.deliveries_completed || 0,
            discount_earned: prof.discount_earned || 0,
            tier: prof.community_points > 1000 ? 'Community Hero' : prof.community_points > 500 ? 'Rising Star' : 'New Member',
            rank: 99,
          })
        }
      }
    })
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const user = profile
  const progressToNext = (user.community_points % 500) / 500
  const circumference = 2 * Math.PI * 40

  const settingsGroups = [
    {
      title: 'Preferences',
      items: [
        { icon: Bell, label: 'Notifications', desc: 'Order updates, promos', action: () => {} },
        { icon: Shield, label: 'Privacy & Data', desc: 'Manage your data', action: () => router.push('/privacy') },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help & Support', desc: 'FAQs and contact', action: () => router.push('/support') },
        { icon: Star, label: 'Rate the App', desc: 'Leave a review', action: () => {} },
      ],
    },
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 mb-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
            <Image src={user.avatar} alt={user.name} fill className="object-cover" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-[#1A1A1A]">{user.name}</h1>
            <p className="text-[#6B6B6B] text-sm">{user.email}</p>
            <span className="inline-flex items-center gap-1 bg-green-50 text-[#06C167] text-xs font-bold px-2 py-1 rounded-full mt-1">
              <Award className="w-3 h-3" />{user.tier}
            </span>
          </div>
          <svg width="88" height="88" className="flex-shrink-0">
            <circle cx="44" cy="44" r="40" fill="none" stroke="#F6F6F6" strokeWidth="8" />
            <circle cx="44" cy="44" r="40" fill="none" stroke="#06C167" strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progressToNext)}
              strokeLinecap="round" transform="rotate(-90 44 44)"
              className="transition-all duration-1000" />
            <text x="44" y="48" textAnchor="middle" fill="#1A1A1A" fontSize="11" fontWeight="bold">
              {user.community_points}pts
            </text>
          </svg>
        </div>
        {!isAuthed && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-[#6B6B6B]">Sign in for your real stats</p>
            <button onClick={() => router.push('/auth/login')}
              className="text-sm font-semibold text-white bg-[#06C167] px-4 py-2 rounded-full hover:bg-[#049652] transition-colors">
              Sign In
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {(['stats', 'settings'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 rounded-2xl text-sm font-semibold transition-colors capitalize ${
              activeTab === tab ? 'bg-[#06C167] text-white' : 'bg-white text-[#6B6B6B] border border-gray-200 hover:border-gray-300'
            }`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'stats' && (
        <>
          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { icon: Leaf, label: 'CO₂ Saved', value: <><AnimatedNumber target={user.total_co2_saved} decimals={1} />kg</>, color: '#2D6A4F', bg: 'bg-green-50' },
              { icon: Users, label: 'Deliveries', value: <><AnimatedNumber target={user.deliveries_completed} /></>, color: '#00B4D8', bg: 'bg-blue-50' },
              { icon: DollarSign, label: 'Saved', value: <>$<AnimatedNumber target={user.discount_earned} decimals={2} /></>, color: '#06C167', bg: 'bg-green-50' },
              { icon: TrendingUp, label: 'Rank', value: <>#{user.rank}</>, color: '#FF6B2C', bg: 'bg-orange-50' },
            ].map(({ icon: Icon, label, value, color, bg }) => (
              <div key={label} className={`${bg} rounded-2xl p-4`}>
                <Icon className="w-5 h-5 mb-2" style={{ color }} />
                <p className="text-2xl font-bold text-[#1A1A1A]">{value}</p>
                <p className="text-xs text-[#6B6B6B] mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Leaderboard */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h2 className="font-bold text-[#1A1A1A] mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-[#FF6B2C]" />Top Community Couriers
            </h2>
            <div className="space-y-3">
              {LEADERBOARD.map(entry => (
                <div key={entry.rank} className={`flex items-center gap-3 p-2 rounded-xl ${entry.rank <= 3 ? 'bg-orange-50' : ''}`}>
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                    entry.rank === 1 ? 'bg-yellow-400 text-white' :
                    entry.rank === 2 ? 'bg-gray-300 text-white' :
                    entry.rank === 3 ? 'bg-orange-400 text-white' : 'bg-gray-100 text-[#6B6B6B]'
                  }`}>{entry.rank}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-[#1A1A1A] text-sm">{entry.name}</p>
                    <p className="text-xs text-[#6B6B6B]">{entry.deliveries} deliveries · {entry.co2}kg CO₂</p>
                  </div>
                  <span className="text-[#06C167] font-bold text-sm">{entry.points}pts</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-4">
          {settingsGroups.map(group => (
            <div key={group.title} className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <p className="px-4 pt-4 pb-2 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">{group.title}</p>
              {group.items.map(({ icon: Icon, label, desc, action }, i) => (
                <button key={label} onClick={action}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                    i < group.items.length - 1 ? 'border-b border-gray-100' : ''
                  }`}>
                  <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-[#6B6B6B]" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-[#1A1A1A] text-sm">{label}</p>
                    <p className="text-xs text-[#6B6B6B]">{desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              ))}
            </div>
          ))}

          {/* Legal links */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <p className="px-4 pt-4 pb-2 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Legal</p>
            {[['Privacy Policy', '/privacy'], ['Terms of Service', '/terms']].map(([label, href], i) => (
              <button key={label} onClick={() => router.push(href)}
                className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-sm text-[#1A1A1A] ${i === 0 ? 'border-b border-gray-100' : ''}`}>
                {label}<ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            ))}
          </div>

          {/* Sign out */}
          {isAuthed ? (
            <button onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 bg-red-50 border border-red-100 text-red-600 py-4 rounded-2xl font-semibold hover:bg-red-100 transition-colors">
              <LogOut className="w-4 h-4" />Sign Out
            </button>
          ) : (
            <button onClick={() => router.push('/auth/login')}
              className="w-full flex items-center justify-center gap-2 bg-[#06C167] text-white py-4 rounded-2xl font-semibold hover:bg-[#049652] transition-colors">
              Sign In to Your Account
            </button>
          )}

          <p className="text-center text-xs text-[#6B6B6B] pb-4">CommuniEats v1.0.0 · Made with 🌱</p>
        </div>
      )}
    </div>
  )
}
