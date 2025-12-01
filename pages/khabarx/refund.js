import KhabarXPoliciesLayout from '../../components/KhabarXPoliciesLayout'

export default function RefundPolicyPage(){
  return (
    <KhabarXPoliciesLayout title="KhabarX — Refund Policy">
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
    </KhabarXPoliciesLayout>
  )
}
