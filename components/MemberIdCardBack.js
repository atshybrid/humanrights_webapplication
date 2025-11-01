import ImageWithFallback from './ImageWithFallback'

/**
 * MemberIdCardBack
 * Back side of the membership ID card; supports exact mm size and optional full background.
 * Props are parallel to the front for consistent sizing/printing.
 */
export default function MemberIdCardBack({
  exactMM = true,
  orientation = 'portrait', // portrait: 54mm x 85.6mm
  screenScale = 1,
  backgroundUrl = '/images/idcard/back-bg.png',
  qrUrl,
  barcodeUrl,
  notes = 'If found, please return to the issuing authority. Misuse is punishable by law.',
  contact = 'Helpline: +91 90000 00000',
  address = 'Human Rights Council for India, New Delhi, India',
}) {
  const cardWidth = 856
  const cardHeight = 540
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
          {/* Content area - keep padding modest to respect mm size */}
          <div className="relative z-10 h-full w-full p-4 text-[11px] text-gray-800">
            <div className="space-y-2">
              <div className="font-semibold text-[12px]">Instructions</div>
              <ul className="list-disc pl-4 space-y-1">
                <li>This card is property of the issuing authority.</li>
                <li>Present on demand by authorized personnel.</li>
                <li>Non-transferable and subject to revocation.</li>
              </ul>
              <div className="text-[11px] text-gray-700 pt-1">{notes}</div>
            </div>

            <div className="absolute left-4 right-4 bottom-4 flex items-end justify-between gap-3">
              <div className="text-[10px] text-gray-600">
                <div>{contact}</div>
                <div>{address}</div>
              </div>
              <div className="flex items-end gap-3">
                {qrUrl ? (
                  <ImageWithFallback src={qrUrl} alt="QR" className="w-16 h-16 object-contain" />
                ) : null}
                {barcodeUrl ? (
                  <ImageWithFallback src={barcodeUrl} alt="Barcode" className="h-12 w-28 object-contain" />
                ) : null}
              </div>
            </div>
          </div>

          {/* Subtle border accent */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-200"></div>
        </div>
      </div>
    </div>
  )
}
