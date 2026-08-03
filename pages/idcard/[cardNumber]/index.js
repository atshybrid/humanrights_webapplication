import IdCardExactFront from '../../../components/IdCardExactFront'
import IdCardExactBack from '../../../components/IdCardExactBack'
import { getHRCIIdCard, getCardWorkPlace, getCardQrUrl } from '../../../lib/api'

export async function getServerSideProps({ params }) {
  try {
    const { cardNumber } = params
    const data = await getHRCIIdCard(cardNumber)
    if (!data || !data.card) {
      return { props: { error: 'Card not found', cardNumber } }
    }
    const { card, setting, verifyUrl, frontLogoUrl: rootFrontLogoUrl } = data || {}

    const member = {
      name: card.fullName || '',
      designation: card.designationName || '',
      level: card.cellName || '',
      membershipNo: card.membershipId || '',
      memberId: card.cardNumber || card.membershipId || '',
      phone: card.mobileNumber || '',
      validity: card.expiresAt ? `Valid Thru: ${new Date(card.expiresAt).toLocaleString('en-US', { month: 'short', year: 'numeric' })}` : '',
      workPlace: getCardWorkPlace(card)
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
    const qrUrl = getCardQrUrl(cardNumber)
    const watermarkFrontUrl = setting?.frontWatermarkUrl || setting?.watermarkUrl || card?.watermarkUrl || 'https://pub-b13a983e33694dbd96cd42158ce2147b.r2.dev/string.png'

    const headOfficeAddress = setting?.headOfficeAddress || card?.headOfficeAddress || ''
    const regionalOfficeAddress = setting?.regionalOfficeAddress || card?.regionalOfficeAddress || ''
    const administrationOfficeAddress = setting?.administrationOfficeAddress || card?.administrationOfficeAddress || ''
    const website = setting?.website || setting?.siteUrl || card?.website || ''
    const secondLogoUrl = (setting?.secondLogoUrl || setting?.frontLogoUrl || card?.secondLogoUrl || card?.frontLogoUrl) || ''
    const contactNumbers = [
      setting?.contactNumber1,
      setting?.contactNumber2,
      setting?.helpLineNumber1,
      setting?.helpLineNumber2,
      card?.helpLineNumber1,
      card?.helpLineNumber2,
    ].filter(Boolean)
    const contactNumber1 = contactNumbers[0] || ''
    const contactNumber2 = contactNumbers[1] || ''
    const watermarkBackUrl = setting?.backWatermarkUrl || setting?.watermarkUrl || card?.watermarkUrl || 'https://pub-b13a983e33694dbd96cd42158ce2147b.r2.dev/string.png'
    const registrationLines = setting?.registrationLines || card?.registrationLines || []
    const termsLines = setting?.termsLines || card?.termsLines || []

    return {
      props: {
        cardNumber,
        member,
        logoUrl,
        stampUrl,
        signUrl,
        photoUrl,
        qrUrl,
        verifyUrl: verifyUrl || '',
        watermarkFrontUrl,
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

const DETAIL_FIELDS = [
  { key: 'name', label: 'Full Name' },
  { key: 'designation', label: 'Designation' },
  { key: 'level', label: 'Cell' },
  { key: 'workPlace', label: 'Work Place' },
  { key: 'memberId', label: 'ID Number' },
  { key: 'phone', label: 'Contact' },
  { key: 'validity', label: 'Valid Upto', format: (v) => (v || '').replace('Valid Thru: ', '') || '-' },
]

function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.122 4.291-1.47-1.47a.75.75 0 10-1.06 1.061l2.25 2.25a.75.75 0 001.137-.089l3.48-4.5z" clipRule="evenodd" />
      </svg>
      Verified Member
    </span>
  )
}

function DetailCard({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100">
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-slate-900 break-words">{value || '-'}</dd>
    </div>
  )
}

export default function IdCardFrontBackPage({
  error,
  cardNumber,
  member,
  logoUrl,
  stampUrl,
  signUrl,
  photoUrl,
  qrUrl,
  verifyUrl,
  watermarkFrontUrl,
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
}) {
  const validUpto = (member?.validity || '').replace('Valid Thru: ', '')

  return (
    <div className="min-h-screen bg-slate-100 font-[Poppins]">
      <div className="relative overflow-hidden bg-gradient-to-br from-[#FE0002] via-[#c80001] to-[#1D0DA1]">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,white,transparent_55%)]" />
        <div className="relative max-w-7xl mx-auto px-4 py-10 sm:py-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Official Member Verification</p>
              <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {member?.name || 'Member ID Card'}
              </h1>
              {member?.memberId ? (
                <p className="mt-1 text-sm text-white/80 font-medium">ID: {member.memberId}</p>
              ) : null}
            </div>
            {!error && member?.memberId ? <VerifiedBadge /> : null}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-6 pb-16">
        {error ? (
          <div className="mb-6 rounded-2xl bg-red-50 text-red-700 px-5 py-4 border border-red-200 shadow-sm">
            {error}
          </div>
        ) : null}

        {!error ? (
          <>
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
              <CardPreview label="Front Side" id="idcard-front">
                <IdCardExactFront
                  logoUrl={logoUrl}
                  qrUrlFront={qrUrl}
                  cellName={member?.level || ''}
                  memberName={member?.name || ''}
                  designation={member?.designation || ''}
                  workPlace={member?.workPlace || ''}
                  idNumber={member?.memberId || ''}
                  contactNumber={member?.phone || ''}
                  validUpto={validUpto}
                  photoUrl={photoUrl || ''}
                  stampUrl={stampUrl || ''}
                  authorSignUrl={signUrl || ''}
                  watermarkUrl={watermarkFrontUrl || ''}
                />
              </CardPreview>

              <CardPreview label="Back Side" id="idcard-back">
                <IdCardExactBack
                  qrUrlBack={qrUrl}
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
              </CardPreview>
            </div>

            <div className="mt-8 grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 rounded-2xl bg-white shadow-lg ring-1 ring-slate-200/80 p-6 sm:p-8">
                <h2 className="text-lg font-bold text-slate-900">Member Details</h2>
                <p className="mt-1 text-sm text-slate-500">Information displayed on the official HRCI identity card.</p>
                <dl className="mt-6 grid sm:grid-cols-2 gap-3">
                  {DETAIL_FIELDS.map(({ key, label, format }) => (
                    <DetailCard
                      key={key}
                      label={label}
                      value={format ? format(member?.[key]) : member?.[key]}
                    />
                  ))}
                </dl>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl bg-white shadow-lg ring-1 ring-slate-200/80 p-6">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Quick Actions</h3>
                  <div className="mt-4 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FE0002] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#d90002] transition-colors"
                    >
                      Print ID Card
                    </button>
                    <DownloadButton targetId="idcard-front" filename={`${cardNumber}-front.jpg`} label="Download Front" />
                    <DownloadButton targetId="idcard-back" filename={`${cardNumber}-back.jpg`} label="Download Back" />
                  </div>
                </div>

                {verifyUrl ? (
                  <div className="rounded-2xl bg-white shadow-lg ring-1 ring-slate-200/80 p-6">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Verification</h3>
                    <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                      Scan the QR code on the card to verify this member&apos;s identity with HRCI records.
                    </p>
                    {qrUrl ? (
                      <div className="mt-4 flex justify-center">
                        <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200 shadow-inner">
                          <img src={qrUrl} alt="Verification QR Code" className="h-28 w-28 object-contain" />
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : null}

                <p className="text-xs text-slate-400 text-center px-2">
                  Data sourced securely from HRCI. For verification purposes only.
                </p>
              </div>
            </div>
          </>
        ) : null}
      </div>

      <style jsx global>{`
        @media print {
          nav, footer, .h-16 { display: none !important; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  )
}

function CardPreview({ label, id, children }) {
  return (
    <div className="flex h-full flex-col rounded-2xl bg-white shadow-lg ring-1 ring-slate-200/80">
      <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</span>
        <span className="h-2 w-2 rounded-full bg-emerald-400" title="Live preview" />
      </div>
      <div
        id={id}
        className="flex flex-1 items-center justify-center overflow-hidden rounded-b-2xl bg-gradient-to-b from-slate-50 to-white px-4 py-6 sm:px-6 sm:py-8"
        style={{ minHeight: '24rem' }}
      >
        <div className="origin-center scale-[1.35] sm:scale-150">
          {children}
        </div>
      </div>
    </div>
  )
}

function DownloadButton({ targetId, filename, label }) {
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          const node = document.getElementById(targetId)?.querySelector('.card')
          if (!node) return
          const { toJpeg } = await import('html-to-image')
          const dataUrl = await toJpeg(node, { quality: 0.98, pixelRatio: 3 })
          const link = document.createElement('a')
          link.download = filename
          link.href = dataUrl
          link.click()
        } catch (e) {
          console.error(e)
        }
      }}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-900 transition-colors"
    >
      {label}
    </button>
  )
}
