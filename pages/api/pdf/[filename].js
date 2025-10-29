import fs from 'fs'
import path from 'path'

export default function handler(req, res) {
  const { filename } = req.query

  if (!filename) {
    return res.status(400).json({ error: 'Filename is required' })
  }

  try {
    // Only allow PDF files
    if (!filename.toLowerCase().endsWith('.pdf')) {
      return res.status(400).json({ error: 'Only PDF files are allowed' })
    }

    const documentsPath = path.join(process.cwd(), 'pages', 'documents')
    const resolvedDocumentsPath = path.resolve(documentsPath)
    const requestedPath = path.resolve(path.join(documentsPath, filename))

    // Security: ensure file is within documents directory
    if (!requestedPath.startsWith(resolvedDocumentsPath + path.sep)) {
      return res.status(403).json({ error: 'Access denied' })
    }

    // Check if file exists
    if (!fs.existsSync(requestedPath)) {
      return res.status(404).json({ error: 'File not found' })
    }

    const stat = fs.statSync(requestedPath)
    const fileSize = stat.size
    const lastModified = stat.mtime.toUTCString()

    // Common headers
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `inline; filename="${path.basename(filename)}"`)
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    res.setHeader('Accept-Ranges', 'bytes')
    res.setHeader('Last-Modified', lastModified)

    if (req.method === 'HEAD') {
      res.setHeader('Content-Length', String(fileSize))
      return res.status(200).end()
    }

    // Support HTTP Range requests for faster first-page rendering
    const range = req.headers.range
    if (range) {
      const bytesPrefix = 'bytes='
      if (!range.startsWith(bytesPrefix)) {
        return res.status(416).end()
      }

      // Parse Range header: e.g., bytes=start-end
      const [startStr, endStr] = range.replace(bytesPrefix, '').split('-')
      let start = parseInt(startStr, 10)
      let end = endStr ? parseInt(endStr, 10) : fileSize - 1

      if (Number.isNaN(start)) start = 0
      if (Number.isNaN(end) || end >= fileSize) end = fileSize - 1
      if (start > end || start < 0) {
        return res.status(416).end()
      }

      const chunkSize = (end - start) + 1
      res.status(206)
      res.setHeader('Content-Range', `bytes ${start}-${end}/${fileSize}`)
      res.setHeader('Content-Length', String(chunkSize))

      const stream = fs.createReadStream(requestedPath, { start, end })
      stream.on('open', () => stream.pipe(res))
      stream.on('error', (err) => {
        console.error('Stream error:', err)
        res.status(500).end()
      })
      return
    }

    // No range: stream whole file
    res.setHeader('Content-Length', String(fileSize))
    const stream = fs.createReadStream(requestedPath)
    stream.on('open', () => stream.pipe(res))
    stream.on('error', (err) => {
      console.error('Stream error:', err)
      res.status(500).end()
    })
  } catch (error) {
    console.error('Error serving PDF:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}