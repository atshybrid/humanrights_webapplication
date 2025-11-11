import IdCardExactFront from '../../components/IdCardExactFront'
import IdCardExactBack from '../../components/IdCardExactBack'
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

    // FRONT SIDE MAPPING
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
    const photoUrl = card.photoUrl || card.profilePhotoUrl || card.photo || ''
    const qrFront = qrUrl || card?.qrUrlFront || card?.qrFront || card?.qrCodeUrl || null
    const watermarkFrontUrl = setting?.frontWatermarkUrl || setting?.watermarkUrl || card?.watermarkUrl || 'https://pub-b13a983e33694dbd96cd42158ce2147b.r2.dev/string.png'

    // BACK SIDE MAPPING
    const headOfficeAddress = setting?.headOfficeAddress || card?.headOfficeAddress || ''
    const regionalOfficeAddress = setting?.regionalOfficeAddress || card?.regionalOfficeAddress || ''
    const administrationOfficeAddress = setting?.administrationOfficeAddress || card?.administrationOfficeAddress || ''
    const website = setting?.website || setting?.siteUrl || card?.website || ''
    const secondLogoUrl = (setting?.secondLogoUrl || setting?.frontLogoUrl || card?.secondLogoUrl || card?.frontLogoUrl) || ''
    const contactNumbers = [setting?.helpLineNumber1, setting?.helpLineNumber2, card?.helpLineNumber1, card?.helpLineNumber2].filter(Boolean)
    const contactNumber1 = contactNumbers[0] || ''
    const contactNumber2 = contactNumbers[1] || ''
    const watermarkBackUrl = setting?.backWatermarkUrl || setting?.watermarkUrl || card?.watermarkUrl || 'https://pub-b13a983e33694dbd96cd42158ce2147b.r2.dev/string.png'
    const registrationLines = setting?.registrationLines || card?.registrationLines || []
    const termsLines = setting?.termsLines || card?.termsLines || []
    const qrBack = qrUrl || card?.qrUrlBack || card?.qrBack || card?.qrCodeUrl || null

    return {
      props: {
        cardNumber,
        member,
        logoUrl,
        stampUrl,
        signUrl,
        photoUrl,
        qrFront,
        watermarkFrontUrl,
        // back side props
        qrBack,
        headOfficeAddress,
        regionalOfficeAddress,
        administrationOfficeAddress,
        website,
        secondLogoUrl,
        contactNumber1,
        contactNumber2,
        watermarkBackUrl,
        registrationLines,
        termsLines,
      }
    }
  } catch (e) {
    return { props: { error: e?.message || 'Failed to load card', cardNumber: params?.cardNumber || null } }
  }
}

