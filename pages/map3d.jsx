import { useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import Script from 'next/script'

// Simple bbox computation without external deps
function computeBbox(geometry){
  const coords = []
  const pushCoords = (c) => {
    if (typeof c[0] === 'number' && typeof c[1] === 'number') coords.push(c)
    else if (Array.isArray(c)) c.forEach(pushCoords)
  }
  if (geometry) pushCoords(geometry.coordinates)
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  for (const [x,y] of coords){
    if (x < minX) minX = x
    if (y < minY) minY = y
    if (x > maxX) maxX = x
    if (y > maxY) maxY = y
  }
  return [[minX, minY], [maxX, maxY]]
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
const STATES_GEOJSON_CDN = 'https://cdn.jsdelivr.net/npm/india-geojson@0.0.1/india_states.geojson'

export default function Map3D(){
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!containerRef.current) return
    // wait for mapbox script
    let cancelled = false
    const init = () => {
      const mapboxgl = window.mapboxgl
      if (!mapboxgl) return
      if (!MAPBOX_TOKEN){ setError('Missing NEXT_PUBLIC_MAPBOX_TOKEN'); return }
      if (mapRef.current) return
      mapboxgl.accessToken = MAPBOX_TOKEN
      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [78.9629, 20.5937],
        zoom: 4,
        pitch: 45,
        bearing: -17,
        antialias: true,
      })

      map.on('load', async () => {
        try{
          map.addSource('india-states', { type: 'geojson', data: STATES_GEOJSON_CDN })
          map.addLayer({
            id: 'states-3d',
            type: 'fill-extrusion',
            source: 'india-states',
            paint: {
              'fill-extrusion-color': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                '#f28cb1',
                '#86c5ff',
              ],
              'fill-extrusion-height': 2000,
              'fill-extrusion-base': 0,
              'fill-extrusion-opacity': 0.85,
            },
          })

          // hover cursor
          map.on('mouseenter', 'states-3d', () => { map.getCanvas().style.cursor = 'pointer' })
          map.on('mouseleave', 'states-3d', () => { map.getCanvas().style.cursor = '' })

          // click to zoom into state bbox
          map.on('click', 'states-3d', (e) => {
            const f = e.features && e.features[0]
            if (!f) return
            const bbox = computeBbox(f.geometry)
            map.fitBounds(bbox, { padding: 24, duration: 600 })
          })

          setReady(true)
        }catch(err){
          console.error(err)
          setError('Failed to load state polygons')
        }
      })

      mapRef.current = map
    }

    // try now and also after a short delay to ensure script availability
    init()
    const t = setTimeout(init, 100)
    return () => { clearTimeout(t); if (!cancelled && mapRef.current) mapRef.current.remove() }
  }, [])

  return (
    <>
      <Head>
        <title>3D India Map — Demo</title>
        {/* Load Mapbox GL CSS via CDN to avoid bundling global CSS */}
        <link href="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css" rel="stylesheet" />
      </Head>
      {/* Load Mapbox GL JS from CDN on client */}
      <Script src="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js" strategy="afterInteractive" onLoad={() => setReady(true)} />
      <main className="min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold">3D India Map</h1>
          <p className="text-gray-600">Extruded state polygons with hover and click-to-zoom. Token required.</p>
          {error ? <div className="mt-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div> : null}
        </div>
        <div ref={containerRef} style={{ width: '100%', height: '75vh' }} />
      </main>
    </>
  )
}
