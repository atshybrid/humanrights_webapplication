import { useRouter } from 'next/router'
import MemberIdCardBack from '../../../../components/MemberIdCardBack'

export default function MemberIdCardBackPage() {
  const router = useRouter()
  const { query } = router

  const exactMM = query.mm ? (query.mm === '1' || query.mm === 'true') : true
  const orientation = (query.orientation === 'portrait' || query.orientation === 'landscape') ? query.orientation : 'portrait'
  const screenScale = query.scale ? Number(query.scale) : 1
  const backgroundUrl = query.bg || undefined
  const qrUrl = query.qr || undefined
  const barcodeUrl = query.barcode || undefined
  const notes = query.notes || 'If found, please return to the issuing authority. Misuse is punishable by law.'
  const contact = query.contact || 'Helpline: +91 90000 00000'
  const address = query.address || 'Human Rights Council for India, New Delhi, India'

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold">Member ID Card (Back)</h1>
          <div className="space-x-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center rounded-md bg-indigo-600 text-white px-3 py-2 text-sm font-medium shadow hover:bg-indigo-700"
            >
              Print
            </button>
          </div>
        </div>

        <MemberIdCardBack
          exactMM={exactMM}
          orientation={orientation}
          screenScale={screenScale}
          backgroundUrl={backgroundUrl}
          qrUrl={qrUrl}
          barcodeUrl={barcodeUrl}
          notes={notes}
          contact={contact}
          address={address}
        />

        <div className="mt-6 text-sm text-gray-500">
          Tip: pass query params for mm=1, orientation=portrait|landscape, scale=2, bg, qr, barcode, notes, contact, address.
        </div>
      </div>
    </div>
  )
}
