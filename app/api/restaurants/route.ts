import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { RESTAURANTS } from '@/lib/mock-data'

export async function GET() {
  try {
    const supabase = createServiceClient()

    const { data, error } = await supabase
      .from('restaurants')
      .select(`
        *,
        restaurant_order_counts (
          count,
          pending_community_courier_count
        )
      `)
      .eq('is_open', true)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(RESTAURANTS)
    }

    if (!data || data.length === 0) {
      return NextResponse.json(RESTAURANTS)
    }

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
        distance: distances[i] || `${(0.3 + i * 0.2).toFixed(1)} mi`,
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
    console.error('Restaurants fetch error:', e)
    return NextResponse.json(RESTAURANTS)
  }
}
