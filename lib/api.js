// API helpers using the endpoints you provided.
// These functions fetch public data for organization, events, donors, and stories.

// Base URL for backend API
// Prefer environment variable; fallback to production API if not set
const BASE = process.env.NEXT_PUBLIC_API_URL || 'https://app.humanrightscouncilforindia.org/api/v1'

// Small helper to ensure external calls don't hang static generation
async function fetchWithTimeout(url, options = {}, timeoutMs = 5000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, { ...options, signal: controller.signal })
    return res
  } finally {
    clearTimeout(timer)
  }
}

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
// Public Members directory
export async function getPublicMembers({ level, hrcStateId, hrcDistrictId, hrcMandalId, q, page = 1, pageSize = 24 } = {}){
  const url = new URL(`${BASE}/memberships/public/members`)
  if (level) url.searchParams.set('level', level)
  if (hrcStateId) url.searchParams.set('hrcStateId', hrcStateId)
  if (hrcDistrictId) url.searchParams.set('hrcDistrictId', hrcDistrictId)
  if (hrcMandalId) url.searchParams.set('hrcMandalId', hrcMandalId)
  if (q) url.searchParams.set('q', q)
  if (page) url.searchParams.set('page', String(page))
  if (pageSize) url.searchParams.set('pageSize', String(pageSize))
  const res = await fetchWithTimeout(url.toString(), {}, 8000)
  if (!res.ok) throw new Error('Failed to fetch members')
  const json = await res.json()
  // Expect shape: { success, data: { total, page, pageSize, items: [] } }
  return json.data || { total: 0, page, pageSize, items: [] }
}

