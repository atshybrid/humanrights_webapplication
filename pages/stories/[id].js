import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { getStoryById } from '../../lib/api'

export default function StoryDetail({ story }){
  if (!story) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-2xl font-semibold text-gray-900">Story not found</h1>
        <p className="mt-2 text-gray-600">The story you are looking for does not exist or may have been removed.</p>
        <Link href="/" className="mt-6 inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-secondary">Go back home</Link>
      </main>
    )
  }

  const [lightbox, setLightbox] = useState({ open: false, index: 0 })
  const images = Array.isArray(story.images) ? [...story.images].sort((a,b)=> (a.order||0) - (b.order||0)) : []
  const openAt = (idx) => setLightbox({ open: true, index: idx })
  const close = () => setLightbox({ open: false, index: 0 })
  const prev = () => setLightbox(s => ({ open: true, index: (s.index - 1 + images.length) % images.length }))
  const next = () => setLightbox(s => ({ open: true, index: (s.index + 1) % images.length }))

  return (
    <>
      <Head>
        <title>{story.title} — Story</title>
      </Head>
      <header className="relative bg-gray-900">
        <img src={story.heroImageUrl || '/images/story-placeholder.svg'} alt={story.title} className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="relative max-w-6xl mx-auto px-6 py-16 text-white">
          <h1 className="text-3xl sm:text-4xl font-extrabold">{story.title}</h1>
          {story.description ? <p className="mt-2 max-w-3xl text-white/90">{story.description}</p> : null}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <section className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900">Gallery</h2>
          {images.length === 0 ? (
            <p className="mt-2 text-sm text-gray-600">No images available for this story.</p>
          ) : (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <button key={img.id || img.url} type="button" onClick={() => openAt(idx)} className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                  <img src={img.url} alt={img.caption || `Image ${idx+1}`} className="h-36 w-full object-cover transition group-hover:scale-105" />
                </button>
              ))}
            </div>
          )}
        </section>

        <div className="mt-6 flex gap-2">
          <Link href="/" className="inline-flex items-center rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Back to home</Link>
        </div>
      </main>

      {lightbox.open && images.length > 0 && (
        <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <button aria-label="Close" onClick={close} className="absolute top-4 right-4 text-white/80 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7"><path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd"/></svg>
          </button>
          <div className="relative max-w-4xl w-full">
            <img src={images[lightbox.index].url} alt={images[lightbox.index].caption || 'Story image'} className="w-full max-h-[80vh] object-contain rounded-lg" />
            {images.length > 1 && (
              <>
                <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20" aria-label="Previous image">‹</button>
                <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20" aria-label="Next image">›</button>
              </>
            )}
            <div className="mt-3 text-center text-white/90 text-sm">
              {images[lightbox.index].caption || `Image ${lightbox.index+1} of ${images.length}`}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export async function getServerSideProps({ params }){
  try{
    const story = await getStoryById(params.id)
    if(!story){
      return { notFound: true }
    }
    return { props: { story } }
  }catch(e){
    return { notFound: true }
  }
}