export default function IdCardFrontBackPage({ error, cardNumber, member, logoUrl, stampUrl, signUrl, photoUrl, qrFront, watermarkFrontUrl, qrBack, headOfficeAddress, regionalOfficeAddress, administrationOfficeAddress, website, secondLogoUrl, contactNumber1, contactNumber2, watermarkBackUrl, registrationLines, termsLines }){
  async function downloadFrontJpg(){
    try{
      const node = document.getElementById('idcard-front')
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
  async function downloadBackJpg(){
    try{
      const node = document.getElementById('idcard-back')
      if(!node) return
      const { toJpeg } = await import('html-to-image')
      const dataUrl = await toJpeg(node, { quality: 0.98, pixelRatio: 2 })
      const link = document.createElement('a')
      link.download = `${cardNumber || 'idcard'}-back.jpg`
      link.href = dataUrl
      link.click()
    }catch(e){
      console.error('Download failed', e)
    }
  }
  function handlePrintBoth(){
    // Print both by opening a new window with combined markup
    const front = document.getElementById('idcard-front')?.innerHTML || ''
    const back = document.getElementById('idcard-back')?.innerHTML || ''
    const w = window.open('', '_blank')
    if(!w) return
    w.document.write('<html><head><title>Print ID Cards</title><style>@page{size:auto;margin:6mm} body{font-family:Poppins,sans-serif;display:flex;flex-wrap:wrap;gap:12mm;justify-content:center;padding:12mm;background:#f0f0f0;} .wrap{box-shadow:0 0 6px rgba(0,0,0,.25);}</style></head><body>')
    w.document.write(`<div class="wrap">${front}</div>`)
    w.document.write(`<div class="wrap">${back}</div>`)
    w.document.write('</body></html>')
    w.document.close()
    w.focus()
    setTimeout(()=> { try { w.print(); } catch(_){} }, 300)
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 via-white to-gray-200 py-10 font-[Poppins]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">Member ID Card{member?.name ? ` — ${member.name}` : ''}</h1>
            <p className="text-sm text-gray-600 mt-1">Front & Back combined view. Use actions to print or download high quality images.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={handlePrintBoth} className="inline-flex items-center rounded-full bg-indigo-600 text-white px-4 py-2 text-sm font-semibold shadow hover:bg-indigo-700">Print Both</button>
            <button onClick={downloadFrontJpg} className="inline-flex items-center rounded-full bg-slate-700 text-white px-4 py-2 text-sm font-semibold shadow hover:bg-slate-800">Front JPG</button>
            <button onClick={downloadBackJpg} className="inline-flex items-center rounded-full bg-slate-700 text-white px-4 py-2 text-sm font-semibold shadow hover:bg-slate-800">Back JPG</button>
          </div>
        </div>
        {error ? (
          <div className="mb-4 rounded-md bg-red-50 text-red-700 px-4 py-3 border border-red-200">
            {error}
          </div>
        ) : null}
        <div className="grid lg:grid-cols-2 gap-10 place-items-start">
          <div id="idcard-front" className="flex flex-col items-center">
            <IdCardExactFront
              logoUrl={logoUrl}
              qrUrlFront={qrFront || ''}
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
              watermarkUrl={watermarkFrontUrl || ''}
            />
            <p className="mt-3 text-xs text-gray-500">Front Side</p>
          </div>
          <div id="idcard-back" className="flex flex-col items-center">
            <IdCardExactBack
              qrUrlBack={qrBack || ''}
              watermarkUrl={watermarkBackUrl || ''}
              registrationLines={registrationLines}
              termsLines={termsLines}
              headOfficeAddress={headOfficeAddress}
              regionalOfficeAddress={regionalOfficeAddress}
              administrationOfficeAddress={administrationOfficeAddress}
              website={website}
              secondLogoUrl={secondLogoUrl}
              contactNumber1={contactNumber1}
              contactNumber2={contactNumber2}
            />
            <p className="mt-3 text-xs text-gray-500">Back Side</p>
          </div>
        </div>
        <div className="mt-10 max-w-3xl mx-auto bg-white rounded-2xl shadow-sm ring-1 ring-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Card Details</h2>
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <div className="font-medium text-gray-600">Name:</div><div className="font-semibold text-gray-900">{member?.name || '-'}</div>
            <div className="font-medium text-gray-600">Designation:</div><div className="font-semibold text-gray-900">{member?.designation || '-'}</div>
            <div className="font-medium text-gray-600">Cell:</div><div className="font-semibold text-gray-900">{member?.level || '-'}</div>
            <div className="font-medium text-gray-600">Work Place:</div><div className="font-semibold text-gray-900">{member?.workPlace || '-'}</div>
            <div className="font-medium text-gray-600">ID Number:</div><div className="font-semibold text-gray-900">{member?.memberId || '-'}</div>
            <div className="font-medium text-gray-600">Contact:</div><div className="font-semibold text-gray-900">{member?.phone || '-'}</div>
            <div className="font-medium text-gray-600">Valid Upto:</div><div className="font-semibold text-gray-900">{(member?.validity || '').replace('Valid Thru: ','') || '-'}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
