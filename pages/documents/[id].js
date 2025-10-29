import { useState } from 'react'
// import { GetServerSideProps } from 'next' // Type-only import not needed in runtime
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ArrowLeftIcon, CalendarIcon, UserIcon, TagIcon, FolderIcon, ArrowDownTrayIcon, ShareIcon, EyeIcon } from '@heroicons/react/24/outline'
import Footer from '../../components/Footer'
import SEOHead from '../../components/SEOHead'
import PDFViewer, { PDFThumbnail } from '../../components/PDFViewer'
import { getDocumentById, getDocuments } from '../../lib/api'

export default function DocumentDetailPage({ document, relatedDocuments = [] }) {
  const router = useRouter()
  const [showFullViewer, setShowFullViewer] = useState(false)

  if (router.isFallback) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!document) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Document Not Found</h1>
            <p className="text-gray-600 mb-6">The document you're looking for doesn't exist.</p>
            <Link
              href="/documents"
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Browse Documents
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          text: document.description || 'Check out this document from HRCI',
          url: window.location.href
        })
      } catch (error) {
        // Fallback to clipboard
        if (navigator.clipboard) {
          navigator.clipboard.writeText(window.location.href)
          alert('Link copied to clipboard!')
        }
      }
    } else {
      // Fallback to clipboard
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href)
        alert('Link copied to clipboard!')
      }
    }
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "DigitalDocument",
    "name": document.title,
    "description": document.description,
    "url": typeof window !== 'undefined' ? window.location.href : '',
    "datePublished": document.createdAt,
    "dateModified": document.updatedAt,
    "author": {
      "@type": "Organization",
      "name": "Human Rights Council India"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Human Rights Council India"
    },
    "contentSize": formatFileSize(document.fileSize),
    "encodingFormat": "application/pdf"
  }

  return (
    <>
      <SEOHead
        title={`${document.title} - Documents - Human Rights Council India`}
        description={document.description || `View and download ${document.title} from Human Rights Council India official documents.`}
        canonical={`/documents/${document.id}`}
        structuredData={structuredData}
        noindex={false}
      />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Navigation */}
          <div className="mb-6">
            <Link
              href="/documents"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Documents
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Document Info Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  {document.title}
                </h1>

                {document.description && (
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {document.description}
                  </p>
                )}

                {/* Document Metadata */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <span className="font-medium">Published:</span>
                      <span className="ml-2">{formatDate(document.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <span className="font-medium">File Size:</span>
                      <span className="ml-2">{formatFileSize(document.fileSize)}</span>
                    </div>
                  </div>

                  {document.author && (
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <span className="font-medium">Author:</span>
                        <span className="ml-2">{document.author}</span>
                      </div>
                    </div>
                  )}

                  {document.category && (
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <TagIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <span className="font-medium">Category:</span>
                        <span className="ml-2">{document.category}</span>
                      </div>
                    </div>
                  )}

                  {document.folder && (
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <FolderIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <span className="font-medium">Folder:</span>
                        <span className="ml-2">{document.folder}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <a
                    href={document.fileUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2"
                  >
                    <ArrowDownTrayIcon className="h-5 w-5" />
                    <span>Download PDF</span>
                  </a>

                  <button
                    onClick={handleShare}
                    className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-200 transition-colors font-medium flex items-center justify-center space-x-2"
                  >
                    <ShareIcon className="h-5 w-5" />
                    <span>Share Document</span>
                  </button>

                  <button
                    onClick={() => setShowFullViewer(!showFullViewer)}
                    className="w-full bg-green-100 text-green-700 px-6 py-3 rounded-md hover:bg-green-200 transition-colors font-medium flex items-center justify-center space-x-2"
                  >
                    <EyeIcon className="h-5 w-5" />
                    <span>{showFullViewer ? 'Hide' : 'Show'} Full Viewer</span>
                  </button>
                </div>

                {/* Tags */}
                {document.tags && document.tags.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {document.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Document Viewer */}
            <div className="lg:col-span-2">
              {showFullViewer ? (
                <PDFViewer
                  fileUrl={document.fileUrl}
                  title={document.title}
                  height="800px"
                  showControls={true}
                  allowDownload={true}
                />
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Document Preview
                    </h2>
                    <PDFThumbnail
                      fileUrl={document.fileUrl}
                      title={document.title}
                      className="mx-auto max-w-sm"
                      showTitle={false}
                      onClick={() => setShowFullViewer(true)}
                    />
                    <button
                      onClick={() => setShowFullViewer(true)}
                      className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
                    >
                      Open Full Viewer
                    </button>
                  </div>
                </div>
              )}

              {/* Related Documents */}
              {relatedDocuments.length > 0 && (
                <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Related Documents</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {relatedDocuments.map((relatedDoc) => (
                      <Link
                        key={relatedDoc.id}
                        href={`/documents/${relatedDoc.id}`}
                        className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                      >
                        <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">
                          {relatedDoc.title}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {relatedDoc.description}
                        </p>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>{formatFileSize(relatedDoc.fileSize)}</span>
                          <span>{formatDate(relatedDoc.createdAt)}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  )
}

export async function getStaticPaths() {
  // Defer to on-demand generation for most documents
  return { paths: [], fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  try {
    const documentId = params?.id
    if (!documentId) {
      return { notFound: true }
    }

    const document = await getDocumentById(documentId).catch(() => null)
    if (!document) {
      return { notFound: true }
    }

    const relatedDocuments = await getDocuments({
      categoryId: document.categoryId,
      folderId: document.folderId,
      limit: 4
    }).catch(() => [])

    const sanitizeDoc = (d) => ({ ...d, fileSize: d?.fileSize ?? null })
    const sanitizedDocument = sanitizeDoc(document)
    const filteredRelated = relatedDocuments
      .filter(doc => doc.id !== document.id)
      .map(sanitizeDoc)

    return {
      props: {
        document: sanitizedDocument,
        relatedDocuments: filteredRelated
      },
      revalidate: 600
    }
  } catch (error) {
    console.error('Error in getStaticProps:', error)
    return { notFound: true, revalidate: 60 }
  }
}