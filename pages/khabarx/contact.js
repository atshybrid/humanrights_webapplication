import KhabarXPoliciesLayout from '../../components/KhabarXPoliciesLayout'

export default function ContactPage(){
  return (
    <KhabarXPoliciesLayout title="KhabarX — Contact">
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
    </KhabarXPoliciesLayout>
  )
}
