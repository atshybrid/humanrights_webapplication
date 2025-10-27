import React from 'react'

// A lightweight, responsive "map" panel with zone pins (approximate positions)
// This is a UI scaffold; can be swapped with a proper India SVG map later.
export default function IndiaZonesMap({ selectedZone, onSelectZone }){
  const zones = [
    { code: 'NORTH', x: '48%', y: '18%', label: 'North' },
    { code: 'SOUTH', x: '56%', y: '83%', label: 'South' },
    { code: 'EAST', x: '80%', y: '46%', label: 'East' },
    { code: 'WEST', x: '20%', y: '48%', label: 'West' },
    { code: 'CENTRAL', x: '53%', y: '46%', label: 'Central' },
  ]

  return (
    <div className="relative w-full rounded-2xl border border-gray-200 bg-gradient-to-b from-blue-50 to-indigo-50 shadow-sm overflow-hidden" style={{ aspectRatio: '4/3' }}>
      <div className="absolute inset-0 pointer-events-none select-none">
        {/* Decorative grid */}
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#93c5fd 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        {/* Faint India watermark (placeholder) */}
        <div className="absolute inset-0 opacity-10 flex items-center justify-center text-7xl font-black tracking-widest text-blue-900">INDIA</div>
      </div>

      {zones.map(z => (
        <button
          key={z.code}
          type="button"
          className={`group absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none ${selectedZone === z.code ? 'z-20' : 'z-10'}`}
          style={{ left: z.x, top: z.y }}
          onClick={() => onSelectZone?.(z.code)}
          aria-label={`Select ${z.label} zone`}
        >
          <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full ring-2 ring-white shadow transition ${selectedZone === z.code ? 'bg-secondary text-white' : 'bg-primary text-white group-hover:bg-secondary'}`}>
            {/* pin icon */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path fillRule="evenodd" d="M11.54 22.35a.75.75 0 00.92 0c1.967-1.553 7.79-6.537 7.79-11.85A8.25 8.25 0 006 6c0 5.313 5.823 10.297 7.79 11.85a.75.75 0 00.92 0zM12 12.75a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </span>
          <div className={`mt-1 text-xs font-semibold ${selectedZone === z.code ? 'text-secondary' : 'text-gray-700'} drop-shadow-sm`}>{z.label}</div>
        </button>
      ))}

      {/* Legend */}
      <div className="absolute left-3 bottom-3 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-xs text-gray-700 ring-1 ring-gray-200 shadow-sm">
        Tap a pin to filter by zone
      </div>
    </div>
  )
}
