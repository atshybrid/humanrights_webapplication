import KhabarXPoliciesLayout from '../components/KhabarXPoliciesLayout'

export default function ChildSafetyPage() {
  return (
    <KhabarXPoliciesLayout title="Child Safety Standards – Khabhar X">
      <div className="card">
        <h1 id="child-safety">Child Safety Standards</h1>
        <div className="meta">Last updated: April 2026</div>

        <p>
          Khabhar X is a news and media application operated by{' '}
          <strong>HRCI (Human Rights Commission of India)</strong>. We are
          committed to providing a safe environment for all users and strictly
          prohibit any content that exploits or harms children.
        </p>

        <h3>Our Commitment</h3>
        <ul>
          <li>
            Khabhar X does not host, distribute, or tolerate child sexual abuse
            material (CSAM) or any content that sexualises minors.
          </li>
          <li>
            Any content found to violate these standards is immediately removed
            and reported to the relevant authorities, including the{' '}
            <strong>
              National Centre for Missing &amp; Exploited Children (NCMEC)
            </strong>{' '}
            where required.
          </li>
          <li>
            We comply with all applicable child safety laws including the{' '}
            <strong>
              Protection of Children from Sexual Offences Act (POCSO), 2012
            </strong>{' '}
            (India) and applicable international regulations.
          </li>
        </ul>

        <h3>Reporting</h3>
        <p>
          If you encounter any content on Khabhar X that you believe violates
          child safety standards, please contact us immediately:
        </p>
        <ul>
          <li>
            <strong>Email:</strong>{' '}
            <a href="mailto:hrcitodaynews@gmail.com">hrcitodaynews@gmail.com</a>
          </li>
          <li>
            <strong>Subject:</strong> Child Safety Report
          </li>
        </ul>
        <p>
          We review all reports promptly and take appropriate action including
          removal of content and reporting to law enforcement authorities.
        </p>

        <h3>In-App Reporting</h3>
        <p>
          Khabhar X provides in-app mechanisms for users to report content that
          violates child safety standards. Reports are reviewed by our
          moderation team.
        </p>

        <h3>Contact</h3>
        <p>For any questions regarding our child safety standards:</p>
        <ul>
          <li>
            <strong>Email:</strong>{' '}
            <a href="mailto:hrcitodaynews@gmail.com">hrcitodaynews@gmail.com</a>
          </li>
        </ul>
      </div>
    </KhabarXPoliciesLayout>
  )
}
