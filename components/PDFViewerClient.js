import { useState, useEffect } from 'react'
import { ArrowDownTrayIcon, ShareIcon, PrinterIcon, MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon, DocumentIcon } from '@heroicons/react/24/outline'
import { Document, Page, pdfjs } from 'react-pdf'

// Configure PDF.js worker: prefer unpkg pdfjs-dist to ensure version match and fast load
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

export default function PDFViewerClient({ 
  fileUrl, 
  title, 
  showControls = true, 
  height = "600px",
  allowDownload = true,
  onLoadError = null 
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [scale, setScale] = useState(1)
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [progress, setProgress] = useState(null) // {loaded, total}
  const [docKey, setDocKey] = useState(0) // force remount when switching worker strategy
  const [workerFallbackUsed, setWorkerFallbackUsed] = useState(false)

  useEffect(() => {
    if (fileUrl) {
      setIsLoading(true)
      setHasError(false)
      setProgress(null)
    }
  }, [fileUrl])

  // Fallback: if worker fails to load or is blocked, disable worker after timeout and retry
  useEffect(() => {
    if (!fileUrl) return
    let cancelled = false
    const timeout = setTimeout(() => {
      if (cancelled) return
      // If still loading and no progress, assume worker couldn't start (CDN blocked/slow)
      if (isLoading && !progress && !workerFallbackUsed) {
        try {
          // Disable worker and re-mount Document
          pdfjs.disableWorker = true
          setWorkerFallbackUsed(true)
          setDocKey(k => k + 1)
        } catch (_) {}
      }
    }, 5000) // 5s timeout before falling back to no-worker mode

    return () => { cancelled = true; clearTimeout(timeout) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileUrl, isLoading, progress, workerFallbackUsed])

  const handleLoadSuccess = ({ numPages }) => {
    setNumPages(numPages)
    setIsLoading(false)
    setHasError(false)
    setProgress(null)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
    if (onLoadError) onLoadError()
  }

  const handleProgress = ({ loaded, total }) => {
    setProgress({ loaded, total })
  }

  const handleDownload = () => {
    if (fileUrl) {
      const link = document.createElement('a')
      link.href = fileUrl
      link.download = title || 'document.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handlePrint = () => {
    if (fileUrl) window.open(fileUrl, '_blank')
  }

  const handleShare = async () => {
    if (navigator.share && fileUrl) {
      try {
        await navigator.share({
          title: title || 'Document',
          text: 'Check out this document',
          url: window.location.href
        })
      } catch (_) {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(window.location.href)
          alert('Link copied to clipboard!')
        }
      }
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 3))
  const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5))

  if (!fileUrl) {
    return (
      <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg p-8" style={{ height }}>
        <DocumentIcon className="h-16 w-16 text-gray-400 mb-4" />
        <p className="text-gray-600">No document URL provided</p>
      </div>
    )
  }

  return (
    <div className="relative bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
      {showControls && (
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <button onClick={zoomOut} className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-md transition-colors" title="Zoom Out">
              <MagnifyingGlassMinusIcon className="h-5 w-5" />
            </button>
            <span className="text-sm text-gray-600 min-w-[60px] text-center">{Math.round(scale * 100)}%</span>
            <button onClick={zoomIn} className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-md transition-colors" title="Zoom In">
              <MagnifyingGlassPlusIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={handlePrint} className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-md transition-colors" title="Print">
              <PrinterIcon className="h-5 w-5" />
            </button>
            <button onClick={handleShare} className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-md transition-colors" title="Share">
              <ShareIcon className="h-5 w-5" />
            </button>
            {allowDownload && (
              <button onClick={handleDownload} className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
                <ArrowDownTrayIcon className="h-4 w-4" />
                <span>Download</span>
              </button>
            )}
          </div>
        </div>
      )}

      <div className="relative" style={{ height }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading document{progress?.total ? ` (${Math.round((progress.loaded / progress.total) * 100)}%)` : '...'}
              </p>
            </div>
          </div>
        )}

        {hasError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50">
            <DocumentIcon className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load document</h3>
            <p className="text-gray-600 mb-4 text-center max-w-md">This document cannot be previewed. You can download it to view locally.</p>
            {allowDownload && (
              <button onClick={handleDownload} className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium">
                <ArrowDownTrayIcon className="h-5 w-5" />
                <span>Download Document</span>
              </button>
            )}
          </div>
        ) : (
          <div className="w-full h-full overflow-auto flex flex-col">
            <div className="flex-1 flex items-start justify-center p-4">
              <Document 
                key={docKey}
                file={fileUrl} 
                onLoadSuccess={handleLoadSuccess} 
                onLoadError={handleError}
                onLoadProgress={handleProgress}
                options={{ disableStream: false, disableAutoFetch: false }}
                loading={null} 
                error={null}
              >
                <Page pageNumber={pageNumber} scale={scale} renderTextLayer={false} renderAnnotationLayer={false} />
              </Document>
            </div>
            {numPages && numPages > 1 && (
              <div className="border-t border-gray-200 p-3 flex items-center justify-center gap-4 text-sm text-gray-700">
                <button className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50" onClick={() => setPageNumber(p => Math.max(1, p - 1))} disabled={pageNumber <= 1}>Previous</button>
                <span>Page {pageNumber} of {numPages}</span>
                <button className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50" onClick={() => setPageNumber(p => Math.min(numPages, p + 1))} disabled={pageNumber >= numPages}>Next</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export function PDFThumbnailClient({ fileUrl, title, className = "", onClick = null, showTitle = true }){
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const onLoadSuccess = () => { setIsLoading(false); setHasError(false) }
  const onError = () => { setIsLoading(false); setHasError(true) }

  return (
    <div className={`relative bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${className}`} onClick={onClick}>
      <div className="aspect-[3/4] relative bg-gray-50">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        {hasError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <DocumentIcon className="h-12 w-12 text-gray-400 mb-2" />
            <span className="text-xs text-gray-500">Preview not available</span>
          </div>
        ) : (
          <Document file={fileUrl} onLoadSuccess={onLoadSuccess} onLoadError={onError} loading={null} error={null}>
            <Page pageNumber={1} width={280} renderTextLayer={false} renderAnnotationLayer={false} />
          </Document>
        )}
      </div>
      {showTitle && (
        <div className="p-3">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{title}</h3>
        </div>
      )}
    </div>
  )
}
