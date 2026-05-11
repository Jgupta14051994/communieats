import { NextResponse } from 'next/server'
import { NEIGHBOR_ORDERS } from '@/lib/mock-data'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const restaurantId = searchParams.get('restaurantId')

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (supabaseUrl && anonKey) {
      let url = `${supabaseUrl}/rest/v1/orders?select=*&fulfillment_mode=eq.community_courier&status=eq.pending`
      if (restaurantId) url += `&restaurant_id=eq.${restaurantId}`
      url += '&limit=10'

      const res = await fetch(url, {
        headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` },
        next: { revalidate: 10 },
      })

      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((o: Record<string, unknown>, i: number) => ({
            id: o.id,
            restaurantId: o.restaurant_id,
            boxes: Array.isArray(o.items) ? (o.items as {quantity?: number}[]).reduce((s, item) => s + (item.quantity || 1), 0) : 1,
            distance: ['0.4 mi', '0.7 mi', '1.0 mi', '1.3 mi'][i % 4],
            reward: Number(((o.subtotal as number) || 15) * 0.15),
          }))
          return NextResponse.json(mapped)
        }
      }
    }
  } catch {}

  const orders = restaurantId
    ? NEIGHBOR_ORDERS.filter(o => o.restaurantId === restaurantId)
    : NEIGHBOR_ORDERS
  return NextResponse.json(orders)
}
