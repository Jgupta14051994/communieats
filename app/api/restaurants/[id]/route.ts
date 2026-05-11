import { NextResponse } from 'next/server'
import { RESTAURANTS, MENU_ITEMS } from '@/lib/mock-data'
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const restaurant = RESTAURANTS.find(r => r.id === id)
  if (!restaurant) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const menu = MENU_ITEMS.filter(m => m.restaurantId === id)
  return NextResponse.json({ restaurant, menu })
}
