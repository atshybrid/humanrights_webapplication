import { useEffect, useState } from 'react'
import { getDonationEvents } from '../lib/api'

export default function Events(){
  const [events, setEvents] = useState([])
  useEffect(()=>{ getDonationEvents().then(setEvents).catch(()=>{}) },[])
  return (
    <section id="events" className="mt-12">
      <h2 className="text-3xl font-bold text-gray-900">Events</h2>
      <div className="mt-2 h-1.5 w-16 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
      <p className="mt-4 text-gray-600">Workshops, public hearings, and legal clinics — see what's coming.</p>
      <ul className="mt-6 space-y-4">
        {events.length === 0 ? (
          <li className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm">No upcoming events</li>
        ) : events.map(ev=>(
          <li key={ev.id} className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div>
              <strong className="text-gray-900">{ev.title}</strong>
              <div className="text-sm text-gray-600">{ev.startAt ? new Date(ev.startAt).toLocaleDateString() : 'Date TBA'} · {ev.description || ''}</div>
            </div>
            <a className="self-start sm:self-auto inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-secondary">Register</a>
          </li>
        ))}
      </ul>
    </section>
  )
}
