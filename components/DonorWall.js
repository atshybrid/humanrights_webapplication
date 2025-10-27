import { useEffect, useMemo, useState } from 'react'
import { getTopDonors } from '../lib/api'
import { PillSkeleton } from './Skeleton'

export default function DonorWall(){
  const [donors, setDonors] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(()=>{
    let alive = true
    setLoading(true)
    getTopDonors()
      .then(data => { if(alive){ setDonors(data || []) } })
      .catch(()=>{})
      .finally(()=>{ if(alive){ setLoading(false) } })
    return ()=>{ alive = false }
  },[])

  const marqueeItems = useMemo(() => {
    if (!donors || donors.length === 0) return []
    return [...donors, ...donors]
  }, [donors])

  return (
    <section id="donor-wall" className="mt-16">
      <h2 className="text-3xl font-bold text-gray-900">Donor Wall</h2>
      <div className="mt-2 h-1.5 w-16 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
      <p className="mt-4 text-gray-600">We recognise contributors who help power our work.</p>

      {/* One-row auto-scrolling marquee */}
      <div className="relative mt-6 group">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-gray-50 to-transparent"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-gray-50 to-transparent"></div>

        {loading ? (
          <div className="overflow-hidden">
            <div className="flex gap-4 whitespace-nowrap">
              <PillSkeleton />
              <PillSkeleton />
              <PillSkeleton />
              <PillSkeleton />
              <PillSkeleton />
            </div>
          </div>
        ) : donors.length === 0 ? (
          <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm text-center">No donors yet</div>
        ) : (
          <div className="overflow-hidden">
            <div className="flex gap-4 whitespace-nowrap will-change-transform animate-marquee group-hover:[animation-play-state:paused]" style={{ width: 'max-content' }}>
              {marqueeItems.map((d, idx) => (
                <div key={`${d.key || d.id || d.displayName}-${idx}`} className="min-w-[220px] max-w-[240px] rounded-xl border border-gray-200 bg-white shadow-sm px-4 py-3 flex items-center gap-3">
                  <img src={d.photoUrl || '/images/donor-placeholder.svg'} className="h-14 w-14 rounded-full object-cover ring-1 ring-gray-200" alt={d.displayName || 'Donor'} />
                  <div className="truncate">
                    <div className="font-semibold text-gray-900 truncate">{d.displayName}</div>
                    <div className="text-sm text-gray-600 truncate">₹{d.totalAmount}</div>
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
