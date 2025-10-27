import { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import IndiaZonesMap from '../components/IndiaZonesMap'
import dynamic from 'next/dynamic'
const MapIndiaDrilldown = dynamic(() => import('../components/MapIndiaDrilldown'), { ssr: false })
import { Skeleton } from '../components/Skeleton'
import {
  getHrcCells,
  getHrcDesignations,
  getHrcCountries,
  getHrcZones,
  getHrcStates,
  getHrcDistricts,
  getHrcMandals,
  getMembershipAvailability,
} from '../lib/api'

const LEVELS = ['NATIONAL','ZONE','STATE','DISTRICT','MANDAL']

export default function MembersPage(){
  const [level, setLevel] = useState('NATIONAL')
  const [cells, setCells] = useState([])
  const [cellsLoading, setCellsLoading] = useState(true)
  const [activeCellId, setActiveCellId] = useState(null)

  const [designations, setDesignations] = useState([])
  const [designationsLoading, setDesignationsLoading] = useState(true)
  const [designationCode, setDesignationCode] = useState('')

  const [countries, setCountries] = useState([])
  const [zones, setZones] = useState([])
  const [states, setStates] = useState([])
  const [districts, setDistricts] = useState([])
  const [mandals, setMandals] = useState([])

  const [geoLoading, setGeoLoading] = useState(false)

  const [selectedCountryId, setSelectedCountryId] = useState('')
  const [selectedZone, setSelectedZone] = useState('')
  const [selectedStateId, setSelectedStateId] = useState('')
  const [selectedDistrictId, setSelectedDistrictId] = useState('')
  const [selectedMandalId, setSelectedMandalId] = useState('')

  const [availability, setAvailability] = useState(null)
  const [availabilityLoading, setAvailabilityLoading] = useState(false)
  const [availabilityError, setAvailabilityError] = useState('')

  useEffect(() => {
    // boot: cells, designations, countries, zones
    setCellsLoading(true)
    getHrcCells().then(data => {
      setCells(data)
      setActiveCellId(data?.[0]?.id || null)
    }).finally(()=> setCellsLoading(false))

    setDesignationsLoading(true)
    getHrcDesignations().then(data => {
      const sorted = [...(data||[])].sort((a,b)=> (a.orderRank||9999) - (b.orderRank||9999))
      setDesignations(sorted)
    }).finally(()=> setDesignationsLoading(false))

    Promise.all([getHrcCountries(), getHrcZones()]).then(([c, z])=>{
      setCountries(c)
      setZones(z)
      const india = c?.find(x=> x.code === 'IN')
      if (india) setSelectedCountryId(india.id)
    })
  }, [])

  // When country changes or at boot, load states
  useEffect(() => {
    if (!selectedCountryId) return
    setGeoLoading(true)
    getHrcStates(selectedCountryId).then((st) => setStates(st)).finally(()=> setGeoLoading(false))
  }, [selectedCountryId])

  // When state changes, load districts
  useEffect(() => {
    if (!selectedStateId) { setDistricts([]); return }
    setGeoLoading(true)
    getHrcDistricts(selectedStateId).then((d)=> setDistricts(d)).finally(()=> setGeoLoading(false))
  }, [selectedStateId])

  // When district changes, load mandals
  useEffect(() => {
    if (!selectedDistrictId) { setMandals([]); return }
    setGeoLoading(true)
    getHrcMandals(selectedDistrictId).then((m)=> setMandals(m)).finally(()=> setGeoLoading(false))
  }, [selectedDistrictId])

  // Reset deeper selections when level changes
  useEffect(() => {
    if (level === 'NATIONAL') {
      setSelectedZone('')
      setSelectedStateId('')
      setSelectedDistrictId('')
      setSelectedMandalId('')
    } else if (level === 'ZONE') {
      setSelectedStateId('')
      setSelectedDistrictId('')
      setSelectedMandalId('')
    } else if (level === 'STATE') {
      setSelectedDistrictId('')
      setSelectedMandalId('')
    } else if (level === 'DISTRICT') {
      setSelectedMandalId('')
    }
  }, [level])

  const filteredStates = useMemo(() => {
    if (!selectedZone) return states
    return (states||[]).filter(s => s.zone === selectedZone)
  }, [states, selectedZone])

  const onCheckAvailability = async () => {
    setAvailability(null)
    setAvailabilityError('')
    setAvailabilityLoading(true)
    try{
      const payload = {
        cell: activeCellId,
        designationCode,
        level,
        hrcCountryId: selectedCountryId || undefined,
        zone: level === 'ZONE' ? selectedZone : undefined,
        hrcStateId: level === 'STATE' ? selectedStateId : undefined,
        hrcDistrictId: level === 'DISTRICT' ? selectedDistrictId : undefined,
        hrcMandalId: level === 'MANDAL' ? selectedMandalId : undefined,
        includeAggregate: true,
      }
      const data = await getMembershipAvailability(payload)
      setAvailability(data)
    }catch(e){
      setAvailabilityError('Unable to check availability right now.')
    }finally{
      setAvailabilityLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Members & Volunteers — HRCI</title>
      </Head>
      <main className="max-w-6xl mx-auto px-6 py-8">
        <header>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Members & Volunteers</h1>
          <p className="mt-1 text-gray-600">Explore our national network by level and location. Check seat availability before applying.</p>
        </header>

        {/* Level selector */}
        <div className="mt-6 flex flex-wrap gap-2">
          {LEVELS.map(lv => (
            <button key={lv} className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition ${level===lv? 'bg-primary text-white border-primary' : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'}`} onClick={() => setLevel(lv)}>
              {lv}
            </button>
          ))}
        </div>

        {/* Cells tabs */}
        <div className="mt-4 flex flex-wrap gap-2">
          {cellsLoading ? (
            <>
              <Skeleton className="h-8 w-28 rounded-full" />
              <Skeleton className="h-8 w-28 rounded-full" />
              <Skeleton className="h-8 w-28 rounded-full" />
            </>
          ) : (
            (cells||[]).slice(0,3).map(c => (
              <button key={c.id} onClick={()=> setActiveCellId(c.id)} className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${activeCellId===c.id? 'bg-secondary text-white border-secondary' : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'}`}>
                {c.name}
              </button>
            ))
          )}
        </div>

        {/* Filters row */}
        <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map / visual */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white ring-1 ring-gray-200 shadow-sm p-4">
              {(level === 'NATIONAL' || level === 'ZONE' || level === 'STATE' || level === 'DISTRICT' || level === 'MANDAL') ? (
                <div className="space-y-4">
                  <MapIndiaDrilldown
                    countryId={selectedCountryId}
                    level={level}
                    selectedZone={selectedZone}
                    selectedStateId={selectedStateId}
                    setSelectedStateId={setSelectedStateId}
                    selectedDistrictId={selectedDistrictId}
                    setSelectedDistrictId={setSelectedDistrictId}
                    selectedMandalId={selectedMandalId}
                    setSelectedMandalId={setSelectedMandalId}
                  />
                  <div className="text-xs text-gray-600">Tip: Click a state to drill into districts; click a district to drill into mandals. Use the +/− to zoom and Reset to go back.</div>
                </div>
              ) : (
                <div className="text-sm text-gray-600">
                  <p className="font-semibold">Location selection</p>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {level !== 'NATIONAL' && (
                      <div>
                        <label className="text-xs text-gray-500">Country</label>
                        <select className="mt-1 w-full rounded-lg border-gray-300 text-sm" value={selectedCountryId} onChange={e=> setSelectedCountryId(e.target.value)}>
                          <option value="">Select</option>
                          {(countries||[]).map(c=> <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                    )}
                    {level === 'STATE' || level === 'DISTRICT' || level === 'MANDAL' ? (
                      <div>
                        <label className="text-xs text-gray-500">State</label>
                        <select className="mt-1 w-full rounded-lg border-gray-300 text-sm" value={selectedStateId} onChange={e=> setSelectedStateId(e.target.value)}>
                          <option value="">Select</option>
                          {(filteredStates||[]).map(s=> <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                      </div>
                    ) : null}
                    {level === 'DISTRICT' || level === 'MANDAL' ? (
                      <div>
                        <label className="text-xs text-gray-500">District</label>
                        <select className="mt-1 w-full rounded-lg border-gray-300 text-sm" value={selectedDistrictId} onChange={e=> setSelectedDistrictId(e.target.value)}>
                          <option value="">Select</option>
                          {(districts||[]).map(d=> <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                      </div>
                    ) : null}
                    {level === 'MANDAL' ? (
                      <div>
                        <label className="text-xs text-gray-500">Mandal</label>
                        <select className="mt-1 w-full rounded-lg border-gray-300 text-sm" value={selectedMandalId} onChange={e=> setSelectedMandalId(e.target.value)}>
                          <option value="">Select</option>
                          {(mandals||[]).map(m=> <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                      </div>
                    ) : null}
                  </div>
                  {geoLoading ? <div className="mt-3"><Skeleton className="h-5 w-40" /></div> : null}
                </div>
              )}
            </div>
          </div>

          {/* Availability & designation */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl bg-white ring-1 ring-gray-200 shadow-sm p-4">
              <p className="font-semibold text-gray-900">Check seat availability</p>
              <div className="mt-3 grid grid-cols-1 gap-3">
                <div>
                  <label className="text-xs text-gray-500">Designation</label>
                  {designationsLoading ? (
                    <Skeleton className="mt-1 h-10 w-full rounded-lg" />
                  ) : (
                    <select className="mt-1 w-full rounded-lg border-gray-300 text-sm" value={designationCode} onChange={e=> setDesignationCode(e.target.value)}>
                      <option value="">Select designation</option>
                      {(designations||[]).map(d=> <option key={d.id} value={d.code}>{d.name}</option>)}
                    </select>
                  )}
                </div>
                <button disabled={!activeCellId || !level || availabilityLoading} onClick={onCheckAvailability} className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-secondary disabled:opacity-60">
                  {availabilityLoading ? 'Checking...' : 'Check availability'}
                </button>
                {availabilityError ? <p className="text-sm text-red-600">{availabilityError}</p> : null}
                {availability && (
                  <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-800">
                    <div className="grid grid-cols-2 gap-y-1">
                      <span className="text-gray-500">Capacity</span><span className="font-semibold">{availability.capacity ?? '—'}</span>
                      <span className="text-gray-500">Used</span><span className="font-semibold">{availability.used ?? '—'}</span>
                      <span className="text-gray-500">Remaining</span><span className="font-semibold">{availability.remaining ?? '—'}</span>
                      <span className="text-gray-500">Fee</span><span className="font-semibold">{availability.fee != null ? `₹${availability.fee}` : '—'}</span>
                      <span className="text-gray-500">Validity</span><span className="font-semibold">{availability.validityDays ? `${availability.validityDays} days` : '—'}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Results header */}
        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Directory</h2>
            <div className="text-sm text-gray-600">Level: {level}{level==='ZONE' && selectedZone? ` — ${selectedZone}`:''}</div>
          </div>
          <p className="mt-1 text-sm text-gray-600">Members/Volunteers list will appear here. While the API is being prepared, you can filter locations and check seat availability above.</p>

          {/* Placeholder grid */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="rounded-2xl ring-1 ring-gray-200 bg-white p-4 text-sm text-gray-700 shadow-sm">
              <p className="font-semibold">Coming soon</p>
              <p className="mt-1">We will display member cards with photo, name, designation, and contact (masked) once the API is available.</p>
            </div>
            <div className="rounded-2xl ring-1 ring-gray-200 bg-white p-4 text-sm text-gray-700 shadow-sm">
              <p className="font-semibold">Summary view</p>
              <p className="mt-1">An aggregate summary by designation per level will be shown on top for quick insights.</p>
            </div>
            <div className="rounded-2xl ring-1 ring-gray-200 bg-white p-4 text-sm text-gray-700 shadow-sm">
              <p className="font-semibold">Map pins</p>
              <p className="mt-1">Interactive pins will highlight counts and allow drill-down to states/districts/mandals.</p>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
