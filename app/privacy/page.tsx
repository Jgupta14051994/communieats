export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Privacy Policy</h1>
      <p className="text-[#6B6B6B] text-sm mb-8">Last updated: May 2026</p>

      {[
        {
          title: '1. Information We Collect',
          content: `We collect information you provide directly to us when you create an account, place an order, or act as a Community Courier. This includes your name, email address, delivery address, and payment information. We also collect location data when you use the map or Community Courier features, with your explicit permission.`
        },
        {
          title: '2. How We Use Your Information',
          content: `We use your information to process orders, match you with Community Courier opportunities, calculate discounts, track your sustainability impact (CO₂ saved), and improve the app. We do not sell your personal information to third parties.`
        },
        {
          title: '3. Location Data',
          content: `CommuniEats requests access to your device location to show nearby restaurants and enable Community Courier matching. Location access is only requested when you use these features and can be revoked at any time in your device settings. We do not store your location history beyond the duration of an active delivery session.`
        },
        {
          title: '4. Community Courier Data',
          content: `When you act as a Community Courier, we collect your route information to facilitate neighbor order delivery. Delivery stops show only the drop-off address — no personal information about neighbors is shared with couriers.`
        },
        {
          title: '5. Payment Information',
          content: `Payment processing is handled securely by Stripe. CommuniEats does not store your full card details. We store only payment confirmation tokens provided by Stripe.`
        },
        {
          title: '6. Push Notifications',
          content: `With your permission, we send push notifications for order status updates, Community Courier opportunities near you, and promotional offers. You can disable notifications at any time in your device settings.`
        },
        {
          title: '7. Data Retention',
          content: `We retain your account data for as long as your account is active. Order history is retained for 2 years. You may request deletion of your account and data by emailing privacy@communieats.app.`
        },
        {
          title: '8. Your Rights',
          content: `You have the right to access, correct, or delete your personal data. Contact us at privacy@communieats.app to exercise these rights. Users in the EU and California have additional rights under GDPR and CCPA respectively.`
        },
        {
          title: '9. Contact',
          content: `Questions about this policy? Contact us at privacy@communieats.app or write to CommuniEats, 123 Community Ave, New York, NY 10001.`
        },
      ].map(({ title, content }) => (
        <div key={title} className="mb-6">
          <h2 className="text-lg font-semibold text-[#1A1A1A] mb-2">{title}</h2>
          <p className="text-[#6B6B6B] text-sm leading-relaxed">{content}</p>
        </div>
      ))}
    </div>
  )
}
