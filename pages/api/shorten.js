export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  const { url } = req.body
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'url required' })
  }
  try {
    const response = await fetch(
      `https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`,
      { headers: { 'User-Agent': 'HRCI-App/1.0' } }
    )
    const short = await response.text()
    if (!short.startsWith('https://tinyurl.com/')) {
      throw new Error('Invalid response from shortener')
    }
    return res.status(200).json({ short })
  } catch (e) {
    // Fallback: return original URL if shortening fails
    return res.status(200).json({ short: url })
  }
}
