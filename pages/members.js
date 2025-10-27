import { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import Script from 'next/script'
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
  createMembershipOrderPayfirst,
  confirmMembershipPayfirst,
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
  const [joinOpen, setJoinOpen] = useState(false)
  const [joinMobile, setJoinMobile] = useState('')
  const [joinError, setJoinError] = useState('')
  const [joinLoading, setJoinLoading] = useState(false)
  const [joinResult, setJoinResult] = useState(null)
  const [lastOrder, setLastOrder] = useState(null)

  // Helpers to resolve selected display names
  const selectedState = useMemo(() => (states||[]).find(s=> s.id === selectedStateId) || null, [states, selectedStateId])
  const selectedDistrict = useMemo(() => (districts||[]).find(d=> d.id === selectedDistrictId) || null, [districts, selectedDistrictId])
  const selectedMandal = useMemo(() => (mandals||[]).find(m=> m.id === selectedMandalId) || null, [mandals, selectedMandalId])
  const activeCell = useMemo(() => (cells||[]).find(c=> c.id === activeCellId) || null, [cells, activeCellId])

  // Validate required params for availability
  const requiredHint = useMemo(() => {
    if (!activeCellId) return 'Select a cell'
    if (!designationCode) return 'Select a designation'
    if (level === 'NATIONAL') return null
    if (level === 'ZONE' && !selectedZone) return 'Select a zone'
    if (level === 'STATE' && !selectedStateId) return 'Select a state'
    if (level === 'DISTRICT' && !selectedDistrictId) return 'Select a district'
    if (level === 'MANDAL' && !selectedMandalId) return 'Select a mandal'
    return null
  }, [activeCellId, designationCode, level, selectedZone, selectedStateId, selectedDistrictId, selectedMandalId])
  const canCheck = !availabilityLoading && !requiredHint

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

  const canJoin = useMemo(() => {
    const rem = Number(availability?.remaining || 0)
    return rem > 0 && !requiredHint && activeCell && designationCode
  }, [availability, requiredHint, activeCell, designationCode])

  const buildLocationPayload = () => {
    const payload = { level }
    if (selectedCountryId) payload.hrcCountryId = selectedCountryId
    if (level === 'ZONE') payload.zone = selectedZone
    if (level === 'STATE') payload.hrcStateId = selectedStateId
    if (level === 'DISTRICT') payload.hrcDistrictId = selectedDistrictId
    if (level === 'MANDAL') payload.hrcMandalId = selectedMandalId
    return payload
  }

  const handleJoin = async (e) => {
    e?.preventDefault?.()
    setJoinError('')
    setJoinResult(null)
    // simple validation for Indian mobile numbers (10 digits)
    const mobile = String(joinMobile || '').trim()
    if (!/^[0-9]{10}$/.test(mobile)){
      setJoinError('Enter a valid 10-digit mobile number')
      return
    }
    try{
      setJoinLoading(true)
      const payload = {
        cell: activeCell?.code, // API expects cell code for payfirst
        designationCode, // expects designation code
        ...buildLocationPayload(),
        mobileNumber: mobile,
      }
      const orderWrap = await createMembershipOrderPayfirst(payload)
      const order = orderWrap?.order || orderWrap?.data?.order || orderWrap
      const key = order?.providerKeyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
      const rzpOrderId = order?.providerOrderId
      const orderId = order?.orderId
      setLastOrder({ orderId, rzpOrderId })
      if (!key || !rzpOrderId){
        setJoinError('Payment configuration missing. Backend must return providerKeyId and providerOrderId, or set NEXT_PUBLIC_RAZORPAY_KEY_ID.')
        setJoinLoading(false)
        return
      }

      const options = {
        key,
        amount: Math.round((order?.amount || order?.priceAfterDiscount || 0) * 100),
        currency: order?.currency || 'INR',
        name: 'HRCI Membership',
        description: `${activeCell?.name || 'Cell'} — ${designationCode}`,
        order_id: rzpOrderId,
        prefill: { contact: mobile },
        theme: { color: '#FE0002' },
        handler: async function (response){
          try{
            const confirmBody = { orderId: orderId || rzpOrderId, status: 'SUCCESS' }
            const confirm = await confirmMembershipPayfirst(confirmBody)
            setJoinResult(confirm)
          }catch(err){
            console.error(err)
            setJoinError('Payment confirmation failed. Please contact support with your payment ID.')
          }finally{
            setJoinLoading(false)
          }
        },
        modal: { ondismiss: () => setJoinLoading(false) }
      }

      if (typeof window !== 'undefined' && window.Razorpay){
        const rzp = new window.Razorpay(options)
        rzp.open()
      } else {
        setJoinError('Payment SDK not loaded. Please refresh and try again.')
        setJoinLoading(false)
      }
    }catch(err){
      console.error(err)
      setJoinError('Could not create membership order. Please try again later.')
      setJoinLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Members & Volunteers — HRCI</title>
      </Head>
      {/* Razorpay SDK */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
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
                  {/* Controls under map */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {level === 'ZONE' && (
                      <div>
                        <label className="text-xs text-gray-500">Zone</label>
                        <select className="mt-1 w-full rounded-lg border-gray-300 text-sm" value={selectedZone} onChange={e=> setSelectedZone(e.target.value)}>
                          <option value="">Select</option>
                          {(zones||[]).map(z=> <option key={z} value={z}>{z}</option>)}
                        </select>
                      </div>
                    )}
                    {(level === 'STATE' || level === 'DISTRICT' || level === 'MANDAL') && (
                      <>
                        <div>
                          <label className="text-xs text-gray-500">State</label>
                          <select className="mt-1 w-full rounded-lg border-gray-300 text-sm" value={selectedStateId} onChange={e=> setSelectedStateId(e.target.value)}>
                            <option value="">Select</option>
                            {(filteredStates||[]).map(s=> <option key={s.id} value={s.id}>{s.name}</option>)}
                          </select>
                        </div>
                        {(level === 'DISTRICT' || level === 'MANDAL') && (
                          <div>
                            <label className="text-xs text-gray-500">District</label>
                            <select className="mt-1 w-full rounded-lg border-gray-300 text-sm" value={selectedDistrictId} onChange={e=> setSelectedDistrictId(e.target.value)}>
                              <option value="">Select</option>
                              {(districts||[]).map(d=> <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                          </div>
                        )}
                        {level === 'MANDAL' && (
                          <div>
                            <label className="text-xs text-gray-500">Mandal</label>
                            <select className="mt-1 w-full rounded-lg border-gray-300 text-sm" value={selectedMandalId} onChange={e=> setSelectedMandalId(e.target.value)}>
                              <option value="">Select</option>
                              {(mandals||[]).map(m=> <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  {/* Selection chips */}
                  <div className="flex flex-wrap gap-2 text-xs">
                    {level === 'ZONE' && selectedZone ? <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 ring-1 ring-gray-200">Zone: {selectedZone}</span> : null}
                    {selectedState ? <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 ring-1 ring-gray-200">State: {selectedState.name}</span> : null}
                    {selectedDistrict ? <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 ring-1 ring-gray-200">District: {selectedDistrict.name}</span> : null}
                    {selectedMandal ? <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 ring-1 ring-gray-200">Mandal: {selectedMandal.name}</span> : null}
                  </div>
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
                  {canJoin ? (
                    <div className="mt-3">
                      <button onClick={()=> setJoinOpen(true)} className="inline-flex items-center rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary">Join as member</button>
                    </div>
                  ) : null}
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
                <button disabled={!canCheck} onClick={onCheckAvailability} className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-secondary disabled:opacity-60">
                  {availabilityLoading ? 'Checking...' : 'Check availability'}
                </button>
                {requiredHint ? <p className="-mt-2 text-xs text-gray-500">{requiredHint}</p> : null}
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

      {/* Join dialog */}
      {joinOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-lg">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Join & pay</h3>
              <button onClick={()=> setJoinOpen(false)} aria-label="Close" className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <p className="mt-1 text-sm text-gray-600">Proceed to reserve your seat and complete payment.</p>
            <form onSubmit={handleJoin} className="mt-4 space-y-3">
              <div>
                <label className="text-xs text-gray-500">Mobile number</label>
                <input value={joinMobile} onChange={(e)=> setJoinMobile(e.target.value)} placeholder="10-digit mobile" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              </div>
              {joinError ? <div className="rounded-md border border-red-200 bg-red-50 p-2 text-xs text-red-800">{joinError}</div> : null}
              <div className="flex items-center justify-end gap-2">
                <button type="button" onClick={()=> setJoinOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">Cancel</button>
                <button type="submit" disabled={joinLoading} className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-secondary disabled:opacity-60">{joinLoading ? 'Processing…' : 'Continue to pay'}</button>
              </div>
            </form>

            {joinResult && (
              <div className="mt-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-800">
                <p className="font-semibold text-green-700">Payment successful</p>
                <div className="mt-2 grid grid-cols-2 gap-y-1">
                  <span className="text-gray-500">Status</span><span className="font-semibold">{joinResult.status || joinResult.data?.status || 'PAID'}</span>
                  <span className="text-gray-500">Seat</span><span className="font-semibold">{joinResult.seatDetails?.designation?.name} — {joinResult.seatDetails?.cell?.name}</span>
                  <span className="text-gray-500">Level</span><span className="font-semibold">{joinResult.seatDetails?.level}</span>
                </div>
                <p className="mt-2 text-xs text-gray-600">Next: Download the Khabarx mobile app and log in to access your membership tools.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
