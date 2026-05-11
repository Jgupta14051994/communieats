import Link from 'next/link'
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-[#06C167] mb-2">404</h2>
        <p className="text-xl font-semibold text-[#1A1A1A] mb-2">Page not found</p>
        <p className="text-[#6B6B6B] text-sm mb-6">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/" className="bg-[#06C167] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#049652] transition-colors">
          Back to Home
        </Link>
      </div>
    </div>
  )
}
