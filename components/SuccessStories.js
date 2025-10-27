import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { getStories } from '../lib/api'
import { CardSkeleton } from './Skeleton'

export default function SuccessStories(){
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(()=>{
    let alive = true
    setLoading(true)
    getStories()
      .then(data => { if(alive){ setStories(data || []) } })
      .catch(()=>{})
      .finally(()=>{ if(alive){ setLoading(false) } })
    return ()=>{ alive = false }
  },[])
  const displayed = useMemo(() => (stories || []).slice(0, 4), [stories])
  return (
    <section id="success-stories" className="mt-16">
      <h2 className="text-3xl font-bold text-gray-900">Success Stories</h2>
      <div className="mt-2 h-1.5 w-16 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
      <p className="mt-4 text-gray-600">Real cases where rights were defended and lives improved.</p>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {loading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : displayed.length === 0 ? (
          <>
            {[
              {
                title: 'Access to Education Restored',
                desc: 'We helped a community restore scholarships and school access.',
              },
              {
                title: 'Legal Support for Workers',
                desc: 'Collective bargaining rights established after a legal campaign.',
              },
              {
                title: 'Healthcare Access Secured',
                desc: 'Facilitated treatments for families through public schemes.',
              },
              {
                title: 'Rights Awareness Drive',
                desc: 'Reached 2,000+ citizens with legal awareness workshops.',
              },
            ].map((s, idx) => (
              <article key={idx} className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
                <div className="relative h-40 w-full">
                  <img src={'/images/story-placeholder.svg'} alt={s.title} className="h-full w-full object-cover" />
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-900 ring-1 ring-gray-200">
                    Case study
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900">{s.title}</h3>
                  <p className="mt-1 text-sm text-gray-600">{s.desc}</p>
                </div>
              </article>
            ))}
          </>
        ) : (
          displayed.map((s) => (
            <Link key={s.id} href={`/stories/${s.id}`} className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-secondary">
              <div className="relative h-40 w-full">
                <img src={s.heroImageUrl || '/images/story-placeholder.svg'} alt={s.title} className="h-full w-full object-cover" />
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-900 ring-1 ring-gray-200">
                  Case study
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-gray-900 group-hover:text-secondary">{s.title}</h3>
                {s.description ? (
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">{s.description}</p>
                ) : null}
                <span className="mt-3 inline-flex items-center text-sm font-medium text-secondary">View story
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-4 w-4"><path fillRule="evenodd" d="M12.97 4.97a.75.75 0 011.06 0l6.5 6.5a.75.75 0 010 1.06l-6.5 6.5a.75.75 0 11-1.06-1.06L18.44 13H4.75a.75.75 0 010-1.5h13.69l-5.47-5.47a.75.75 0 010-1.06z" clipRule="evenodd"/></svg>
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  )
}
