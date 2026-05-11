import { NextResponse } from 'next/server'
import { RESTAURANTS } from '@/lib/mock-data'
export async function GET() {
  return NextResponse.json(RESTAURANTS)
}
