import MemberIdCardFront from '../../components/MemberIdCardFront'
import IdCardExactFront from '../../components/IdCardExactFront'
import { getHRCIIdCard } from '../../lib/api'

export async function getServerSideProps({ params }) {
  try {
    const { cardNumber } = params
    const data = await getHRCIIdCard(cardNumber)
    if (!data || !data.card) {
      return { props: { error: 'Card not found', cardNumber } }
    }

  // Preserve entire payload for root-level fields
  const { card, setting, verifyUrl, qrUrl, frontLogoUrl: rootFrontLogoUrl } = data || {}
    // Map fields for the component
    const member = {
      name: card.fullName || '',
      designation: card.designationName || '',
      level: card.cellName || '',
      membershipNo: card.membershipId || '',
      memberId: card.cardNumber || card.membershipId || '',
      phone: card.mobileNumber || '',
      validity: card.expiresAt ? `Valid Thru: ${new Date(card.expiresAt).toLocaleString('en-US', { month: 'short', year: 'numeric' })}` : '',
      workPlace: card.workPlace || card.workplace || [card.stateName, card.districtName, card.mandalName].filter(Boolean).join(', ')
    }

  const orgName = (setting && (setting.frontH1 || setting.name)) || 'Human Rights Council for India'
  const tagline = (setting && (setting.frontH2 || setting.headOfficeAddress)) || ''
    // Robust logo resolution order (root-level > setting > card fallbacks)
    const logoUrl = (
      rootFrontLogoUrl ||
      setting?.frontLogoUrl ||
      card?.frontLogoUrl ||
      setting?.secondLogoUrl ||
      card?.secondLogoUrl ||
      '/images/logo.svg'
    )
  const stampUrl = (card?.hrciStampUrl || setting?.hrciStampUrl || card?.stampUrl || '')
  const signUrl = (card?.authorSignUrl || setting?.authorSignUrl || card?.signatureUrl || '')
  const gradientStart = (setting && setting.primaryColor) || '#FE0002'
  const gradientEnd = (setting && setting.secondaryColor) || '#1D0DA1'
  const photoUrl = card.photoUrl || card.profilePhotoUrl || card.photo || ''
  const qr = qrUrl || card?.qrUrlFront || card?.qrFront || card?.qrCodeUrl || null
  const watermarkUrl = setting?.frontWatermarkUrl || setting?.watermarkUrl || card?.watermarkUrl || 'https://pub-b13a983e33694dbd96cd42158ce2147b.r2.dev/string.png'

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
        qrUrl: qr,
        photoUrl,
        watermarkUrl,
      }
    }
  } catch (e) {
    return { props: { error: e?.message || 'Failed to load card', cardNumber: params?.cardNumber || null } }
  }
}

export default function IdCardFrontSSR({ error, cardNumber, member, orgName, tagline, logoUrl, stampUrl, signUrl, gradientStart, gradientEnd, qrUrl, photoUrl, watermarkUrl }){
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
          {/* Exact print design version */}
          <IdCardExactFront
            logoUrl={logoUrl}
            qrUrlFront={qrUrl || ''}
            cellName={member?.level || ''}
            memberName={member?.name || ''}
            designation={member?.designation || ''}
            workPlace={member?.workPlace || ''}
            idNumber={member?.memberId || ''}
            contactNumber={member?.phone || ''}
            validUpto={(member?.validity || '').replace('Valid Thru: ','')}
            photoUrl={photoUrl || ''}
            stampUrl={stampUrl || ''}
            authorSignUrl={signUrl || ''}
            watermarkUrl={watermarkUrl || ''}
          />
        </div>
      </div>
    </div>
  )
}
