import KhabarXPoliciesLayout from '../../components/KhabarXPoliciesLayout'

export default function PrivacyPolicyPage(){
  return (
    <KhabarXPoliciesLayout title="KhabarX — Privacy Policy">
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
    </KhabarXPoliciesLayout>
  )
}
