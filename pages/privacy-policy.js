import Head from 'next/head'

export default function Privacy({ title, content, error }){
  return (
    <>
      <Head>
        <title>{title ? `${title}` : 'Privacy Policy'}</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-900">{title || 'Privacy Policy'}</h1>
        <div className="mt-2 h-1.5 w-16 bg-gradient-to-r from-primary to-secondary rounded-full" />
        {error ? (
          <p className="mt-6 text-red-700">Failed to load the latest Privacy Policy. Please try again later.</p>
        ) : (
          <article
            className="mt-6 bg-white border border-gray-200 rounded-xl shadow-sm p-5 leading-7 text-gray-800"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>
    </>
  )
}

export async function getServerSideProps() {
  try {
    const res = await fetch('https://app.hrcitodaynews.in/api/v1/legal/privacy?language=en', {
      headers: { accept: 'application/json' },
      // Revalidate on every request via SSR
      cache: 'no-store',
    })
    if (!res.ok) {
      return { props: { error: true } }
    }
    const json = await res.json()
    const data = json?.data || null
    if (!data) return { props: { error: true } }
    return {
      props: {
        title: data.title || 'Privacy Policy',
        content: data.content || '',
      },
    }
  } catch (e) {
    return { props: { error: true } }
  }
}
