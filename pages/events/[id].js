import Head from 'next/head'
import Link from 'next/link'
import { getEventById } from '../../lib/api'

export default function EventDetailPage({ event }){
  if (!event) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-2xl font-semibold text-gray-900">Event not found</h1>
        <p className="mt-2 text-gray-600">The event you are looking for does not exist or may have been removed.</p>
        <Link href="/" className="mt-6 inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-secondary">Go back home</Link>
      </main>
    )
  }

  const goal = Number(event.goalAmount || 0)
  const raised = Number(event.collectedAmount || 0)
  const pct = goal > 0 ? Math.min(100, Math.round((raised/goal)*100)) : 0
  const img = event.coverImageUrl || '/images/event-placeholder.svg'
  const rawPresets = Array.isArray(event.presets) ? event.presets : []
  const defaultPresets = [500, 1000, 2000, 10000]
  const presets = (() => {
    const arr = rawPresets.filter(n => typeof n === 'number' && n > 0)
    if (arr.length === 0) return defaultPresets
    return Array.from(new Set(arr)).sort((a,b)=>a-b)
  })()

  const fmt = (n) => {
    try { return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n||0) } catch(e){ return `₹${(n||0).toLocaleString('en-IN')}` }
  }

  return (
    <>
      <Head>
        <title>{event.title} — Event</title>
      </Head>
      {/* Clean gradient header without background image */}
      <header className="relative bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-6xl mx-auto px-6 py-14 sm:py-16 text-white">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight drop-shadow-sm">{event.title}</h1>
          {goal > 0 && (
            <p className="mt-2 text-white/90 text-sm">{fmt(raised)} raised of {fmt(goal)}</p>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Description + Progress + Presets + CTAs */}
          <section className="lg:col-span-2 rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900">About this event</h2>
            {event.description && (
              <p className="mt-2 text-gray-700 leading-relaxed">{event.description}</p>
            )}

            {goal > 0 && (
              <div className="mt-5">
                <div className="h-2 w-full rounded-full bg-gray-100">
                  <div className="h-2 rounded-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${pct}%` }} />
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-gray-600">
                  <span>{fmt(raised)} raised</span>
                  <span>of {fmt(goal)}</span>
                </div>
              </div>
            )}

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700">Quick amounts</h3>
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {presets.map((amt) => (
                  <Link
                    key={amt}
                    href={`/donations?mode=event&eventId=${encodeURIComponent(event.id)}&amount=${amt}`}
                    className="block rounded-xl border border-gray-200 bg-white px-4 py-5 text-center text-sm font-semibold text-gray-900 shadow-sm transition hover:border-secondary hover:shadow"
                  >
                    ₹{amt.toLocaleString('en-IN')}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <Link
                href={`/donations?mode=event&eventId=${encodeURIComponent(event.id)}`}
                className="inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-secondary"
              >
                Donate now
              </Link>
              <Link href="/donations" className="ml-3 inline-flex items-center rounded-full border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Other donation options
              </Link>
            </div>
          </section>

          {/* Right: Image card */}
          <aside className="lg:col-span-1">
            <div className="rounded-2xl overflow-hidden bg-white shadow-sm ring-1 ring-gray-200">
              <img src={img} alt={event.title} className="w-full h-64 object-cover" />
              <div className="p-4 text-xs text-gray-500">Event cover</div>
            </div>
          </aside>
        </div>
      </main>
    </>
  )
}

export async function getServerSideProps({ params }){
  try{
    const event = await getEventById(params.id)
    if(!event){
      return { notFound: true }
    }
    return { props: { event } }
  }catch(e){
    return { notFound: true }
  }
}
 
