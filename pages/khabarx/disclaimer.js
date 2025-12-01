import KhabarXPoliciesLayout from '../../components/KhabarXPoliciesLayout'

export default function DisclaimerPage(){
  return (
    <KhabarXPoliciesLayout title="KhabarX — Disclaimer">
      <div className="card">
        <h1 id="disclaimer">Disclaimer</h1>
        <div className="meta">Last Updated: December 1, 2025</div>

        <p>KhabarX provides editorial news and citizen-reported content. We are not responsible for user-generated misinformation, errors or omissions, delays, or legal issues resulting from third-party sources. Users must verify facts before acting on any content.</p>
      </div>
    </KhabarXPoliciesLayout>
  )
}
