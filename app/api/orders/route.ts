import { NextResponse } from 'next/server'
import { MOCK_ORDERS } from '@/lib/mock-data'
export async function GET() {
  return NextResponse.json(MOCK_ORDERS)
}
export async function POST(req: Request) {
  const body = await req.json()
  return NextResponse.json({ id: `ord-${Date.now()}`, status: 'confirmed', ...body })
}
