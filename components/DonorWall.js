import { useEffect, useMemo, useState } from 'react'
import { getTopDonors } from '../lib/api'
import SectionHeader from './SectionHeader'
import { PillSkeleton } from './Skeleton'

export default function DonorWall({ donors: initialDonors = null }) {
  const [donors, setDonors] = useState(initialDonors || [])
  const [loading, setLoading] = useState(initialDonors == null)

  useEffect(() => {
    if (initialDonors != null) return undefined
    let alive = true
    setLoading(true)
    getTopDonors()
      .then((data) => { if (alive) setDonors(data || []) })
      .catch(() => {})
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [initialDonors])

  const marqueeItems = useMemo(() => {
    if (!donors || donors.length === 0) return []
    return [...donors, ...donors]
  }, [donors])

  if (!loading && donors.length === 0) return null

  return (
    <section id="donor-wall" className="scroll-mt-20">
      <SectionHeader
        title="Donor Wall"
        description="We recognise contributors who help power our work."
      />

      <div className="group relative mt-2">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-white to-transparent sm:w-12" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-white to-transparent sm:w-12" />

        {loading ? (
          <div className="overflow-hidden">
            <div className="flex gap-3 whitespace-nowrap sm:gap-4">
              <PillSkeleton />
              <PillSkeleton />
              <PillSkeleton />
              <PillSkeleton />
            </div>
          </div>
        ) : (
          <div className="overflow-hidden">
            <div
              className="flex animate-marquee gap-3 whitespace-nowrap will-change-transform group-hover:[animation-play-state:paused] sm:gap-4"
              style={{ width: 'max-content' }}
            >
              {marqueeItems.map((d, idx) => (
                <div
                  key={`${d.key || d.id || d.displayName}-${idx}`}
                  className="flex min-w-[200px] max-w-[240px] items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-3 shadow-sm sm:min-w-[220px] sm:px-4"
                >
                  <img
                    src={d.photoUrl || '/images/donor-placeholder.svg'}
                    className="h-12 w-12 shrink-0 rounded-full object-cover ring-1 ring-gray-200 sm:h-14 sm:w-14"
                    alt={d.displayName || 'Donor'}
                    loading="lazy"
                  />
                  <div className="min-w-0 truncate">
                    <div className="truncate font-semibold text-gray-900">{d.displayName}</div>
                    <div className="truncate text-sm text-gray-600">₹{d.totalAmount}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
