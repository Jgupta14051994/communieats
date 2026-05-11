export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Terms of Service</h1>
      <p className="text-[#6B6B6B] text-sm mb-8">Last updated: May 2026</p>

      {[
        { title: '1. Acceptance of Terms', content: 'By using CommuniEats, you agree to these Terms of Service. If you do not agree, please do not use the app.' },
        { title: '2. Eligibility', content: 'You must be at least 18 years old to use CommuniEats. By creating an account, you confirm that you meet this requirement.' },
        { title: '3. Community Courier Program', content: 'The Community Courier program allows users to voluntarily pick up and deliver neighbor orders. Participation is optional. CommuniEats does not employ couriers — participants are independent community members. Discounts are applied at checkout based on the number of neighbor orders accepted.' },
        { title: '4. Orders and Payments', content: 'All orders are subject to restaurant availability. Payments are processed securely via Stripe. Refunds are handled on a case-by-case basis — contact support@communieats.app within 24 hours of an issue.' },
        { title: '5. User Conduct', content: 'You agree not to use CommuniEats for any unlawful purpose, to tamper with the discount system, to submit false delivery confirmations, or to harass other users or restaurant staff.' },
        { title: '6. Liability Limitation', content: 'CommuniEats is not liable for delays, incorrect orders, or issues arising from Community Courier deliveries. The platform facilitates community connections but does not guarantee service quality.' },
        { title: '7. Changes to Terms', content: 'We may update these terms periodically. Continued use of the app after changes constitutes acceptance of the new terms.' },
        { title: '8. Contact', content: 'Legal questions: legal@communieats.app' },
      ].map(({ title, content }) => (
        <div key={title} className="mb-6">
          <h2 className="text-lg font-semibold text-[#1A1A1A] mb-2">{title}</h2>
          <p className="text-[#6B6B6B] text-sm leading-relaxed">{content}</p>
        </div>
      ))}
    </div>
  )
}
