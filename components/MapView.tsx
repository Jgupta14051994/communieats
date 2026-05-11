'use client'
import { useEffect, useRef } from 'react'
import { RESTAURANTS } from '@/lib/mock-data'
import type { Restaurant } from '@/lib/mock-data'

interface MapViewProps {
  restaurants?: Restaurant[]
}

export default function MapView({ restaurants }: MapViewProps) {
  const initialized = useRef(false)
  const data = restaurants && restaurants.length > 0 ? restaurants : RESTAURANTS

  useEffect(() => {
    if (typeof window === 'undefined' || initialized.current) return
    initialized.current = true

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)

    import('leaflet').then((L) => {
      const mapEl = document.getElementById('map') as HTMLElement & { _leaflet_id?: number }
      if (!mapEl || mapEl._leaflet_id) return

      const map = L.map('map').setView([40.73, -74.00], 13)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map)

      data.forEach(r => {
        const color = r.orderCount > 300 ? '#FF6B2C' : r.orderCount > 150 ? '#06C167' : '#00B4D8'
        const radius = Math.max(100, Math.min(r.orderCount * 0.8, 400))
        const circle = L.circle([r.lat, r.lng], { radius, color, fillColor: color, fillOpacity: 0.35, weight: 2 }).addTo(map)
        circle.bindPopup(`
          <div style="font-family: system-ui, sans-serif; min-width: 180px">
            <strong style="font-size: 14px">${r.name}</strong>
            <p style="color: #6B6B6B; font-size: 12px; margin: 4px 0">${r.cuisine} • ${r.rating}★</p>
            <p style="color: #FF6B2C; font-size: 12px; margin: 0">🔥 ${r.orderCount} orders today</p>
            ${r.pendingCourierOrders > 0 ? `<p style="color: #00B4D8; font-size: 12px; margin: 4px 0">👥 ${r.pendingCourierOrders} awaiting courier</p>` : ''}
            <a href="/restaurant/${r.id}" style="display:inline-block;margin-top:8px;background:#06C167;color:white;padding:6px 12px;border-radius:99px;font-size:12px;font-weight:600;text-decoration:none">Order now</a>
          </div>
        `)
      })
    })
  }, [data])

  return <div id="map" className="w-full h-full rounded-2xl" style={{ minHeight: '400px' }} />
}
