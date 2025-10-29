import dynamic from 'next/dynamic'

const ClientViewer = dynamic(() => import('./PDFViewerClient'), {
  ssr: false,
  loading: () => (
    <div className="relative bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
      <div className="relative" style={{ height: '600px' }}>
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading viewer...</p>
          </div>
        </div>
      </div>
    </div>
  )
})

export default function PDFViewer(props){
  return <ClientViewer {...props} />
}

export const PDFThumbnail = dynamic(() => import('./PDFViewerClient').then(m => m.PDFThumbnailClient), {
  ssr: false,
  loading: () => (
    <div className="relative bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="aspect-[3/4] relative bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    </div>
  )
})