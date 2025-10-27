// API helpers using the endpoints you provided.
// These functions fetch public data for organization, events, donors, and stories.

const BASE = process.env.NEXT_PUBLIC_API_URL || 'https://app.hrcitodaynews.in/api/v1'

export async function getOrgSettings(){
  const res = await fetch(`${BASE}/org/settings/public`)
  if(!res.ok) throw new Error('Failed to fetch org settings')
  const json = await res.json()
  return json.data
}

export async function getDonationEvents(limit=20){
  const res = await fetch(`${BASE}/donations/events?limit=${limit}`)
  if(!res.ok) throw new Error('Failed to fetch donation events')
  const json = await res.json()
  return json.data || []
}

export async function getEventById(id){
  const res = await fetch(`${BASE}/donations/events/${id}`)
  if(!res.ok) throw new Error('Failed to fetch event')
  const json = await res.json()
  return json.data
}

export async function getTopDonors(limit=20){
  const res = await fetch(`${BASE}/donations/top-donors?limit=${limit}`)
  if(!res.ok) throw new Error('Failed to fetch donors')
  const json = await res.json()
  return json.data || []
}

export async function getStories(limit=20, offset=0){
  const res = await fetch(`${BASE}/donations/stories?limit=${limit}&offset=${offset}`)
  if(!res.ok) throw new Error('Failed to fetch stories')
  const json = await res.json()
  return json.data || []
}

export async function getStoryById(id){
  const res = await fetch(`${BASE}/donations/stories/${id}`)
  if(!res.ok) throw new Error('Failed to fetch story')
  const json = await res.json()
  return json.data
}

// Create a donation order (direct or event-based)
export async function createDonationOrder(payload){
  const res = await fetch(`${BASE}/donations/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if(!res.ok) throw new Error('Failed to create order')
  const json = await res.json()
  return json.data || json
}

// Confirm a donation payment after provider callback (e.g., Razorpay)
export async function confirmDonation(body){
  const res = await fetch(`${BASE}/donations/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if(!res.ok) throw new Error('Failed to confirm payment')
  const json = await res.json()
  return json.data || json
}

// HRCI Cells and Designations
export async function getHrcCells({ isActive = true, limit = 50 } = {}){
  const url = new URL(`${BASE}/hrci/cells`)
  if (isActive !== undefined) url.searchParams.set('isActive', String(isActive))
  if (limit) url.searchParams.set('limit', String(limit))
  const res = await fetch(url.toString())
  if(!res.ok) throw new Error('Failed to fetch cells')
  const json = await res.json()
  return json.data || []
}

export async function getHrcDesignations({ limit = 200 } = {}){
  const url = new URL(`${BASE}/hrci/designations`)
  if (limit) url.searchParams.set('limit', String(limit))
  const res = await fetch(url.toString())
  if(!res.ok) throw new Error('Failed to fetch designations')
  const json = await res.json()
  return json.data || []
}

// HRCI Geo hierarchy
export async function getHrcCountries(){
  const res = await fetch(`${BASE}/hrci/geo/countries`)
  if(!res.ok) throw new Error('Failed to fetch countries')
  const json = await res.json()
  return json.data || []
}

export async function getHrcZones(){
  const res = await fetch(`${BASE}/hrci/geo/zones`)
  if(!res.ok) throw new Error('Failed to fetch zones')
  const json = await res.json()
  return json.data || []
}

export async function getHrcStates(countryId){
  if(!countryId) return []
  const res = await fetch(`${BASE}/hrci/geo/states?countryId=${encodeURIComponent(countryId)}`)
  if(!res.ok) throw new Error('Failed to fetch states')
  const json = await res.json()
  return json.data || []
}

export async function getHrcDistricts(stateId){
  if(!stateId) return []
  const res = await fetch(`${BASE}/hrci/geo/districts?stateId=${encodeURIComponent(stateId)}`)
  if(!res.ok) throw new Error('Failed to fetch districts')
  const json = await res.json()
  return json.data || []
}

export async function getHrcMandals(districtId){
  if(!districtId) return []
  const res = await fetch(`${BASE}/hrci/geo/mandals?districtId=${encodeURIComponent(districtId)}`)
  if(!res.ok) throw new Error('Failed to fetch mandals')
  const json = await res.json()
  return json.data || []
}

// Membership availability check
export async function getMembershipAvailability({ cell, designationCode, level, hrcCountryId, zone, hrcStateId, hrcDistrictId, hrcMandalId, includeAggregate = true }){
  const url = new URL(`${BASE}/memberships/public/availability`)
  if (cell) url.searchParams.set('cell', cell)
  if (designationCode) url.searchParams.set('designationCode', designationCode)
  if (level) url.searchParams.set('level', level)
  if (hrcCountryId) url.searchParams.set('hrcCountryId', hrcCountryId)
  if (zone) url.searchParams.set('zone', zone)
  if (hrcStateId) url.searchParams.set('hrcStateId', hrcStateId)
  if (hrcDistrictId) url.searchParams.set('hrcDistrictId', hrcDistrictId)
  if (hrcMandalId) url.searchParams.set('hrcMandalId', hrcMandalId)
  if (includeAggregate) url.searchParams.set('includeAggregate', String(includeAggregate))
  const res = await fetch(url.toString())
  if(!res.ok) throw new Error('Failed to check availability')
  const json = await res.json()
  return json.data
}

// Proposed endpoints (to be implemented by backend; placeholders here for future wiring)
// export async function getMembers(params) { /* GET /hrci/members ... */ }
// export async function getMembersSummary(params) { /* GET /hrci/members/summary ... */ }
