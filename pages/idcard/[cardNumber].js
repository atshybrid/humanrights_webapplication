import MemberIdCardFront from '../../components/MemberIdCardFront'
import { getHRCIIdCard } from '../../lib/api'

export async function getServerSideProps({ params }) {
  try {
    const { cardNumber } = params
    const data = await getHRCIIdCard(cardNumber)
    if (!data || !data.card) return { notFound: true }

    const { card, setting, verifyUrl, qrUrl } = data
    // Map fields for the component
    const member = {
      name: card.fullName || '',
      designation: card.designationName || '',
      level: card.cellName || '',
      membershipNo: card.membershipId || '',
      memberId: card.cardNumber || card.membershipId || '',
      phone: card.mobileNumber || '',
      validity: card.expiresAt ? `Valid Thru: ${new Date(card.expiresAt).toLocaleString('en-US', { month: 'short', year: 'numeric' })}` : '',
    }

    const orgName = (setting && (setting.frontH1 || setting.name)) || 'Human Rights Council for India'
    const tagline = (setting && (setting.frontH2 || setting.headOfficeAddress)) || ''
    const logoUrl = (setting && (setting.frontLogoUrl || setting.secondLogoUrl)) || '/images/logo.svg'
    const stampUrl = (setting && setting.hrciStampUrl) || ''
    const signUrl = (setting && setting.authorSignUrl) || ''
    const gradientStart = (setting && setting.primaryColor) || '#FE0002'
    const gradientEnd = (setting && setting.secondaryColor) || '#1D0DA1'

    return {
      props: {
        cardNumber,
        member,
        orgName,
        tagline,
        logoUrl,
        stampUrl,
        signUrl,
        gradientStart,
        gradientEnd,
        verifyUrl: verifyUrl || null,
        qrUrl: qrUrl || null,
      }
    }
  } catch (e) {
    return { notFound: true }
  }
}

export default function IdCardFrontSSR({ member, orgName, tagline, logoUrl, stampUrl, signUrl, gradientStart, gradientEnd }){
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold">Member ID Card (Front){member?.name ? ` — ${member.name}` : ''}</h1>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center rounded-md bg-indigo-600 text-white px-3 py-2 text-sm font-medium shadow hover:bg-indigo-700"
          >
            Print
          </button>
        </div>

        <MemberIdCardFront
          // minimal + portrait mm sizing are defaults in component
          orgName={orgName}
          tagline={tagline}
          logoUrl={logoUrl}
          photoUrl={''}
          stampUrl={stampUrl}
          signUrl={signUrl}
          gradientStart={gradientStart}
          gradientEnd={gradientEnd}
          member={member}
        />
      </div>
    </div>
  )
}
