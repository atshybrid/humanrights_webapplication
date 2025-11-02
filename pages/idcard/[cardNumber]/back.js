import MemberIdCardBack from '../../../components/MemberIdCardBack'
import { getHRCIIdCard } from '../../../lib/api'

export async function getServerSideProps({ params }) {
  try {
    const { cardNumber } = params
    const data = await getHRCIIdCard(cardNumber)
    if (!data || !data.card) {
      return { props: { error: 'Card not found', cardNumber } }
    }

    const { card, setting, verifyUrl, qrUrl } = data
    const contact = setting?.headOfficeAddress ? `Head Office: ${setting.headOfficeAddress}` : 'Head Office'
    const address = setting?.registerDetails || setting?.frontFooterText || 'Registered under Societies Act.'
    const notes = setting?.frontFooterText || 'This card remains property of HRCI and must be returned upon request.'

    return {
      props: {
        cardNumber,
        qrUrl: qrUrl || null,
        contact,
        address,
        notes,
      }
    }
  } catch (e) {
    return { props: { error: e?.message || 'Failed to load card', cardNumber: params?.cardNumber || null } }
  }
}

export default function IdCardBackSSR({ error, qrUrl, contact, address, notes, cardNumber }){
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
          <MemberIdCardBack
            // Defaults: minimal + portrait mm sizing
            qrUrl={qrUrl || undefined}
            barcodeUrl={undefined}
            contact={contact}
            address={address}
            notes={notes}
          />
        </div>
      </div>
    </div>
  )
}
