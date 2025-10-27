import { memo, useEffect, useMemo, useState } from 'react'
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps'
import { getStatesGeoJSON, getDistrictsGeoJSON, getMandalsGeoJSON } from '../lib/api'
import IndiaZonesMap from './IndiaZonesMap'
import { Skeleton } from './Skeleton'

// Contract:
// Props:
// - countryId: required (India id)
// - level: 'NATIONAL' | 'ZONE' | 'STATE' | 'DISTRICT' | 'MANDAL'
// - selectedZone: optional; highlight states by zone
// - selectedStateId, setSelectedStateId
// - selectedDistrictId, setSelectedDistrictId
// - selectedMandalId, setSelectedMandalId
// Behavior:
// - Loads states GeoJSON initially. Clicking a state sets selectedStateId and zooms in.
// - If level >= DISTRICT and selectedStateId, loads districts. Clicking a district sets selectedDistrictId and zooms in.
// - If level === MANDAL and selectedDistrictId, loads mandals for click.
// - Has simple zoom controls.

function cn(...classes){ return classes.filter(Boolean).join(' ') }

function MapIndiaDrilldown({
  countryId,
  level,
  selectedZone,
  selectedStateId, setSelectedStateId,
  selectedDistrictId, setSelectedDistrictId,
  selectedMandalId, setSelectedMandalId,
}){
  const [statesGeo, setStatesGeo] = useState(null)
  const [districtsGeo, setDistrictsGeo] = useState(null)
  const [mandalsGeo, setMandalsGeo] = useState(null)
  const [geoError, setGeoError] = useState(null)

  const [position, setPosition] = useState({ coordinates: [80, 22], zoom: 1 })
  const [loading, setLoading] = useState(false)

  // Load states GeoJSON
  useEffect(() => {
    let active = true
    setLoading(true)
    setGeoError(null)
    getStatesGeoJSON(countryId)
      .then((g) => {
        if (!active) return
        setStatesGeo(g)
      })
      .catch(() => {
        if (!active) return
        setGeoError('states')
        setStatesGeo(null)
      })
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [countryId])

  // Load districts when state selected and level requires
  useEffect(() => {
    if (!selectedStateId || (level !== 'DISTRICT' && level !== 'MANDAL')){ setDistrictsGeo(null); return }
    let active = true
    setLoading(true)
    getDistrictsGeoJSON(selectedStateId)
      .then((g)=> { if(active) setDistrictsGeo(g) })
      .catch(() => { if(active) { setGeoError('districts'); setDistrictsGeo(null) } })
      .finally(()=> active && setLoading(false))
    return () => { active = false }
  }, [selectedStateId, level])

  // Load mandals when district selected and level requires
  useEffect(() => {
    if (!selectedDistrictId || level !== 'MANDAL'){ setMandalsGeo(null); return }
    let active = true
    setLoading(true)
    getMandalsGeoJSON(selectedDistrictId)
      .then((g)=> { if(active) setMandalsGeo(g) })
      .catch(() => { if(active) { setGeoError('mandals'); setMandalsGeo(null) } })
      .finally(()=> active && setLoading(false))
    return () => { active = false }
  }, [selectedDistrictId, level])

  const onReset = () => {
    setPosition({ coordinates: [80, 22], zoom: 1 })
    setSelectedStateId?.('')
    setSelectedDistrictId?.('')
    setSelectedMandalId?.('')
  }

  const zoomIn = () => setPosition(p => ({ ...p, zoom: Math.min(p.zoom * 1.6, 12) }))
  const zoomOut = () => setPosition(p => ({ ...p, zoom: Math.max(p.zoom / 1.6, 1) }))

  const stroke = '#94a3b8'
  const fill = '#e2e8f0'
  const fillActive = '#c7d2fe'
  const fillZone = '#dbeafe'

  const renderGeos = (geojson, type) => (
    <Geographies geography={geojson}>
      {({ geographies }) => geographies.map((geo) => {
        const id = geo.properties?.id || geo.id
        const zone = geo.properties?.zone
        const isStateSelected = type==='state' && selectedStateId && id === selectedStateId
        const isDistrictSelected = type==='district' && selectedDistrictId && id === selectedDistrictId
        const isMandalSelected = type==='mandal' && selectedMandalId && id === selectedMandalId
        const isSelected = isStateSelected || isDistrictSelected || isMandalSelected
        const zoneMatch = selectedZone && zone && zone === selectedZone
        return (
          <Geography
            key={`${type}-${id}`}
            geography={geo}
            onClick={() => {
              if (type === 'state') {
                setSelectedStateId?.(id)
                setSelectedDistrictId?.('')
                setSelectedMandalId?.('')
                setPosition(p => ({ ...p, zoom: Math.max(p.zoom, 2.2) }))
              } else if (type === 'district') {
                setSelectedDistrictId?.(id)
                setSelectedMandalId?.('')
                setPosition(p => ({ ...p, zoom: Math.max(p.zoom, 3) }))
              } else if (type === 'mandal') {
                setSelectedMandalId?.(id)
              }
            }}
            style={{
              default: {
                fill: isSelected ? fillActive : (zoneMatch ? fillZone : fill),
                outline: 'none',
                stroke,
                strokeWidth: 0.5,
              },
              hover: {
                fill: fillActive,
                outline: 'none',
                stroke,
                strokeWidth: 0.7,
              },
              pressed: { fill: fillActive, outline: 'none' },
            }}
          />
        )
      })}
    </Geographies>
  )

  return (
    <div className="relative rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {geoError === 'states' && (
        <div className="absolute inset-x-0 top-0 z-10 m-3 rounded-lg bg-amber-50 text-amber-900 ring-1 ring-amber-200 p-3 text-xs">
          Detailed map data isnt available right now. You can still pick a Zone or use the selectors below.
        </div>
      )}
      <div className="absolute right-3 top-3 z-10 flex gap-2">
        <button onClick={zoomOut} className="h-8 w-8 rounded-full bg-white text-gray-700 ring-1 ring-gray-200 shadow hover:bg-gray-50">−</button>
        <button onClick={zoomIn} className="h-8 w-8 rounded-full bg-white text-gray-700 ring-1 ring-gray-200 shadow hover:bg-gray-50">+</button>
        <button onClick={onReset} className="h-8 px-3 rounded-full bg-white text-xs font-medium text-gray-700 ring-1 ring-gray-200 shadow hover:bg-gray-50">Reset</button>
      </div>

      <div className="relative" style={{ aspectRatio: '4 / 3' }}>
        {!statesGeo ? (
          <div className="absolute inset-0 p-4">
            {geoError === 'states' ? (
              <IndiaZonesMap selectedZone={selectedZone} onSelectZone={(z)=>{ /* zone-only fallback */ }} />
            ) : (
              <Skeleton className="h-full w-full rounded-xl" />
            )}
          </div>
        ) : (
          <ComposableMap projection="geoMercator" projectionConfig={{ center: [82.8, 22.5], scale: 1200 }} width={800} height={600} style={{ width: '100%', height: '100%' }}>
            <ZoomableGroup center={position.coordinates} zoom={position.zoom}>
              {renderGeos(statesGeo, 'state')}
              {districtsGeo && renderGeos(districtsGeo, 'district')}
              {mandalsGeo && renderGeos(mandalsGeo, 'mandal')}
            </ZoomableGroup>
          </ComposableMap>
        )}
      </div>

      {loading && (
        <div className="absolute left-3 bottom-3 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-xs text-gray-700 ring-1 ring-gray-200 shadow-sm">Loading…</div>
      )}
    </div>
  )
}

export default memo(MapIndiaDrilldown)
