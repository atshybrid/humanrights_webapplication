import IdCardExactFront from '../../components/IdCardExactFront'
import { getHRCIIdCard } from '../../lib/api'

export async function getServerSideProps({ params }) {
  try {
    const { cardNumber } = params
    const data = await getHRCIIdCard(cardNumber)
    if (!data || !data.card) {
      return { props: { error: 'Member card not found', cardNumber } }
    }
    const { card, setting, qrUrl, frontLogoUrl: rootFrontLogoUrl } = data
    const member = {
      name: card.fullName || '',
      designation: card.designationName || '',
      level: card.cellName || '',
      memberId: card.cardNumber || card.membershipId || '',
      phone: card.mobileNumber || '',
      validity: card.expiresAt ? `Valid Thru: ${new Date(card.expiresAt).toLocaleString('en-US', { month: 'short', year: 'numeric' })}` : '',
      workPlace: card.workPlace || card.workplace || [card.stateName, card.districtName, card.mandalName].filter(Boolean).join(', ')
    }
    const logoUrl = (
      rootFrontLogoUrl ||
      setting?.frontLogoUrl ||
      card?.frontLogoUrl ||
      setting?.secondLogoUrl ||
      card?.secondLogoUrl ||
      '/images/logo.svg'
    )
    const stampUrl = card?.hrciStampUrl || setting?.hrciStampUrl || card?.stampUrl || ''
    const authorSignUrl = card?.authorSignUrl || setting?.authorSignUrl || card?.signatureUrl || ''
    const photoUrl = card.photoUrl || card.profilePhotoUrl || card.photo || ''
    const watermarkUrl = setting?.frontWatermarkUrl || setting?.watermarkUrl || card?.watermarkUrl || 'https://pub-b13a983e33694dbd96cd42158ce2147b.r2.dev/string.png'
    const qrFront = qrUrl || card?.qrUrlFront || card?.qrFront || card?.qrCodeUrl || ''

    return { props: { member, logoUrl, stampUrl, authorSignUrl, photoUrl, watermarkUrl, qrFront, cardNumber } }
  } catch (e) {
    return { props: { error: e?.message || 'Failed to load member', cardNumber: params?.cardNumber || '' } }
  }
}

export default function MemberProfilePage({ error, member, logoUrl, stampUrl, authorSignUrl, photoUrl, watermarkUrl, qrFront, cardNumber }) {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold">Member Profile {member?.name ? `— ${member.name}` : ''}</h1>
          {member?.memberId ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 ring-1 ring-green-200">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.122 4.291-1.47-1.47a.75.75 0 10-1.06 1.061l2.25 2.25a.75.75 0 001.137-.089l3.48-4.5z" clipRule="evenodd" /></svg>
              Verified Member
            </span>
          ) : null}
        </div>
        {error ? <div className="mb-4 rounded-md bg-red-50 text-red-700 px-4 py-3 border border-red-200">{error}</div> : null}

        {/* Card + Details layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl p-4 shadow ring-1 ring-gray-200" id="idcard-capture">
              <IdCardExactFront
                logoUrl={logoUrl}
                qrUrlFront={qrFront}
                cellName={member?.level || ''}
                memberName={member?.name || ''}
                designation={member?.designation || ''}
                workPlace={member?.workPlace || ''}
                idNumber={member?.memberId || ''}
                contactNumber={member?.phone || ''}
                validUpto={(member?.validity || '').replace('Valid Thru: ','')}
                photoUrl={photoUrl || ''}
                stampUrl={stampUrl || ''}
                authorSignUrl={authorSignUrl || ''}
                watermarkUrl={watermarkUrl || ''}
              />
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center rounded-md bg-indigo-600 text-white px-3 py-2 text-sm font-medium shadow hover:bg-indigo-700"
              >Print</button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    const node = document.getElementById('idcard-capture')
                    if(!node) return
                    const { toJpeg } = await import('html-to-image')
                    const dataUrl = await toJpeg(node, { quality: 0.98, pixelRatio: 2 })
                    const link = document.createElement('a')
                    link.download = `${cardNumber || 'member'}-front.jpg`
                    link.href = dataUrl
                    link.click()
                  } catch(e){ console.error(e) }
                }}
                className="inline-flex items-center rounded-md bg-slate-700 text-white px-3 py-2 text-sm font-medium shadow hover:bg-slate-800"
              >Download JPG</button>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow ring-1 ring-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Member Details</h2>
              <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                <Detail label="Full Name" value={member?.name} />
                <Detail label="Designation" value={member?.designation} />
                <Detail label="Cell" value={member?.level} />
                <Detail label="ID Number" value={member?.memberId} />
                <Detail label="Mobile" value={member?.phone} />
                <Detail label="Work Place" value={member?.workPlace} />
                <Detail label="Validity" value={member?.validity?.replace('Valid Thru: ','')} />
              </dl>
              <p className="mt-6 text-xs text-gray-500">Data sourced securely from the HRCI ID Card endpoint. Displayed for verification and printing purposes only.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Detail({ label, value }) {
  return (
    <div>
      <dt className="text-gray-500 uppercase tracking-wide text-[11px] font-medium">{label}</dt>
      <dd className="mt-1 text-gray-900 font-semibold">{value || '—'}</dd>
    </div>
  )
}
