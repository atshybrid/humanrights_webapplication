import Footer from '../components/Footer'
import GalleryTabs from '../components/GalleryTabs'
import SEOHead from '../components/SEOHead'
import { fetchGallery } from '../lib/gallery'

export async function getStaticProps() {
  try {
    const [press, events] = await Promise.all([
      fetchGallery({ category: 'PRESS_CLIP', mediaType: 'IMAGE', limit: 24 }),
      fetchGallery({ category: 'EVENT_CLIP', mediaType: 'IMAGE', limit: 24 }),
    ])
    return {
      props: { initialPress: press, initialEvents: events },
      revalidate: 60,
    }
  } catch {
    return {
      props: {
        initialPress: { data: [], nextCursor: null },
        initialEvents: { data: [], nextCursor: null },
      },
      revalidate: 60,
    }
  }
}

export default function GalleryPage({ initialPress, initialEvents }) {
  return (
    <>
      <SEOHead
        title="Gallery"
        description="Photos from HRCI events, press clips, and community programs across India."
        canonical="/gallery"
      />
      <main className="min-h-screen bg-gray-50">
        <div className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">HRCI Gallery</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">Events & Press</h1>
            <p className="mt-3 max-w-2xl text-gray-600">
              Browse photos from our events and press coverage, grouped event-wise.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <GalleryTabs initialPress={initialPress} initialEvents={initialEvents} />
        </div>
      </main>
      <Footer />
    </>
  )
}
