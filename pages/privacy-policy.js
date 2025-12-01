import KhabarXPoliciesLayout from '../components/KhabarXPoliciesLayout'

export default function PrivacyPolicyCombined(){
  return (
    <KhabarXPoliciesLayout title="KhabarX — Policies & Pages">
      <div className="card">
        <h1 id="privacy">Privacy Policy</h1>
        <div className="meta">Last Updated: December 1, 2025</div>
        <p>KhabarX ("App", "we", "our", "us"), owned and operated by <strong>Srikanth Chennupati</strong>, is a news and citizen-reporting mobile application. This Privacy Policy explains how we collect, use, share, and protect user information.</p>

        <h3>1. Information We Collect</h3>
        <p><strong>A. Personal Information</strong></p>
        <ul>
          <li>Full Name</li>
          <li>Mobile Number (OTP Login)</li>
          <li>Email Address (Google Login)</li>
          <li>Profile Photo</li>
          <li>Role (User / Citizen Reporter / Member / Admin)</li>
          <li>Language Preference</li>
          <li>Device ID</li>
          <li>Expo Push Token</li>
        </ul>

        <p><strong>B. Authentication Data</strong></p>
        <ul>
          <li>MPIN (4-digit PIN, encrypted and sent to backend)</li>
          <li>Session Tokens (JWT &amp; Refresh Token)</li>
        </ul>

        <p><strong>C. Location Data</strong></p>
        <p>Collected <em>only if user grants permission</em>: Latitude &amp; Longitude, Accuracy &amp; Timestamp. Used for news personalization &amp; location-based reporting. KhabarX does not collect location in the background.</p>

        <h3>2. Media &amp; Device Permissions</h3>
        <p><strong>Camera</strong> — For profile photos, citizen reporting and KYC images.</p>
        <p><strong>Media Library</strong> — For user-selected images/videos (reports, stories, profiles).</p>
        <p><strong>Notifications</strong> — For breaking news and account updates.</p>
        <p><strong>Biometric (Fingerprint/Face)</strong> — Used only for App Lock convenience. We do NOT store biometric templates.</p>

        <h3>3. How We Use Your Data</h3>
        <ul>
          <li>Provide core app functions</li>
          <li>Verify user identity</li>
          <li>Show location-based news</li>
          <li>Send push notifications</li>
          <li>Enable citizen reporting and media uploads</li>
          <li>Improve user experience</li>
          <li>Maintain account security</li>
        </ul>

        <h3>4. Data Sharing</h3>
        <p>We do not sell or rent user data. Data may be shared with:</p>
        <ul>
          <li>Our secure backend server</li>
          <li>Media storage providers (CDN / Cloud Storage)</li>
          <li>Notification services (Expo / FCM)</li>
          <li>Analytics &amp; crash reporting tools</li>
          <li>Payment gateway (only if you use premium subscription)</li>
        </ul>

        <h3>5. Data Security</h3>
        <p>We implement industry-standard measures including HTTPS, secure token handling, and server-side protections. MPINs and other credentials must be stored hashed &amp; salted on the server; biometric data is not stored by KhabarX.</p>

        <h3>6. User Rights</h3>
        <p>Users may request account deletion, data export, profile updates, and can disable location or push permissions. Send requests to <a href="mailto:support@khabarx.com">support@khabarx.com</a>.</p>

        <h3>7. Children’s Privacy</h3>
        <p>KhabarX does not target children under 13.</p>

        <h3>8. Changes to This Policy</h3>
        <p>We may update this policy; changes will be posted here and within the app.</p>
      </div>

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

      <div className="card">
        <h1 id="disclaimer">Disclaimer</h1>
        <div className="meta">Last Updated: December 1, 2025</div>
        <p>KhabarX provides editorial news and citizen-reported content. We are not responsible for user-generated misinformation, errors or omissions, delays, or legal issues resulting from third-party sources. Users must verify facts before acting on any content.</p>
      </div>

      <div className="card">
        <h1 id="content">Content &amp; Community Guidelines</h1>
        <div className="meta">Keeping KhabarX safe and reliable</div>

        <h3>Not allowed</h3>
        <ul>
          <li>Illegal content (violence, terrorism support, child exploitation)</li>
          <li>Misinformation and fake news</li>
          <li>Abuse, hate speech, personal attacks</li>
          <li>Copyright infringements</li>
          <li>Privacy violations (sharing private info without consent)</li>
        </ul>

        <h3>Allowed content</h3>
        <ul>
          <li>Genuine news reports and community events</li>
          <li>Public interest reporting and educational content</li>
        </ul>

        <h3>Reporting &amp; Moderation</h3>
        <p>Users can report content using the in-app report feature. Moderators will review and take action. Repeated violations may lead to account suspension or termination.</p>
      </div>

      <div className="card">
        <h1 id="contact">Contact Us</h1>
        <div className="meta">Primary support &amp; legal contacts</div>

        <p><strong>KhabarX — Support Team</strong><br />
        Owner: <strong>Srikanth Chennupati</strong></p>

        <p>📧 Email: <a href="mailto:support@khabarx.com">support@khabarx.com</a><br />
        📧 Legal: <a href="mailto:legal@khabarx.com">legal@khabarx.com</a><br />
        📍 Location: Hyderabad, Telangana, India<br />
        🌐 Website: <a href="https://www.khabarx.com" target="_blank" rel="noreferrer">www.khabarx.com</a> (optional)</p>

        <h3>Data Requests</h3>
        <p>To request data export or account deletion, send a request to <a href="mailto:support@khabarx.com">support@khabarx.com</a> with your registered mobile number and details.</p>
      </div>

      <div className="card">
        <h1 id="refund">Refund Policy</h1>
        <div className="meta">Applies to Paid Subscriptions / In-App Purchases</div>

        <p>All paid transactions are processed via Google Play Billing. Refunds are handled per Google Play refund policies. For subscription cancellations:</p>
        <ul>
          <li>Subscriptions auto-renew unless cancelled via Google Play.</li>
          <li>Cancellations will stop future billing but do not typically refund past charges.</li>
          <li>To request a refund, use Google Play order history or contact <a href="mailto:support@khabarx.com">support@khabarx.com</a> and include your order ID.</li>
        </ul>
      </div>

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

