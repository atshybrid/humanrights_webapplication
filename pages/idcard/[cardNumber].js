import MemberIdCardFront from '../../components/MemberIdCardFront'
import { getHRCIIdCard } from '../../lib/api'

export async function getServerSideProps({ params }) {
  try {
    const { cardNumber } = params
    const data = await getHRCIIdCard(cardNumber)
    if (!data || !data.card) {
      return { props: { error: 'Card not found', cardNumber } }
    }

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
    return { props: { error: e?.message || 'Failed to load card', cardNumber: params?.cardNumber || null } }
  }
}

export default function IdCardFrontSSR({ error, cardNumber, member, orgName, tagline, logoUrl, stampUrl, signUrl, gradientStart, gradientEnd }){
  async function downloadJpg(){
    try{
      const node = document.getElementById('idcard-capture')
      if(!node) return
      const { toJpeg } = await import('html-to-image')
      const dataUrl = await toJpeg(node, { quality: 0.98, pixelRatio: 2 })
      const link = document.createElement('a')
      link.download = `${cardNumber || 'idcard'}-front.jpg`
      link.href = dataUrl
      link.click()
    }catch(e){
      console.error('Download failed', e)
    }
  }
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
          <button
            type="button"
            onClick={downloadJpg}
            className="inline-flex items-center rounded-md bg-slate-700 text-white px-3 py-2 text-sm font-medium shadow hover:bg-slate-800 ml-2"
          >
            Download JPG
          </button>
        </div>
        {error ? (
          <div className="mb-4 rounded-md bg-red-50 text-red-700 px-4 py-3 border border-red-200">
            {error}
          </div>
        ) : null}
        
        <div id="idcard-capture">
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
            noHeader={true}
            noFooterAccent={true}
            minimal={true}
            member={member}
          />
        </div>
      </div>
    </div>
  )
}
