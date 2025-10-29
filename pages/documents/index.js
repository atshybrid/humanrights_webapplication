import { useState, useEffect } from 'react'
// import { GetServerSideProps } from 'next' // Type-only import not needed in runtime
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRightIcon, FolderIcon, DocumentIcon, MagnifyingGlassIcon, ArrowDownTrayIcon, EyeIcon } from '@heroicons/react/24/outline'
import Footer from '../../components/Footer'
import SEOHead from '../../components/SEOHead'
import { getDocumentCategories, getDocumentFolders, getDocuments, getFeaturedDocuments } from '../../lib/api'

export default function DocumentsPage({ 
  initialCategories = [], 
  initialFolders = [], 
  initialDocuments = [], 
  featuredDocs = [] 
}) {
  const [categories, setCategories] = useState(initialCategories)
  const [folders, setFolders] = useState(initialFolders)
  const [documents, setDocuments] = useState(initialDocuments)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedFolder, setSelectedFolder] = useState(null)
  const [breadcrumb, setBreadcrumb] = useState([])

  // Handle category selection
  const handleCategorySelect = async (category) => {
    setLoading(true)
    setSelectedCategory(category)
    setSelectedFolder(null)
    setBreadcrumb([{ name: category.name, type: 'category' }])
    
    try {
      const [foldersData, docsData] = await Promise.all([
        getDocumentFolders(category.id),
        getDocuments({ categoryId: category.id })
      ])
      setFolders(foldersData)
      setDocuments(docsData)
    } catch (error) {
      console.error('Error loading category data:', error)
    }
    setLoading(false)
  }

  // Handle folder selection
  const handleFolderSelect = async (folder) => {
    setLoading(true)
    setSelectedFolder(folder)
    setBreadcrumb([
      { name: selectedCategory.name, type: 'category' },
      { name: folder.name, type: 'folder' }
    ])
    
    try {
      const docsData = await getDocuments({ 
        categoryId: selectedCategory?.id,
        folderId: folder.id 
      })
      setDocuments(docsData)
    } catch (error) {
      console.error('Error loading folder documents:', error)
    }
    setLoading(false)
  }

  // Handle search
  const handleSearch = async (searchTerm) => {
    if (!searchTerm.trim()) return
    
    setLoading(true)
    try {
      const searchResults = await getDocuments({ 
        search: searchTerm,
        categoryId: selectedCategory?.id,
        folderId: selectedFolder?.id
      })
      setDocuments(searchResults)
    } catch (error) {
      console.error('Error searching documents:', error)
    }
    setLoading(false)
  }

  // Reset to all documents
  const resetToAll = async () => {
    setLoading(true)
    setSelectedCategory(null)
    setSelectedFolder(null)
    setBreadcrumb([])
    setSearch('')
    
    try {
      const [foldersData, docsData] = await Promise.all([
        getDocumentFolders(),
        getDocuments()
      ])
      setFolders(foldersData)
      setDocuments(docsData)
    } catch (error) {
      console.error('Error loading all documents:', error)
    }
    setLoading(false)
  }

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <>
      <SEOHead
        title="Trusted Documents - Human Rights Council India"
        description="Access official documents, reports, guidelines, and resources from Human Rights Council India. Browse by category and download important PDFs."
        canonical="/documents"
      />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Trusted Documents</h1>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Access official documents, reports, guidelines, and resources from Human Rights Council India
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto relative">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search documents..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch(search)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                  <button
                    onClick={() => handleSearch(search)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          {breadcrumb.length > 0 && (
            <nav className="flex mb-6" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <button 
                    onClick={resetToAll}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    All Documents
                  </button>
                </li>
                {breadcrumb.map((item, index) => (
                  <li key={index} className="flex items-center">
                    <ChevronRightIcon className="h-4 w-4 text-gray-400 mx-2" />
                    <span className="text-gray-700 font-medium">{item.name}</span>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {/* Featured Documents */}
          {!selectedCategory && !selectedFolder && featuredDocs.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Documents</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredDocs.map((doc) => (
                  <Link 
                    key={doc.id} 
                    href={`/documents/${doc.id}`}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <DocumentIcon className="h-12 w-12 text-red-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                            {doc.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                            {doc.description}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{formatFileSize(doc.fileSize)}</span>
                            <span>{formatDate(doc.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Categories and Folders */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Browse Documents</h3>
                
                {!selectedCategory ? (
                  /* Categories List */
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Categories</h4>
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategorySelect(category)}
                        className="w-full text-left p-3 rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors flex items-center space-x-3"
                      >
                        <FolderIcon className="h-5 w-5 text-blue-500" />
                        <div>
                          <div className="font-medium text-gray-900">{category.name}</div>
                          <div className="text-sm text-gray-500">{category.documentCount || 0} docs</div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  /* Folders List */
                  <div className="space-y-2">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-700">Folders</h4>
                      <button 
                        onClick={resetToAll}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        ← Back
                      </button>
                    </div>
                    
                    {folders.length > 0 ? (
                      folders.map((folder) => (
                        <button
                          key={folder.id}
                          onClick={() => handleFolderSelect(folder)}
                          className={`w-full text-left p-3 rounded-lg border transition-colors flex items-center space-x-3 ${
                            selectedFolder?.id === folder.id 
                              ? 'bg-blue-50 border-blue-200' 
                              : 'hover:bg-gray-50 border-gray-200'
                          }`}
                        >
                          <FolderIcon className="h-5 w-5 text-yellow-500" />
                          <div>
                            <div className="font-medium text-gray-900">{folder.name}</div>
                            <div className="text-sm text-gray-500">{folder.documentCount || 0} docs</div>
                          </div>
                        </button>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 italic">No folders in this category</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Main Content - Documents Grid */}
            <div className="lg:w-3/4">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : documents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {documents.map((doc) => (
                    <div key={doc.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <DocumentIcon className="h-16 w-16 text-red-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                              {doc.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                              {doc.description || 'No description available'}
                            </p>
                            
                            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                              <span>{formatFileSize(doc.fileSize)}</span>
                              <span>{formatDate(doc.createdAt)}</span>
                            </div>
                            
                            <div className="flex space-x-2">
                              <Link
                                href={`/documents/${doc.id}`}
                                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-center text-sm font-medium flex items-center justify-center space-x-2"
                              >
                                <EyeIcon className="h-4 w-4" />
                                <span>View</span>
                              </Link>
                              <a
                                href={doc.fileUrl}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium flex items-center justify-center"
                              >
                                <ArrowDownTrayIcon className="h-4 w-4" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <DocumentIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
                  <p className="text-gray-600">
                    {search ? `No documents match "${search}"` : 'No documents available in this section'}
                  </p>
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

export const getStaticProps = async () => {
  try {
    const [categoriesData, foldersData, documentsData, featuredData] = await Promise.all([
      getDocumentCategories().catch(() => []),
      getDocumentFolders().catch(() => []),
      getDocuments({ limit: 12 }).catch(() => []),
      getFeaturedDocuments().catch(() => [])
    ])

    // Sanitize to ensure JSON-serializable values (no undefined)
    const sanitizeDoc = (d) => ({
      ...d,
      fileSize: d?.fileSize ?? null,
    })
    const sanitizedDocuments = (documentsData || []).map(sanitizeDoc)
    const sanitizedFeatured = (featuredData || []).map(sanitizeDoc)
    if (sanitizedDocuments?.length) {
      console.log('[SSR] /documents first fileSize:', sanitizedDocuments[0]?.fileSize, typeof sanitizedDocuments[0]?.fileSize)
    }

    return {
      props: {
        initialCategories: categoriesData || [],
        initialFolders: foldersData || [],
        initialDocuments: sanitizedDocuments,
        featuredDocs: sanitizedFeatured
      },
      revalidate: 600 // Re-generate every 10 minutes
    }
  } catch (error) {
    console.error('Error in getServerSideProps:', error)
    return {
      props: {
        initialCategories: [],
        initialFolders: [],
        initialDocuments: [],
        featuredDocs: []
      },
      revalidate: 600
    }
  }
}