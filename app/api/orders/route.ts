import { NextResponse } from 'next/server'
import { MOCK_ORDERS } from '@/lib/mock-data'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseUrl || !anonKey) return NextResponse.json(MOCK_ORDERS)

    const res = await fetch(
      `${supabaseUrl}/rest/v1/orders?select=*&order=created_at.desc&limit=20`,
      { headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` } }
    )
    const data = await res.json()
    if (!Array.isArray(data) || data.length === 0) return NextResponse.json(MOCK_ORDERS)
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(MOCK_ORDERS)
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseUrl || !anonKey) return NextResponse.json({ id: `ord-${Date.now()}`, status: 'confirmed' })

    const res = await fetch(`${supabaseUrl}/rest/v1/orders`, {
      method: 'POST',
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({
        restaurant_id: body.restaurantId || null,
        items: body.items || [],
        subtotal: body.subtotal || 0,
        discount_applied: body.discount || 0,
        fulfillment_mode: body.fulfillmentMode || 'delivery',
        status: 'pending',
        delivery_address: body.deliveryAddress || '',
      }),
    })

    const data = await res.json()
    const order = Array.isArray(data) ? data[0] : data
    return NextResponse.json({ id: order?.id || `ord-${Date.now()}`, status: 'confirmed' })
  } catch {
    return NextResponse.json({ id: `ord-${Date.now()}`, status: 'confirmed' })
  }
}
