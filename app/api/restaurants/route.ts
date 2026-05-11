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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapped = data.map((r: any, i: number) => {
      const counts = Array.isArray(r.restaurant_order_counts)
        ? r.restaurant_order_counts[0]
        : r.restaurant_order_counts
      return {
        id: r.id,
        name: r.name,
        cuisine: r.cuisine_type,
        rating: Number(r.rating),
        deliveryTime: r.avg_delivery_time,
        distance: distances[i] || '1.0 mi',
        orderCount: counts?.count ?? 0,
        pendingCourierOrders: counts?.pending_community_courier_count ?? 0,
        image: r.image_url,
        address: r.address,
        lat: Number(r.lat),
        lng: Number(r.lng),
        isOpen: r.is_open,
      }
    })

    return NextResponse.json(mapped)
  } catch (e) {
    console.error('[GET /api/restaurants]', e)
    return NextResponse.json(RESTAURANTS)
  }
}
