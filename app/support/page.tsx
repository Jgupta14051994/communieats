import Link from 'next/link'
import { Mail, MessageCircle, FileText } from 'lucide-react'

export default function SupportPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">Help & Support</h1>
      <p className="text-[#6B6B6B] text-sm mb-8">We&apos;re here to help with any questions about CommuniEats.</p>

      <div className="space-y-4 mb-8">
        {[
          { icon: Mail, title: 'Email Support', desc: 'support@communieats.app', sub: 'Response within 24 hours', href: 'mailto:support@communieats.app' },
          { icon: MessageCircle, title: 'Community Forum', desc: 'communieats.vercel.app/community', sub: 'Ask the community', href: '#' },
          { icon: FileText, title: 'Privacy Policy', desc: 'Read our privacy policy', sub: 'How we handle your data', href: '/privacy' },
        ].map(({ icon: Icon, title, desc, sub, href }) => (
          <a key={title} href={href} className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Icon className="w-6 h-6 text-[#06C167]" />
            </div>
            <div>
              <p className="font-semibold text-[#1A1A1A]">{title}</p>
              <p className="text-[#06C167] text-sm">{desc}</p>
              <p className="text-[#6B6B6B] text-xs">{sub}</p>
            </div>
          </a>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="font-bold text-[#1A1A1A] mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            { q: 'How does Community Courier work?', a: 'When you choose to pick up your own order, you can also carry a neighbor\'s order from the same restaurant. You earn 20-30% off your meal and they get their food faster.' },
            { q: 'Is my personal info shared with couriers?', a: 'No. Couriers only see the delivery address, never your name, phone number, or any personal details.' },
            { q: 'How are discounts calculated?', a: 'Pickup saves 10%. Carrying 1 neighbor order saves 20%. Carrying 2 neighbor orders saves 30% off your total.' },
            { q: 'What if I can\'t complete a delivery?', a: 'Contact support immediately. We\'ll arrange an alternative and ensure your neighbor\'s order is handled.' },
            { q: 'How do I delete my account?', a: 'Go to Profile → Settings → Delete Account, or email privacy@communieats.app.' },
          ].map(({ q, a }) => (
            <div key={q} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <p className="font-medium text-[#1A1A1A] text-sm mb-1">{q}</p>
              <p className="text-[#6B6B6B] text-sm">{a}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-xs text-[#6B6B6B] mt-8">
        <Link href="/privacy" className="hover:underline">Privacy Policy</Link> ·{' '}
        <Link href="/terms" className="hover:underline">Terms of Service</Link> ·{' '}
        Version 1.0.0
      </p>
    </div>
  )
}