// Membership Pay-First flow
export async function createMembershipOrderPayfirst(payload){
  const res = await fetch(`${BASE}/memberships/payfirst/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if(!res.ok) throw new Error('Failed to create membership order')
  const json = await res.json()
  return json.data || json
}

export async function confirmMembershipPayfirst(body){
  const res = await fetch(`${BASE}/memberships/payfirst/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if(!res.ok) throw new Error('Failed to confirm membership payment')
  const json = await res.json()
  return json.data || json
}

// GeoJSON endpoints for advanced map rendering (to be implemented on backend)
export async function getStatesGeoJSON(countryId){
  if(!countryId) return null
  const url = `${BASE}/hrci/geo/states-geojson?countryId=${encodeURIComponent(countryId)}`
  try{
    const res = await fetch(url)
    if(!res.ok) throw new Error('Failed to fetch states GeoJSON')
    return await res.json() // Expect a valid GeoJSON FeatureCollection
  }catch(err){
    // Fallback: public India states GeoJSON (simplified). Note: IDs may be names.
    try{
      const cdn = 'https://cdn.jsdelivr.net/npm/india-geojson@0.0.1/india_states.geojson'
      const fres = await fetch(cdn)
      if(!fres.ok) throw new Error('Fallback states GeoJSON failed')
      const fc = await fres.json()
      // Ensure feature.properties.id exists; map common name keys
      const nameKeys = ['name','NAME_1','st_nm','ST_NM','state_name','STATE','State']
      for (const f of fc.features || []){
        const props = f.properties || {}
        let name = ''
        for (const k of nameKeys){ if (props[k]) { name = props[k]; break } }
        if (!props.id) props.id = name || f.id || undefined
        // Zone is optional; could be mapped later in UI if required
      }
      return fc
    }catch(_){
      throw err
    }
  }
}

export async function getDistrictsGeoJSON(stateId){
  if(!stateId) return null
  const url = `${BASE}/hrci/geo/districts-geojson?stateId=${encodeURIComponent(stateId)}`
  const res = await fetch(url)
  if(!res.ok) throw new Error('Failed to fetch districts GeoJSON')
  return res.json()
}

export async function getMandalsGeoJSON(districtId){
  if(!districtId) return null
  const url = `${BASE}/hrci/geo/mandals-geojson?districtId=${encodeURIComponent(districtId)}`
  const res = await fetch(url)
  if(!res.ok) throw new Error('Failed to fetch mandals GeoJSON')
  return res.json()
}

// Trusted Documents API
export async function getDocumentCategories(){
  try {
    const res = await fetchWithTimeout(`${BASE}/documents/categories`, {}, 5000)
    if(!res.ok) throw new Error('Failed to fetch document categories')
    const json = await res.json()
    return json.data || []
  } catch (error) {
    // Fallback to mock categories for local PDFs
    return [
      { id: 'legal', name: 'Legal Documents', documentCount: 3 },
      { id: 'certificates', name: 'Certificates', documentCount: 2 },
      { id: 'forms', name: 'Forms & Applications', documentCount: 4 },
      { id: 'ministry', name: 'Ministry Documents', documentCount: 1 }
    ]
  }
}

export async function getDocumentFolders(categoryId = null){
  try {
    const url = categoryId ? 
      `${BASE}/documents/folders?categoryId=${encodeURIComponent(categoryId)}` : 
      `${BASE}/documents/folders`
    const res = await fetchWithTimeout(url, {}, 5000)
    if(!res.ok) throw new Error('Failed to fetch document folders')
    const json = await res.json()
    return json.data || []
  } catch (error) {
    // For local PDFs, we don't use folders yet
    return []
  }
}

export async function getDocuments({ categoryId, folderId, search, limit = 20, offset = 0 } = {}){
  try {
    const url = new URL(`${BASE}/documents`)
    if (categoryId) url.searchParams.set('categoryId', categoryId)
    if (folderId) url.searchParams.set('folderId', folderId)
    if (search) url.searchParams.set('search', search)
    if (limit) url.searchParams.set('limit', String(limit))
    if (offset) url.searchParams.set('offset', String(offset))
    
    const res = await fetchWithTimeout(url.toString(), {}, 5000)
    if(!res.ok) throw new Error('Failed to fetch documents')
    const json = await res.json()
    return json.data || []
  } catch (error) {
    // Fallback to local uploaded PDFs
    const localDocs = await getLocalDocuments({ categoryId, search, limit, offset })
    return localDocs
  }
}

// Local PDF documents handler
export async function getLocalDocuments({ categoryId, search, limit = 20, offset = 0 } = {}) {
  // Helper to compute size (bytes) on server, HEAD fallback on client
  async function computeSizeBytes(fileUrl, filename){
    // Server-side: read from filesystem
    if (typeof window === 'undefined'){
      try{
        const fs = require('fs')
        const path = require('path')
        const documentsPath = path.join(process.cwd(), 'pages', 'documents')
        const filePath = path.join(documentsPath, filename)
        const stat = fs.statSync(filePath)
        return stat.size
      }catch(_){
        return undefined
      }
    }
    // Client-side: HEAD request to API provides Content-Length
    try{
      const res = await fetch(fileUrl, { method: 'HEAD' })
      const len = res.headers.get('content-length')
      return len ? Number(len) : undefined
    }catch(_){
      return undefined
    }
  }

  const docs = [
    {
      id: 'form-10ab-1',
      title: 'Form 10AB Approval Order (1068351415)',
      description: 'Official approval order for Form 10AB registration under Income Tax Act',
      fileUrl: '/api/pdf/AACTH7205E_Form 10AB Approval Order_1068351415(1)_05092024.pdf',
      categoryId: 'legal',
      category: 'Legal Documents',
      fileSize: null,
      createdAt: '2024-09-05T00:00:00Z',
      featured: true
    },
    {
      id: 'form-10ab-2', 
      title: 'Form 10AB Approval Order (1068354289)',
      description: 'Additional approval order for Form 10AB registration',
      fileUrl: '/api/pdf/AACTH7205E_Form 10AB Approval Order_1068354289(1)_05092024.pdf',
      categoryId: 'legal',
      category: 'Legal Documents',
      fileSize: null,
      createdAt: '2024-09-05T00:00:00Z'
    },
    {
      id: 'csr-approval',
      title: 'CSR1 Approval Letter',
      description: 'Corporate Social Responsibility Form CSR1 approval documentation',
      fileUrl: '/api/pdf/Approval Letter for form CSR1.PDF',
      categoryId: 'forms',
      category: 'Forms & Applications',
      fileSize: null,
      createdAt: '2024-08-15T00:00:00Z',
      featured: true
    },
    {
      id: 'ministry-doc',
      title: 'Ministry of Social Justice & Empowerment',
      description: 'Official documentation from Ministry of Social Justice & Empowerment',
      fileUrl: '/api/pdf/MINISTRY OF SOCIAL JUSTICE & EMPOWERMENT.pdf',
      categoryId: 'ministry',
      category: 'Ministry Documents',
      fileSize: null,
      createdAt: '2024-07-01T00:00:00Z',
      featured: true
    },
    {
      id: 'ngo-darpan',
      title: 'NGO Darpan Certificate',
      description: 'Official NGO Darpan registration certificate',
      fileUrl: '/api/pdf/ngo darpan certificate-1.pdf',
      categoryId: 'certificates',
      category: 'Certificates',
      fileSize: null,
      createdAt: '2024-06-15T00:00:00Z'
    },
    {
      id: 'doc-scanner-mar',
      title: 'Document Scanner - March 2025',
      description: 'Scanned official document from March 2025',
      fileUrl: '/api/pdf/DocScanner 7 Mar 2025 10-22 pm.pdf',
      categoryId: 'certificates',
      category: 'Certificates',
      fileSize: null,
      createdAt: '2025-03-07T00:00:00Z'
    },
    {
      id: 'doc-scanner-jan',
      title: 'Document Scanner - January 2025',
      description: 'Scanned official document from January 2025',
      fileUrl: '/api/pdf/DocScanner Jan 31, 2025 16-26.pdf',
      categoryId: 'forms',
      category: 'Forms & Applications',
      fileSize: null,
      createdAt: '2025-01-31T00:00:00Z'
    },
    {
      id: 'whatsapp-doc',
      title: 'WhatsApp Document - July 2023',
      description: 'Official document shared via WhatsApp communication',
      fileUrl: '/api/pdf/DOC-20230701-WA0029.pdf',
      categoryId: 'forms',
      category: 'Forms & Applications',
      fileSize: null,
      createdAt: '2023-07-01T00:00:00Z'
    }
  ]

  // Fill accurate sizes (bytes) where possible
  const withSizes = await Promise.all(docs.map(async d => {
    if (!d.fileUrl) return d
    if (d.fileSize && d.fileSize > 0) return d
    const filename = decodeURIComponent(d.fileUrl.split('/api/pdf/')[1] || '')
    const bytes = await computeSizeBytes(d.fileUrl, filename)
    // Ensure JSON-serializable: default to null when size unknown
    const size = (typeof bytes === 'number' && !Number.isNaN(bytes)) ? bytes : (typeof d.fileSize === 'number' ? d.fileSize : null)
    return { ...d, fileSize: size }
  }))

  let filteredDocs = withSizes

  // Filter by category
  if (categoryId) {
    filteredDocs = filteredDocs.filter(doc => doc.categoryId === categoryId)
  }

  // Filter by search term
  if (search) {
    const searchLower = search.toLowerCase()
    filteredDocs = filteredDocs.filter(doc => 
      doc.title.toLowerCase().includes(searchLower) ||
      doc.description.toLowerCase().includes(searchLower)
    )
  }

  // Apply pagination
  const start = offset
  const end = start + limit
  return filteredDocs.slice(start, end)
}

export async function getDocumentById(id){
  try {
    const res = await fetchWithTimeout(`${BASE}/documents/${id}`, {}, 5000)
    if(!res.ok) throw new Error('Failed to fetch document')
    const json = await res.json()
    return json.data
  } catch (error) {
    // Fallback to local documents
    const allDocs = await getLocalDocuments({ limit: 50 })
    return allDocs.find(doc => doc.id === id)
  }
}

export async function getFeaturedDocuments(limit = 6){
  try {
    const res = await fetchWithTimeout(`${BASE}/documents/featured?limit=${limit}`, {}, 5000)
    if(!res.ok) throw new Error('Failed to fetch featured documents')
    const json = await res.json()
    return json.data || []
  } catch (error) {
    // Fallback to local featured documents
    const allDocs = await getLocalDocuments({ limit: 50 })
    return allDocs.filter(doc => doc.featured).slice(0, limit)
  }
}
