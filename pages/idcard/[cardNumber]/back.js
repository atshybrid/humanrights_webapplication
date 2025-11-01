import MemberIdCardBack from '../../../components/MemberIdCardBack'
import { getHRCIIdCard } from '../../../lib/api'

export async function getServerSideProps({ params }) {
  try {
    const { cardNumber } = params
    const data = await getHRCIIdCard(cardNumber)
    if (!data || !data.card) return { notFound: true }

    const { card, setting, verifyUrl, qrUrl } = data
    const contact = setting?.headOfficeAddress ? `Head Office: ${setting.headOfficeAddress}` : 'Head Office'
    const address = setting?.registerDetails || setting?.frontFooterText || 'Registered under Societies Act.'
    const notes = setting?.frontFooterText || 'This card remains property of HRCI and must be returned upon request.'

    return {
      props: {
        qrUrl: qrUrl || null,
        contact,
        address,
        notes,
      }
    }
  } catch (e) {
    return { notFound: true }
  }
}

export default function IdCardBackSSR({ qrUrl, contact, address, notes }){
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
        </div>

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
  )
}
