import KhabarXPoliciesLayout from "../components/KhabarXPoliciesLayout";

export default function ChildSafetyPage() {
  return (
    <KhabarXPoliciesLayout title="Child Safety Standards – Khabhar X">
      <div className="card">
        <h1 id="child-safety">Child Safety Standards</h1>
        <div className="meta">Last updated: May 2026</div>

        <p>
          Khabhar X is a news and citizen-reporting mobile application operated
          by <strong>HRCI (Human Rights Council of India)</strong>. We are
          deeply committed to child safety and maintaining a platform free from
          any content that exploits, endangers, or harms children in any way.
        </p>

        <h3>1. Zero Tolerance Policy</h3>
        <p>
          Khabhar X has a strict zero-tolerance policy against Child Sexual
          Abuse Material (CSAM) and any content that sexually exploits or
          endangers minors. This includes:
        </p>
        <ul>
          <li>Child sexual abuse material (CSAM) of any kind</li>
          <li>Content that sexualises minors</li>
          <li>Grooming, solicitation, or exploitation of children</li>
          <li>
            Content that endangers the physical or emotional safety of children
          </li>
        </ul>
        <p>
          Any such content is strictly prohibited on our platform and will
          result in immediate account termination and reporting to the
          appropriate authorities.
        </p>

        <h3>2. CSAM Prevention Practices</h3>
        <p>
          We implement the following active measures to prevent CSAM and child
          exploitation on our platform:
        </p>
        <ul>
          <li>
            <strong>Content Moderation:</strong> All user-submitted content
            (citizen reporter articles, images, and videos) is reviewed by our
            moderation team before or immediately after publication.
          </li>
          <li>
            <strong>User Reporting Mechanism:</strong> Every piece of content in
            the app has an in-app report button allowing users to flag harmful
            or illegal content directly.
          </li>
          <li>
            <strong>Account Verification:</strong> Users must verify via OTP
            (mobile) or Google login. Unverified or suspicious accounts are
            reviewed and suspended.
          </li>
          <li>
            <strong>Proactive Review:</strong> Our team proactively monitors
            content submissions, especially from citizen reporters, for any
            policy violations.
          </li>
          <li>
            <strong>Immediate Removal:</strong> Reported or detected violating
            content is removed within 24 hours of identification.
          </li>
          <li>
            <strong>Law Enforcement Reporting:</strong> Any confirmed CSAM is
            immediately reported to the{" "}
            <strong>
              National Centre for Missing &amp; Exploited Children (NCMEC)
            </strong>{" "}
            and relevant Indian law enforcement authorities.
          </li>
        </ul>

        <h3>3. Legal Compliance</h3>
        <p>
          Khabhar X complies with all applicable child safety and protection
          laws, including:
        </p>
        <ul>
          <li>
            <strong>
              Protection of Children from Sexual Offences Act (POCSO), 2012
            </strong>{" "}
            — India
          </li>
          <li>
            <strong>Information Technology Act, 2000</strong> and IT
            (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021
          </li>
          <li>
            <strong>Google Play Developer Programme Policies</strong> — Child
            Safety Standards
          </li>
          <li>
            Applicable international child safety regulations and conventions
          </li>
        </ul>

        <h3>4. Children's Privacy</h3>
        <p>
          Khabhar X is not directed at children under the age of 13. We do not
          knowingly collect personal information from children under 13. If we
          become aware that a child under 13 has provided us with personal
          information, we will take steps to delete such information
          immediately.
        </p>

        <h3>5. Reporting Violations</h3>
        <p>
          If you encounter any content on Khabhar X that you believe violates
          child safety standards or constitutes CSAM, please report it
          immediately:
        </p>
        <ul>
          <li>
            <strong>In-App:</strong> Use the Report button available on every
            article, comment, or user profile
          </li>
          <li>
            <strong>Email:</strong>{" "}
            <a href="mailto:hrcitodaynews@gmail.com">hrcitodaynews@gmail.com</a>
          </li>
          <li>
            <strong>Subject line:</strong> CHILD SAFETY REPORT
          </li>
        </ul>
        <p>
          All reports are reviewed within 24 hours. Confirmed violations are
          removed immediately and reported to law enforcement where required.
        </p>

        <h3>6. Point of Contact</h3>
        <p>
          Our designated Child Safety point of contact is responsible for
          overseeing CSAM prevention practices and compliance with Child Safety
          and Child Endangerment policies:
        </p>
        <ul>
          <li>
            <strong>Organisation:</strong> HRCI (Human Rights Council of India)
          </li>
          <li>
            <strong>Email:</strong>{" "}
            <a href="mailto:hrcitodaynews@gmail.com">hrcitodaynews@gmail.com</a>
          </li>
          <li>
            <strong>App:</strong> Khabhar X
          </li>
        </ul>
        <p>
          This contact is kept up to date and is available to speak about our
          child safety practices and respond to enquiries from Google Play and
          regulatory authorities.
        </p>
      </div>
    </KhabarXPoliciesLayout>
  );
}
