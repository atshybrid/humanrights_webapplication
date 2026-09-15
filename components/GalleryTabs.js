import { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { groupGalleryByEvent, getGalleryImageSrc } from '../lib/gallery'

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ||
  process.env.NEXT_PUBLIC_API_URL ||
  'https://app.humanrightscouncilforindia.org/api/v1'

const TABS = [
  { id: 'EVENT_CLIP', label: 'Events' },
  { id: 'PRESS_CLIP', label: 'Press Clips' },
]

async function loadGalleryPage(category, cursor) {
  const path = category === 'PRESS_CLIP' ? '/gallery/press-clips' : '/gallery/event-clips'
  const qs = new URLSearchParams({ limit: '24', mediaType: 'IMAGE' })
  if (cursor) qs.set('cursor', cursor)
  const res = await fetch(`${API_BASE}${path}?${qs}`)
  if (!res.ok) throw new Error('Failed to load gallery')
  return res.json()
}

function GalleryCard({ item, onOpen }) {
  const src = getGalleryImageSrc(item)
  if (!src) return null

  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className="group overflow-hidden rounded-xl border border-gray-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <Image
          src={src}
          alt={item.title || 'Gallery image'}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </div>
      {item.title ? (
        <p className="line-clamp-2 p-3 text-sm font-medium text-gray-900">{item.title}</p>
      ) : null}
    </button>
  )
}

function EventSection({ group, onOpen }) {
  const dateLabel = group.date
    ? new Date(group.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{group.title}</h3>
          {dateLabel ? <p className="mt-1 text-sm text-gray-500">{dateLabel}</p> : null}
        </div>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
          {group.items.length} photo{group.items.length === 1 ? '' : 's'}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {group.items.map((item) => (
          <GalleryCard key={item.id} item={item} onOpen={onOpen} />
        ))}
      </div>
    </section>
  )
}

export default function GalleryTabs({ initialPress, initialEvents }) {
  const [tab, setTab] = useState('EVENT_CLIP')
  const [items, setItems] = useState([])
  const [cursor, setCursor] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeItem, setActiveItem] = useState(null)

  const seed = tab === 'PRESS_CLIP' ? initialPress : initialEvents

  const load = useCallback(async (reset = false) => {
    setLoading(true)
    try {
      const json = await loadGalleryPage(tab, reset ? null : cursor)
      setItems((prev) => (reset ? json.data : [...prev, ...json.data]))
      setCursor(json.nextCursor)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [tab, cursor])

  useEffect(() => {
    setItems(seed?.data || [])
    setCursor(seed?.nextCursor || null)
  }, [tab, seed])

  const eventGroups = useMemo(() => groupGalleryByEvent(items), [items])

  return (
    <div>
      <div className="mb-8 inline-flex rounded-full bg-gray-100 p-1">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              tab === id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {eventGroups.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <p className="text-lg font-semibold text-gray-900">No photos yet</p>
          <p className="mt-2 text-sm text-gray-500">Check back soon for event and press gallery updates.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {eventGroups.map((group) => (
            <EventSection key={group.title} group={group} onOpen={setActiveItem} />
          ))}
        </div>
      )}

      {cursor ? (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => load(false)}
            disabled={loading}
            className="inline-flex items-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-secondary disabled:opacity-60"
          >
            {loading ? 'Loading...' : 'Load more'}
          </button>
        </div>
      ) : null}

      {activeItem ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setActiveItem(null)}
        >
          <div className="relative max-h-[90vh] w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setActiveItem(null)}
              className="absolute -top-10 right-0 text-sm font-semibold text-white hover:text-gray-200"
            >
              Close
            </button>
            {activeItem.mediaType === 'VIDEO' ? (
              <video
                src={activeItem.url}
                poster={activeItem.thumbnailUrl || undefined}
                controls
                className="max-h-[80vh] w-full rounded-xl bg-black"
              />
            ) : (
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-black">
                <Image
                  src={getGalleryImageSrc(activeItem)}
                  alt={activeItem.title || 'Gallery image'}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
            )}
            {activeItem.title || activeItem.caption ? (
              <div className="mt-4 rounded-xl bg-white/95 p-4 text-gray-900">
                {activeItem.title ? <p className="font-semibold">{activeItem.title}</p> : null}
                {activeItem.caption ? <p className="mt-2 whitespace-pre-line text-sm text-gray-600">{activeItem.caption}</p> : null}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}
