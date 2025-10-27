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
      <header className="relative bg-gray-900">
        <img src={img} alt={event.title} className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="relative max-w-6xl mx-auto px-6 py-16 text-white">
          <h1 className="text-3xl sm:text-4xl font-extrabold">{event.title}</h1>
          <p className="mt-2 max-w-3xl text-white/90">{event.description}</p>
          {goal > 0 && (
            <div className="mt-6">
              <div className="h-2 w-full rounded-full bg-white/30">
                <div className="h-2 rounded-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${pct}%` }} />
              </div>
              <div className="mt-1 flex items-center justify-between text-xs text-white/90">
                <span>{fmt(raised)} raised</span>
                <span>of {fmt(goal)}</span>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <section className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900">Support this event</h2>
          <p className="mt-1 text-gray-600">Choose a preset or enter any amount on the next step.</p>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
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
 
