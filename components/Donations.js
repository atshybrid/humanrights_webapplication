import { useEffect, useState } from 'react'
import { getDonationEvents } from '../lib/api'
import { CardSkeleton } from './Skeleton'

export default function Donations(){
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(()=>{
    let alive = true
    setLoading(true)
    getDonationEvents()
      .then(data => { if(alive){ setEvents(data || []); } })
      .catch(()=>{})
      .finally(()=>{ if(alive){ setLoading(false) } })
    return () => { alive = false }
  },[])
  const formatINR = (n) => {
    try { return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n||0) } catch(e){ return `₹${(n||0).toLocaleString('en-IN')}` }
  }
  return (
    <section id="donations" className="mt-16">
      <h2 className="text-3xl font-bold text-gray-900">Donations</h2>
      <div className="mt-2 h-1.5 w-16 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
      <p className="mt-4 text-gray-600">Your contribution helps us run investigations, legal aid and community programs.</p>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-5">
        {loading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : events.length === 0 ? (
          <>
            <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm">
              <h4 className="font-semibold text-gray-900">One-time</h4>
              <p className="mt-2">Support immediate relief and legal aid.</p>
              <a href="/donations" className="mt-4 inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-secondary">Donate ₹500</a>
            </div>
            <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm">
              <h4 className="font-semibold text-gray-900">Monthly</h4>
              <p className="mt-2">Sustain long-term campaigns.</p>
              <a href="/donations" className="mt-4 inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-secondary">Start ₹250 / mo</a>
            </div>
            <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm">
              <h4 className="font-semibold text-gray-900">Corporate</h4>
              <p className="mt-2">Partner with us for programs and CSR.</p>
              <a href="/contact" className="mt-4 inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-secondary">Contact us</a>
            </div>
          </>
        ) : events.map(ev=>{
          const goal = Number(ev.goalAmount || 0)
          const raised = Number(ev.collectedAmount || 0)
          const pct = goal > 0 ? Math.min(100, Math.round((raised/goal)*100)) : 0
          return (
            <div key={ev.id} className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm">
              <img src={ev.coverImageUrl || '/images/event-placeholder.svg'} alt={ev.title} className="w-full h-36 object-cover rounded" />
              <h4 className="font-semibold text-gray-900 mt-3">{ev.title}</h4>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{ev.description}</p>
              <div className="mt-3">
                {goal > 0 ? (
                  <>
                    <div className="h-2 w-full rounded-full bg-gray-100">
                      <div className="h-2 rounded-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="mt-1 flex items-center justify-between text-xs text-gray-600">
                      <span>{formatINR(raised)} raised</span>
                      <span>of {formatINR(goal)}</span>
                    </div>
                  </>
                ) : (
                  <div className="text-xs text-gray-500">{formatINR(raised)} raised</div>
                )}
              </div>
              <div className="mt-4 flex gap-2">
                <a href={`/donations?mode=event&eventId=${encodeURIComponent(ev.id)}`} className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-secondary">Donate</a>
                <a href={`/events/${ev.id}`} className="inline-flex items-center rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Details</a>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
