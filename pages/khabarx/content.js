import KhabarXPoliciesLayout from '../../components/KhabarXPoliciesLayout'

export default function ContentGuidelinesPage(){
  return (
    <KhabarXPoliciesLayout title="KhabarX — Content & Community Guidelines">
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
    </KhabarXPoliciesLayout>
  )
}
