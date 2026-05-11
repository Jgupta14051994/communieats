import { NextResponse } from 'next/server'
import { NEIGHBOR_ORDERS } from '@/lib/mock-data'
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const restaurantId = searchParams.get('restaurantId')
  const orders = restaurantId ? NEIGHBOR_ORDERS.filter(o => o.restaurantId === restaurantId) : NEIGHBOR_ORDERS
  return NextResponse.json(orders)
}
