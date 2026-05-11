import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { RESTAURANTS, MENU_ITEMS } from '@/lib/mock-data'

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const supabase = createServiceClient()
    const [{ data: r }, { data: menu }] = await Promise.all([
      supabase
        .from('restaurants')
        .select('*, restaurant_order_counts(count, pending_community_courier_count)')
        .eq('id', id)
        .single(),
      supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', id)
        .eq('is_available', true),
    ])

    if (!r) {
      const mock = RESTAURANTS.find(x => x.id === id) || RESTAURANTS[0]
      return NextResponse.json({ restaurant: mock, menu: MENU_ITEMS.filter(m => m.restaurantId === id) })
    }

    return NextResponse.json({
      restaurant: {
        id: r.id, name: r.name, cuisine: r.cuisine_type,
        rating: Number(r.rating), deliveryTime: r.avg_delivery_time,
        distance: '0.8 mi',
        orderCount: r.restaurant_order_counts?.[0]?.count ?? 0,
        pendingCourierOrders: r.restaurant_order_counts?.[0]?.pending_community_courier_count ?? 0,
        image: r.image_url, address: r.address,
        lat: Number(r.lat), lng: Number(r.lng), isOpen: r.is_open,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      menu: (menu || []).map((m: any) => ({
        id: m.id, restaurantId: m.restaurant_id, name: m.name,
        description: m.description, price: Number(m.price),
        image: m.image_url, category: m.category, isPopular: m.is_popular,
      })),
    })
  } catch {
    const mock = RESTAURANTS.find(x => x.id === id) || RESTAURANTS[0]
    return NextResponse.json({ restaurant: mock, menu: MENU_ITEMS.filter(m => m.restaurantId === id) })
  }
}
