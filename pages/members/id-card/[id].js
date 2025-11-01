import { useRouter } from 'next/router'
import MemberIdCardFront from '../../../components/MemberIdCardFront'

export default function MemberIdCardPage() {
  const router = useRouter()
  const { query } = router

  // Accept dynamic values via query params so you can test quickly, e.g.:
  // /members/id-card/123?name=John%20Doe&designation=State%20President&level=STATE&membershipNo=HRCI-123456&memberId=ID-7890&phone=+91%2090000%200000&validity=Valid%20Thru%3A%20Dec%202026&logo=/images/logo.svg&photo=https://...&stamp=https://...&sign=https://...
  const member = {
    name: query.name || 'Member Name',
    designation: query.designation || 'Designation',
    level: query.level || 'Level',
    membershipNo: query.membershipNo || 'HRCI-000000',
    memberId: query.memberId || query.id || 'ID-0000',
    phone: query.phone || '+91 90000 00000',
    validity: query.validity || 'Valid Thru: Dec 2026',
  }

  const themeColor = query.themeColor || 'indigo-700'
  const orgName = query.orgName || 'Human Rights Council for India'
  const tagline = query.tagline || 'Justice • Equality • Dignity'
  const logoUrl = query.logo || '/images/logo.svg'
  const photoUrl = query.photo || ''
  const stampUrl = query.stamp || ''
  const signUrl = query.sign || ''
  const backgroundUrl = query.bg || undefined
  const minimal = query.minimal ? (query.minimal === '1' || query.minimal === 'true') : true
  const noHeader = query.noHeader ? (query.noHeader === '1' || query.noHeader === 'true') : false
  const noFooterAccent = query.noFooter ? (query.noFooter === '1' || query.noFooter === 'true') : true
  const gradientStart = query.g1 || undefined
  const gradientEnd = query.g2 || undefined
  const gradientAngle = query.angle ? Number(query.angle) : 90
  const exactMM = query.mm ? (query.mm === '1' || query.mm === 'true') : true
  const orientation = (query.orientation === 'portrait' || query.orientation === 'landscape') ? query.orientation : 'portrait'
  const screenScale = query.scale ? Number(query.scale) : 1

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold">Member ID Card (Front)</h1>
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

        <MemberIdCardFront
          logoUrl={logoUrl}
          photoUrl={photoUrl}
          stampUrl={stampUrl}
          signUrl={signUrl}
          orgName={orgName}
          tagline={tagline}
          themeColor={themeColor}
          gradientStart={gradientStart}
          gradientEnd={gradientEnd}
          gradientAngle={gradientAngle}
          exactMM={exactMM}
          orientation={orientation}
          screenScale={screenScale}
          backgroundUrl={backgroundUrl}
          minimal={minimal}
          noHeader={noHeader}
          noFooterAccent={noFooterAccent}
          member={member}
        />

        <div className="mt-6 text-sm text-gray-500">
          Tip: pass query params to customize quickly (name, designation, level, membershipNo, memberId, phone, validity, logo, photo, stamp, sign, themeColor, orgName, tagline, g1, g2, angle, mm=1, orientation=landscape|portrait, scale=2, bg=backgroundImageUrl, minimal=1, noHeader=1, noFooter=1).
        </div>
      </div>
    </div>
  )
}
