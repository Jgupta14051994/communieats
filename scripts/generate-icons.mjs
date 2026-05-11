import { createCanvas } from 'canvas'
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const sizes = [72, 96, 128, 144, 152, 192, 384, 512, 1024]
const splashSizes = [
  [640, 1136], [750, 1334], [1125, 2436], [1242, 2208],
  [1536, 2048], [1668, 2388], [2048, 2732]
]

mkdirSync('public/icons', { recursive: true })
mkdirSync('public/splash', { recursive: true })

// Generate app icons
for (const size of sizes) {
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext('2d')

  // Background
  ctx.fillStyle = '#06C167'
  roundRect(ctx, 0, 0, size, size, size * 0.2)
  ctx.fill()

  // Leaf icon (simplified)
  ctx.fillStyle = '#FFFFFF'
  const scale = size / 100
  ctx.save()
  ctx.scale(scale, scale)

  // Draw a fork + leaf shape
  ctx.beginPath()
  ctx.arc(50, 40, 22, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#06C167'
  ctx.beginPath()
  ctx.arc(50, 40, 14, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(46, 54, 8, 20)
  ctx.restore()

  const buffer = canvas.toBuffer('image/png')
  writeFileSync(join('public/icons', `icon-${size}.png`), buffer)
  console.log(`Generated icon-${size}.png`)
}

// Generate splash screens
for (const [w, h] of splashSizes) {
  const canvas = createCanvas(w, h)
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#06C167'
  ctx.fillRect(0, 0, w, h)

  // Logo circle
  const cx = w / 2, cy = h / 2
  const r = Math.min(w, h) * 0.12

  ctx.fillStyle = '#FFFFFF'
  ctx.beginPath()
  ctx.arc(cx, cy - r * 0.5, r, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#06C167'
  ctx.beginPath()
  ctx.arc(cx, cy - r * 0.5, r * 0.6, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(cx - r * 0.15, cy - r * 0.5 + r * 0.6, r * 0.3, r * 0.8)

  // App name
  ctx.fillStyle = '#FFFFFF'
  ctx.font = `bold ${Math.round(r * 0.8)}px Arial`
  ctx.textAlign = 'center'
  ctx.fillText('CommuniEats', cx, cy + r * 1.2)

  ctx.font = `${Math.round(r * 0.35)}px Arial`
  ctx.fillStyle = 'rgba(255,255,255,0.8)'
  ctx.fillText('Food delivery with a community soul', cx, cy + r * 1.8)

  const buffer = canvas.toBuffer('image/png')
  writeFileSync(join('public/splash', `splash-${w}x${h}.png`), buffer)
  console.log(`Generated splash-${w}x${h}.png`)
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}
