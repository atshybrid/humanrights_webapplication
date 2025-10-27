import { useEffect, useMemo, useRef, useState } from 'react'

const DEFAULT_SLIDES = [
  {
    id: 'dignity',
    title: 'Every life deserves dignity',
    subtitle: 'Together, we protect rights and restore hope where it matters most.',
    ctaHref: '/donations',
    ctaLabel: 'Donate now',
    secondaryHref: '/contact',
    secondaryLabel: 'Partner with us',
    imageUrl: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=2000&auto=format&fit=crop',
    alt: 'Hands holding together in support',
  },
  {
    id: 'children',
    title: 'Keep children safe and in school',
    subtitle: 'Your gift funds nutrition, uniforms, and learning kits for vulnerable kids.',
    ctaHref: '/donations?amount=1000',
    ctaLabel: 'Give for children',
    secondaryHref: '/events/cmgwd0dri0000ug84lb32cw88',
    secondaryLabel: 'Support an event',
    imageUrl: 'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?q=80&w=2000&auto=format&fit=crop',
    alt: 'Children smiling in a classroom',
  },
  {
    id: 'legal-aid',
    title: 'Legal help when it counts',
    subtitle: 'We stand by families through police complaints and courtrooms—free of cost.',
    ctaHref: '/donations?amount=2000',
    ctaLabel: 'Fund legal aid',
    secondaryHref: '/terms',
    secondaryLabel: 'Our commitment',
    imageUrl: 'https://images.unsplash.com/photo-1555374018-13a8994ab246?q=80&w=2000&auto=format&fit=crop',
    alt: 'Gavel and scales of justice symbolising law',
  },
  {
    id: 'health',
    title: 'Access to care saves lives',
    subtitle: 'Support health camps, emergency relief, and essential medicines.',
    ctaHref: '/donations?amount=1500',
    ctaLabel: 'Support healthcare',
    secondaryHref: '/donations',
    secondaryLabel: 'Other options',
    imageUrl: 'https://images.unsplash.com/photo-1504439468489-c8920d796a29?q=80&w=2000&auto=format&fit=crop',
    alt: 'Healthcare worker comforting a patient',
  },
  {
    id: 'community',
    title: 'Stronger communities, safer futures',
    subtitle: 'Your support builds awareness, resilience, and local leadership.',
    ctaHref: '/donations?amount=500',
    ctaLabel: 'Empower communities',
    secondaryHref: '/contact',
    secondaryLabel: 'Volunteer',
    imageUrl: 'https://images.unsplash.com/photo-1518600506278-4e8ef466b810?q=80&w=2000&auto=format&fit=crop',
    alt: 'Community meeting with people united',
  },
]

export default function HeroSlider({ slides = DEFAULT_SLIDES, intervalMs = 6500 }){
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchStartX = useRef(null)
  const safeSlides = useMemo(() => (slides && slides.length ? slides : DEFAULT_SLIDES), [slides])

  // auto-advance
  useEffect(() => {
    if (paused) return
    const id = setInterval(() => setIndex((i) => (i + 1) % safeSlides.length), intervalMs)
    return () => clearInterval(id)
  }, [paused, intervalMs, safeSlides.length])

  // preload next image for smoothness
  useEffect(() => {
    const nextIdx = (index + 1) % safeSlides.length
    const img = new Image()
    img.src = safeSlides[nextIdx].imageUrl
  }, [index, safeSlides])

  const goTo = (i) => setIndex((i + safeSlides.length) % safeSlides.length)
  const prev = () => goTo(index - 1)
  const next = () => goTo(index + 1)

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const onTouchMove = (e) => {
    if (touchStartX.current == null) return
    const dx = e.touches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 50) {
      if (dx > 0) prev(); else next()
      touchStartX.current = null
    }
  }
  const onTouchEnd = () => { touchStartX.current = null }

  return (
    <header className="relative overflow-hidden">
      <div
        className="relative h-[500px] sm:h-[620px] bg-gray-900 text-white"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        aria-roledescription="carousel"
        aria-live="polite"
      >
        {safeSlides.map((s, i) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-700 ${i === index ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            role="group"
            aria-label={`${i + 1} of ${safeSlides.length}`}
          >
            {/* Ken Burns background */}
            <div className="absolute inset-0 overflow-hidden">
              <img src={s.imageUrl} alt={s.alt} className={`absolute inset-0 h-full w-full object-cover will-change-transform ${i===index ? 'kenburns' : ''}`} />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative h-full max-w-6xl mx-auto px-6 flex items-center">
              <div className="[animation:fadeUp_.8s_ease-out]">
                <div className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 ring-1 ring-white/20 backdrop-blur">Human Rights Council</div>
                <h1 className="mt-3 text-3xl sm:text-5xl font-extrabold leading-tight drop-shadow-sm">{s.title}</h1>
                <p className="mt-3 max-w-2xl text-base sm:text-lg text-white/90">{s.subtitle}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href={s.ctaHref} className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-secondary">{s.ctaLabel}</a>
                  {s.secondaryHref && (
                    <a href={s.secondaryHref} className="inline-flex items-center rounded-full border border-white/70 px-6 py-3 text-sm font-medium text-white/95 hover:bg-white/10">{s.secondaryLabel}</a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Controls */}
        <button aria-label="Previous slide" onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6"><path fillRule="evenodd" d="M15.75 19.5a.75.75 0 01-1.06 0l-6-6a.75.75 0 010-1.06l6-6a.75.75 0 111.06 1.06L10.31 12l5.44 5.56a.75.75 0 010 1.06z" clipRule="evenodd"/></svg>
        </button>
        <button aria-label="Next slide" onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6"><path fillRule="evenodd" d="M8.25 4.5a.75.75 0 011.06 0l6 6a.75.75 0 010 1.06l-6 6a.75.75 0 11-1.06-1.06L13.69 12 9.31 7.56A.75.75 0 018.25 4.5z" clipRule="evenodd"/></svg>
        </button>

        {/* Dots + progress */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div key={index} className="h-1 w-48 overflow-hidden rounded-full bg-white/20">
            <div className="h-full bg-white/80 [animation:progress_linear]" style={{ animationDuration: `${intervalMs}ms` }} />
          </div>
          <div className="flex gap-2">
            {safeSlides.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i+1}`}
                onClick={() => goTo(i)}
                className={`h-2 w-2 rounded-full ring-2 ring-white/60 ${i===index ? 'bg-white' : 'bg-white/30 hover:bg-white/60'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Local CSS for animations (styled-jsx) */}
      <style jsx>{`
        @keyframes kenburns {
          0% { transform: scale(1.05) translate3d(0, 0, 0); }
          100% { transform: scale(1.15) translate3d(2%, 2%, 0); }
        }
        .kenburns { animation: kenburns ${intervalMs}ms ease-in-out both; }
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0%); }
        }
        .fadeUp { animation: fadeUp .8s ease-out; }
        .progress { animation: progress linear; }
      `}</style>
    </header>
  )
}
