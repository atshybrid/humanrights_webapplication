const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ||
  process.env.NEXT_PUBLIC_API_URL ||
  'https://app.humanrightscouncilforindia.org/api/v1'

export async function fetchGallery(opts = {}) {
  const params = new URLSearchParams()
  if (opts.category) params.set('category', opts.category)
  if (opts.mediaType) params.set('mediaType', opts.mediaType)
  params.set('limit', String(opts.limit ?? 24))
  if (opts.cursor) params.set('cursor', opts.cursor)

  const path =
    opts.category === 'PRESS_CLIP'
      ? '/gallery/press-clips'
      : opts.category === 'EVENT_CLIP'
        ? '/gallery/event-clips'
        : '/gallery'

  const res = await fetch(`${API_BASE}${path}?${params}`)
  if (!res.ok) throw new Error('Gallery fetch failed')
  return res.json()
}

export function groupGalleryByEvent(items = []) {
  const groups = new Map()

  for (const item of items) {
    const dateLabel = item.eventDate
      ? new Date(item.eventDate).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : null
    const key = item.title?.trim() || dateLabel || 'Other'
    if (!groups.has(key)) {
      groups.set(key, { title: key, date: item.eventDate, items: [] })
    }
    groups.get(key).items.push(item)
  }

  return Array.from(groups.values()).sort((a, b) => {
    const da = a.date ? new Date(a.date).getTime() : 0
    const db = b.date ? new Date(b.date).getTime() : 0
    return db - da
  })
}

export function getGalleryImageSrc(item) {
  return item?.thumbnailUrl || item?.url || ''
}
