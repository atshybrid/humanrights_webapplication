import ImageWithFallback from './ImageWithFallback'

/**
 * MemberIdCardFront
 * Front side of a membership ID card with dynamic assets and fields.
 * Props:
 * - logoUrl: string
 * - photoUrl: string
 * - stampUrl: string (overlay above photo)
 * - signUrl: string (authorized signature image)
 * - orgName: string
 * - tagline: string
 * - themeColor: string (tailwind color class suffix, e.g. 'indigo-700')
 * - member: {
 *     name: string,
 *     designation?: string,
 *     level?: string,
 *     membershipNo?: string,
 *     memberId?: string,
 *     phone?: string,
 *     validity?: string
 *   }
 */
export default function MemberIdCardFront({
  logoUrl = '/images/logo.svg',
  photoUrl = '',
  stampUrl = '',
  signUrl = '',
  orgName = 'Human Rights Council for India',
  tagline = 'Justice • Equality • Dignity',
  themeColor = 'indigo-700',
  gradientStart = '#FE0002',
  gradientEnd = '#1D0DA1',
  gradientAngle = 90,
  exactMM = true,
  orientation = 'portrait', // 'landscape' | 'portrait'
  screenScale = 1,
  backgroundUrl = '/images/idcard/front-bg.png',
  minimal = true,
  noHeader = false,
  noFooterAccent = true,
  member = {},
}) {
  const {
    name = 'Member Name',
    designation = 'Designation',
    level = 'Level',
    membershipNo = 'HRCI-000000',
    memberId = 'ID-0000',
    phone = '+91 90000 00000',
    validity = 'Valid Thru: Dec 2026',
  } = member || {}

  // Card dimensions approximating CR80 (85.6mm x 54mm) scaled for screen
  // Default pixel dimensions matching CR80 ratio
  const cardWidth = 856 // px (landscape)
  const cardHeight = 540 // px (landscape)

  // Whitelist Tailwind color classes to ensure they are included in build
  const colorMap = {
    'indigo-700': 'bg-indigo-700',
    'blue-700': 'bg-blue-700',
    'emerald-700': 'bg-emerald-700',
    'red-700': 'bg-red-700',
    'slate-800': 'bg-slate-800',
  }
  const accentClass = colorMap[themeColor] || colorMap['indigo-700']

  const isPortrait = orientation === 'portrait'
  const sizeStyle = exactMM
    ? { width: isPortrait ? '54mm' : '85.6mm', height: isPortrait ? '85.6mm' : '54mm' }
    : { width: `${cardWidth}px`, height: `${cardHeight}px` }

  return (
    <div className="w-full flex justify-center print:mt-0">
      <div className="idcard-scale" style={{ transform: exactMM && screenScale !== 1 ? `scale(${Number(screenScale) || 1})` : undefined }}>
        <div
          className="relative bg-white rounded-2xl shadow-lg overflow-hidden border"
          style={{
            ...sizeStyle,
            backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : undefined,
            backgroundSize: backgroundUrl ? 'cover' : undefined,
            backgroundPosition: backgroundUrl ? 'center' : undefined,
          }}
        >
        {/* Watermark logo (hidden in minimal mode) */}
        {!minimal && logoUrl ? (
          <div className="absolute inset-0 pointer-events-none select-none opacity-5">
            <div className="w-full h-full flex items-center justify-center">
              <ImageWithFallback
                src={logoUrl}
                alt="Watermark"
                className="w-2/3 h-auto object-contain"
              />
            </div>
          </div>
        ) : null}

        {/* Header Bar (optional) */}
        {!noHeader ? (
          <div className={`relative z-10 flex items-center gap-4 px-6 py-3 text-white`}
               style={
                 gradientStart && gradientEnd
                   ? { background: `linear-gradient(${Number(gradientAngle) || 90}deg, ${gradientStart}, ${gradientEnd})` }
                   : undefined
               }>
            {!gradientStart || !gradientEnd ? (
              <div className={`absolute inset-0 -z-10 ${accentClass}`} aria-hidden="true" />
            ) : null}
            {logoUrl ? (
              <div className={minimal ? '' : 'shrink-0 bg-white/10 rounded-md p-2'}>
                <ImageWithFallback src={logoUrl} alt="Logo" className="h-10 w-auto object-contain" />
              </div>
            ) : null}
            <div className="leading-tight">
              <div className="text-lg font-semibold tracking-wide">{orgName}</div>
              <div className="text-xs opacity-90">{tagline}</div>
            </div>
          </div>
        ) : null}

        {/* Content */}
        <div className="relative z-10 grid grid-cols-12 gap-6 px-6 pt-6">
          {/* Photo + Stamp */}
          <div className="col-span-5 flex items-start">
            <div className="relative">
              <div className={minimal ? 'w-56 h-72 overflow-hidden' : 'w-56 h-72 rounded-xl overflow-hidden ring-2 ring-gray-200 bg-gray-100'}>
                {photoUrl ? (
                  <ImageWithFallback
                    src={photoUrl}
                    alt="Member Photo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Photo</div>
                )}
              </div>
              {stampUrl ? (
                <div className={minimal ? 'absolute -top-4 -right-4' : 'absolute -top-6 -right-6 rotate-[-12deg] drop-shadow'}>
                  <ImageWithFallback
                    src={stampUrl}
                    alt="Stamp"
                    className="w-28 h-28 object-contain opacity-90"
                  />
                </div>
              ) : null}
            </div>
          </div>

          {/* Details */}
          <div className="col-span-7">
            <div className={minimal ? 'p-4' : 'bg-white/90 backdrop-blur rounded-xl p-5 ring-1 ring-gray-200'}>
              <div className="mb-3">
                <div className="text-2xl font-semibold text-gray-900 leading-snug">{name}</div>
                <div className="text-sm text-gray-600">{designation}{level ? ` • ${level}` : ''}</div>
              </div>

              <div className="grid grid-cols-12 gap-x-4 gap-y-2 text-[13px]">
                <Field label="Membership No" value={membershipNo} />
                <Field label="Member ID" value={memberId} />
                <Field label="Phone" value={phone} />
                <Field label="Validity" value={validity} />
              </div>

              <div className="mt-6 flex items-end justify-between">
                {gradientStart && gradientEnd ? (
                  <div className="h-1.5 w-40 rounded-full" style={{ background: `linear-gradient(${Number(gradientAngle) || 90}deg, ${gradientStart}, ${gradientEnd})` }}></div>
                ) : (
                  <div className={`h-1.5 w-40 rounded-full ${accentClass}`}></div>
                )}
                <div className="text-right">
                  {signUrl ? (
                    <ImageWithFallback
                      src={signUrl}
                      alt="Authorized Signature"
                      className="h-10 w-auto object-contain inline-block"
                    />
                  ) : (
                    <div className="h-10"></div>
                  )}
                  <div className="text-[11px] text-gray-500 -mt-1">Authorized Signature</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer accent */}
        {!noFooterAccent ? (
          gradientStart && gradientEnd ? (
            <div className="absolute bottom-0 left-0 right-0 h-1.5" style={{ background: `linear-gradient(${Number(gradientAngle) || 90}deg, ${gradientStart}, ${gradientEnd})` }}></div>
          ) : (
            <div className={`absolute bottom-0 left-0 right-0 h-1.5 ${accentClass}`}></div>
          )
        ) : null}
        </div>
      </div>
    </div>
  )
}

function Field({ label, value }) {
  return (
    <div className="col-span-12 sm:col-span-6">
      <div className="text-gray-500 text-[11px] uppercase tracking-wide">{label}</div>
      <div className="text-gray-900 font-medium">{value || '-'}</div>
    </div>
  )
}
