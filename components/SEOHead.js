import Head from 'next/head'

export default function SEOHead({
  title,
  description,
  canonical,
  ogImage,
  ogType = 'website',
  article = null,
  noindex = false,
  children
}) {
  const siteName = 'Human Rights Council for India (HRCI)'
  const defaultDescription = 'HRCI works to protect and promote human rights across India through legal aid, investigations, and community programs. Join our mission for justice and equality.'
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hrci.org'
  
  const metaTitle = title ? `${title} — ${siteName}` : siteName
  const metaDescription = description || defaultDescription
  const metaCanonical = canonical ? `${baseUrl}${canonical}` : undefined
  const metaImage = ogImage ? (ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`) : `${baseUrl}/images/og-default.png`

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      {canonical && <link rel="canonical" href={metaCanonical} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Viewport and Mobile */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#FE0002" />
      
      {/* Favicons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:site_name" content={siteName} />
      {canonical && <meta property="og:url" content={metaCanonical} />}
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
      
      {/* Article Meta (for blog posts/stories) */}
      {article && (
        <>
          <meta property="article:published_time" content={article.publishedTime} />
          <meta property="article:modified_time" content={article.modifiedTime} />
          <meta property="article:author" content={article.author} />
          <meta property="article:section" content={article.section} />
          {article.tags?.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Additional SEO */}
      <meta name="author" content="Human Rights Council for India" />
      <meta name="keywords" content="human rights, India, legal aid, justice, equality, investigations, community programs, HRCI" />
      
      {children}
    </Head>
  )
}

// Helper function for generating structured data
export function generateStructuredData(type, data) {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data
  }
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(baseData) }}
    />
  )
}