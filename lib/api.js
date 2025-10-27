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
