import KhabarXPoliciesLayout from '../../components/KhabarXPoliciesLayout'

export default function DataSafetyPage(){
  return (
    <KhabarXPoliciesLayout title="KhabarX — Data Safety">
      <div className="card">
        <h1 id="datasafety">Data Safety Form (Play Console Guidance)</h1>
        <div className="meta">Summary to help fill Google Play Data Safety</div>

        <p><strong>Data Collected</strong></p>
        <ul>
          <li>Personal Info: Name, Mobile Number, Email</li>
          <li>Identifiers: Device ID, Push Token</li>
          <li>Location: Precise/Coarse (only when granted)</li>
          <li>Media: Photos &amp; Videos (user-selected uploads)</li>
          <li>Authentication: MPIN, JWT tokens</li>
        </ul>

        <p><strong>Is data shared?</strong> Yes — with service providers (CDN, notification services, analytics, payment gateways). We do not sell data.</p>

        <p><strong>Security</strong>: Data encrypted in transit (HTTPS). Sensitive data (MPIN) must be hashed server-side. No biometric templates stored.</p>

        <p><strong>Recommendation</strong>: When you complete the Google Play Data Safety form, select the above data categories and mark them as collected for <em>App functionality</em>, notify users in the privacy policy, and list third-party processors used.</p>
      </div>
    </KhabarXPoliciesLayout>
  )
}
