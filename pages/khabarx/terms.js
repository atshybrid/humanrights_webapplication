import KhabarXPoliciesLayout from '../../components/KhabarXPoliciesLayout'

export default function TermsPage(){
  return (
    <KhabarXPoliciesLayout title="KhabarX — Terms & Conditions">
      <div className="card">
        <h1 id="terms">Terms &amp; Conditions</h1>
        <div className="meta">Effective: December 1, 2025</div>

        <p>By using the KhabarX mobile application, you agree to the following Terms &amp; Conditions.</p>

        <h3>1. User Account</h3>
        <p>You must provide valid details. You are responsible for your account and MPIN security. Sharing credentials is prohibited.</p>

        <h3>2. User Content (Citizen Reporting)</h3>
        <p>If you upload content (text, images, videos):</p>
        <ul>
          <li>You confirm the content is original and truthful.</li>
          <li>You must not upload fake news, hate speech, copyrighted media without rights, obscene or violent content, or unverified political propaganda.</li>
        </ul>
        <p>KhabarX may remove content that violates these rules.</p>

        <h3>3. Location Usage</h3>
        <p>The app may use your precise or coarse location for hyper-local news, geo-tagging submissions, and incident reporting. You can disable location in device settings.</p>

        <h3>4. Premium / Paid Features</h3>
        <p>Paid features may include ad-free experience, exclusive articles, and premium reporter tools. Refunds and cancellations follow Google Play Billing policies.</p>

        <h3>5. Prohibited Activities</h3>
        <ul>
          <li>Spreading misinformation</li>
          <li>Hacking or reverse-engineering the app</li>
          <li>Uploading malware</li>
          <li>Impersonation</li>
          <li>Harassment or abuse</li>
        </ul>

        <h3>6. Liability</h3>
        <p>KhabarX is a news and media platform. We do not guarantee accuracy of all user-generated content, continuous service, or reliability of third-party services.</p>

        <h3>7. Termination</h3>
        <p>Accounts may be terminated for misuse, fake identities, repeated violations, or illegal activity.</p>

        <h3>8. Governing Law</h3>
        <p>These terms are governed by the laws of India.</p>
      </div>
    </KhabarXPoliciesLayout>
  )
}
