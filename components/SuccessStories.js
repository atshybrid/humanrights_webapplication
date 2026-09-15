import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { getStories } from '../lib/api'
import SectionHeader from './SectionHeader'
import { CardSkeleton } from './Skeleton'

export default function SuccessStories({ stories: initialStories = null }) {
  const [stories, setStories] = useState(initialStories || [])
  const [loading, setLoading] = useState(initialStories == null)

  useEffect(() => {
    if (initialStories != null) return undefined
    let alive = true
    setLoading(true)
    getStories()
      .then((data) => { if (alive) setStories(data || []) })
      .catch(() => {})
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [initialStories])

  const displayed = useMemo(() => (stories || []).slice(0, 4), [stories])

  if (!loading && displayed.length === 0) return null

  return (
    <section id="success-stories" className="scroll-mt-20">
      <SectionHeader
        title="Success Stories"
        description="Real cases where rights were defended and lives improved."
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-6">
        {loading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          displayed.map((s) => (
            <Link
              key={s.id}
              href={`/stories/${s.id}`}
              className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              <div className="relative h-44 w-full sm:h-40">
                <img
                  src={s.heroImageUrl || '/images/story-placeholder.svg'}
                  alt={s.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-900 ring-1 ring-gray-200">
                  Case study
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-gray-900 group-hover:text-secondary">{s.title}</h3>
                {s.description ? (
                  <p className="mt-1 line-clamp-2 text-sm text-gray-600">{s.description}</p>
                ) : null}
                <span className="mt-3 inline-flex items-center text-sm font-medium text-secondary">
                  View story
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-4 w-4">
                    <path fillRule="evenodd" d="M12.97 4.97a.75.75 0 011.06 0l6.5 6.5a.75.75 0 010 1.06l-6.5 6.5a.75.75 0 11-1.06-1.06L18.44 13H4.75a.75.75 0 010-1.5h13.69l-5.47-5.47a.75.75 0 010-1.06z" clipRule="evenodd" />
                  </svg>
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  )
}
