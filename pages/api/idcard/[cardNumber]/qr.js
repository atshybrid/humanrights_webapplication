const BACKEND_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, '') || 'https://app.humanrightscouncilforindia.org'

export default async function handler(req, res) {
  const { cardNumber } = req.query
  if (!cardNumber || Array.isArray(cardNumber)) {
    return res.status(400).json({ error: 'Invalid card number' })
  }

  try {
    const backendUrl = `${BACKEND_BASE}/hrci/idcard/${encodeURIComponent(cardNumber)}/qr`
    const response = await fetch(backendUrl)
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch QR code' })
    }

    const svg = await response.text()
    res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8')
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
    return res.status(200).send(svg)
  } catch {
    return res.status(500).json({ error: 'Failed to load QR code' })
  }
}
