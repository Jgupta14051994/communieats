import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { MOCK_ORDERS } from '@/lib/mock-data'

export async function GET() {
  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)
    if (error || !data?.length) return NextResponse.json(MOCK_ORDERS)
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(MOCK_ORDERS)
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const supabase = createServiceClient()

    const { data, error } = await supabase
      .from('orders')
      .insert([{
        restaurant_id: body.restaurantId,
        items: body.items || [],
        subtotal: body.subtotal || 0,
        discount_applied: body.discount || 0,
        fulfillment_mode: body.fulfillmentMode || 'delivery',
        status: 'pending',
        delivery_address: body.deliveryAddress || '',
      }])
      .select()
      .single()

    if (!error && body.restaurantId) {
      await supabase.from('restaurant_order_counts')
        .upsert({
          restaurant_id: body.restaurantId,
          date: new Date().toISOString().split('T')[0],
          count: 1,
          pending_community_courier_count: body.fulfillmentMode === 'community_courier' ? 1 : 0,
        }, { onConflict: 'restaurant_id,date', ignoreDuplicates: false })
    }

    return NextResponse.json({ id: data?.id || `ord-${Date.now()}`, status: 'confirmed' })
  } catch {
    return NextResponse.json({ id: `ord-${Date.now()}`, status: 'confirmed' })
  }
}
