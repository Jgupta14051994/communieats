import type { Metadata, Viewport } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import BottomNav from '@/components/BottomNav'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#06C167',
}

export const metadata: Metadata = {
  title: 'CommuniEats — Food delivery with a community soul',
  description: 'Order food and earn discounts by being a Community Courier. Pick up your order and deliver a neighbor\'s on the way home.',
  keywords: ['food delivery', 'community', 'courier', 'restaurant', 'order food', 'eco delivery'],
  authors: [{ name: 'CommuniEats' }],
  creator: 'CommuniEats',
  publisher: 'CommuniEats',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'CommuniEats',
    startupImage: [
      { url: '/splash/splash-2048x2732.png', media: '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)' },
      { url: '/splash/splash-1668x2388.png', media: '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)' },
      { url: '/splash/splash-1536x2048.png', media: '(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)' },
      { url: '/splash/splash-1125x2436.png', media: '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)' },
      { url: '/splash/splash-1242x2208.png', media: '(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)' },
      { url: '/splash/splash-750x1334.png', media: '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)' },
      { url: '/splash/splash-640x1136.png', media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://communieats.vercel.app',
    title: 'CommuniEats — Food delivery with a community soul',
    description: 'Order food and earn discounts by being a Community Courier.',
    siteName: 'CommuniEats',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'CommuniEats' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CommuniEats',
    description: 'Community-powered food delivery',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-96.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-72.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className="min-h-screen bg-[#F6F6F6]">
        <Navbar />
        <main className="pb-20 md:pb-0">{children}</main>
        <BottomNav />
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js').catch(function() {});
            });
          }
        ` }} />
      </body>
    </html>
  )
}
