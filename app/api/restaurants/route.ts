import { NextResponse } from 'next/server'
import { RESTAURANTS } from '@/lib/mock-data'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !anonKey) return NextResponse.json(RESTAURANTS)

    const res = await fetch(
      `${supabaseUrl}/rest/v1/restaurants?select=*,restaurant_order_counts(count,pending_community_courier_count)&is_open=eq.true`,
      {
        headers: {
          'apikey': anonKey,
          'Authorization': `Bearer ${anonKey}`,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 30 },
      }
    )

    if (!res.ok) return NextResponse.json(RESTAURANTS)

    const data = await res.json()
    if (!Array.isArray(data) || data.length === 0) return NextResponse.json(RESTAURANTS)

    const distances = ['0.3 mi', '0.5 mi', '0.7 mi', '0.8 mi', '0.9 mi', '1.0 mi', '1.1 mi', '1.2 mi', '1.3 mi', '1.5 mi', '1.8 mi', '2.1 mi']
    const FALLBACK_IMAGES = [
      'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80',
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80',
      'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80',
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&q=80',
    ]

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapped = data.map((r: any, i: number) => {
      const counts = Array.isArray(r.restaurant_order_counts)
        ? r.restaurant_order_counts[0]
        : r.restaurant_order_counts
      return {
        id: r.id,
        name: r.name,
        cuisine: r.cuisine_type,
        rating: Number(r.rating) || 4.5,
        deliveryTime: r.avg_delivery_time || 30,
        distance: distances[i] || '1.0 mi',
        orderCount: counts?.count ?? Math.floor(Math.random() * 200 + 50),
        pendingCourierOrders: counts?.pending_community_courier_count ?? Math.floor(Math.random() * 5),
        image: r.image_url || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length],
        address: r.address || 'NYC',
        lat: Number(r.lat) || 40.73 + (Math.random() - 0.5) * 0.05,
        lng: Number(r.lng) || -74.00 + (Math.random() - 0.5) * 0.05,
        isOpen: r.is_open ?? true,
      }
    })

    return NextResponse.json(mapped)
  } catch (e) {
    console.error('[GET /api/restaurants]', e)
    return NextResponse.json(RESTAURANTS)
  }
}
