import MemberIdCardBack from '../../../components/MemberIdCardBack'
import IdCardExactBack from '../../../components/IdCardExactBack'
import { getHRCIIdCard } from '../../../lib/api'

export async function getServerSideProps({ params }) {
  try {
    const { cardNumber } = params
    const data = await getHRCIIdCard(cardNumber)
    if (!data || !data.card) {
      return { props: { error: 'Card not found', cardNumber } }
    }

    const { card, setting, verifyUrl, qrUrl } = data
    const headOfficeAddress = setting?.headOfficeAddress || ''
    const regionalOfficeAddress = setting?.regionalOfficeAddress || ''
    const administrationOfficeAddress = setting?.administrationOfficeAddress || ''
    const website = setting?.website || setting?.siteUrl || ''
    const secondLogoUrl = (setting?.secondLogoUrl || setting?.frontLogoUrl) || ''
    const contactNumbers = [setting?.helpLineNumber1, setting?.helpLineNumber2].filter(Boolean)
    const contactNumber1 = contactNumbers[0] || ''
    const contactNumber2 = contactNumbers[1] || ''
    const watermarkUrl = setting?.watermarkUrl || 'https://pub-b13a983e33694dbd96cd42158ce2147b.r2.dev/string.png'
    const registrationLines = setting?.registrationLines || []
    const termsLines = setting?.termsLines || []

    return {
      props: {
        cardNumber,
        qrUrl: qrUrl || null,
        headOfficeAddress,
        regionalOfficeAddress,
        administrationOfficeAddress,
        website,
        secondLogoUrl,
        contactNumber1,
        contactNumber2,
        watermarkUrl,
        registrationLines,
        termsLines,
      }
    }
  } catch (e) {
    return { props: { error: e?.message || 'Failed to load card', cardNumber: params?.cardNumber || null } }
  }
}

export default function IdCardBackSSR({ error, qrUrl, headOfficeAddress, regionalOfficeAddress, administrationOfficeAddress, website, secondLogoUrl, contactNumber1, contactNumber2, watermarkUrl, registrationLines, termsLines, cardNumber }){
  async function downloadJpg(){
    try{
      const node = document.getElementById('idcard-capture')
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
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold">Member ID Card (Back)</h1>
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
          {/* Exact print design back version */}
          <IdCardExactBack
            qrUrlBack={qrUrl || ''}
            watermarkUrl={watermarkUrl}
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
        </div>
      </div>
    </div>
  )
}
