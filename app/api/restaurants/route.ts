import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { RESTAURANTS } from '@/lib/mock-data'

export async function GET() {
  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('restaurants')
      .select('*, restaurant_order_counts(count, pending_community_courier_count)')
      .eq('is_open', true)

    if (error || !data?.length) return NextResponse.json(RESTAURANTS)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapped = data.map((r: any, i: number) => ({
      id: r.id,
      name: r.name,
      cuisine: r.cuisine_type,
      rating: Number(r.rating),
      deliveryTime: r.avg_delivery_time,
      distance: `${(0.3 + i * 0.25).toFixed(1)} mi`,
      orderCount: r.restaurant_order_counts?.[0]?.count ?? 0,
      pendingCourierOrders: r.restaurant_order_counts?.[0]?.pending_community_courier_count ?? 0,
      image: r.image_url,
      address: r.address,
      lat: Number(r.lat),
      lng: Number(r.lng),
      isOpen: r.is_open,
    }))

    return NextResponse.json(mapped)
  } catch {
    return NextResponse.json(RESTAURANTS)
  }
}
