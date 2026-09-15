import Link from 'next/link'
import Image from 'next/image'
import { getGalleryImageSrc } from '../lib/gallery'
import SectionHeader from './SectionHeader'

export default function Gallery({ items = [] }) {
  const preview = items.slice(0, 4)
  if (preview.length === 0) return null

  return (
    <section id="gallery" className="scroll-mt-20">
      <SectionHeader
        title="Gallery"
        description="Photos from events and community programs."
        actionHref="/gallery"
        actionLabel="View all"
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {preview.map((item) => (
          <Link
            key={item.id}
            href="/gallery"
            className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm sm:rounded-2xl"
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={getGalleryImageSrc(item)}
                alt={item.title || 'Gallery image'}
                fill
                className="object-cover transition duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
