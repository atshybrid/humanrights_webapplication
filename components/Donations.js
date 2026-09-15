import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { getDonationEvents } from '../lib/api'
import SectionHeader from './SectionHeader'
import { CardSkeleton } from './Skeleton'

function filterLandingEvents(events = []) {
  return events.filter((ev) => !/\bgeneral donation\b/i.test(String(ev?.title || '')))
}

function formatINR(n) {
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0)
  } catch {
    return `₹${(n || 0).toLocaleString('en-IN')}`
  }
}

export default function Donations({ events: initialEvents = null }) {
  const [events, setEvents] = useState(initialEvents || [])
  const [loading, setLoading] = useState(initialEvents == null)

  useEffect(() => {
    if (initialEvents != null) return undefined
    let alive = true
    setLoading(true)
    getDonationEvents()
      .then((data) => { if (alive) setEvents(data || []) })
      .catch(() => {})
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [initialEvents])

  const filteredEvents = useMemo(() => filterLandingEvents(events), [events])

  if (!loading && filteredEvents.length === 0) return null

  return (
    <section id="donations" className="scroll-mt-20">
      <SectionHeader
        title="Donations"
        description="Your contribution helps us run investigations, legal aid and community programs."
        actionHref="/donations"
        actionLabel="View all"
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          filteredEvents.map((ev) => {
            const goal = Number(ev.goalAmount || 0)
            const raised = Number(ev.collectedAmount || 0)
            const pct = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0
            return (
              <article key={ev.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
                <img
                  src={ev.coverImageUrl || '/images/event-placeholder.svg'}
                  alt={ev.title}
                  className="h-40 w-full object-cover sm:h-36"
                  loading="lazy"
                />
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900">{ev.title}</h3>
                  {ev.description ? (
                    <p className="mt-1 line-clamp-2 text-sm text-gray-600">{ev.description}</p>
                  ) : null}
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
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      href={`/donations?mode=event&eventId=${encodeURIComponent(ev.id)}`}
                      className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-secondary"
                    >
                      Donate
                    </Link>
                    <Link
                      href={`/events/${ev.id}`}
                      className="inline-flex items-center rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </article>
            )
          })
        )}
      </div>
    </section>
  )
}
