import Head from 'next/head'

export default function Terms({ title, content, error }){
  return (
    <>
      <Head>
        <title>{title ? `${title}` : 'Terms & Conditions'}</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-900">{title || 'Terms & Conditions'}</h1>
        <div className="mt-2 h-1.5 w-16 bg-gradient-to-r from-primary to-secondary rounded-full" />
        {error ? (
          <p className="mt-6 text-red-700">Failed to load the latest Terms & Conditions. Please try again later.</p>
        ) : (
          <article
            className="mt-6 bg-white border border-gray-200 rounded-xl shadow-sm p-5 leading-7 text-gray-800"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}

        <article className="mt-6 bg-white border border-gray-200 rounded-xl shadow-sm p-5 leading-7 text-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Child Safety</h2>
          <p>Khabhar X maintains a strict zero-tolerance policy against Child Sexual Abuse Material (CSAM) and any content that exploits, endangers, or harms children. Users must not upload, share, or distribute:</p>
          <ul className="list-disc pl-6 mt-2 mb-3 space-y-1">
            <li>Child sexual abuse material (CSAM) of any kind</li>
            <li>Content that sexualises minors</li>
            <li>Content used for grooming, solicitation, or exploitation of children</li>
            <li>Any content that endangers the physical or emotional safety of children</li>
          </ul>
          <p>Violations will result in immediate account termination and reporting to NCMEC and relevant Indian law enforcement authorities (including under the POCSO Act, 2012). To report child safety violations, email <a href="mailto:hrcitodaynews@gmail.com" className="text-blue-600 underline">hrcitodaynews@gmail.com</a> with the subject <strong>CHILD SAFETY REPORT</strong>, or use the in-app Report button. See our full <a href="/child-safety" className="text-blue-600 underline">Child Safety Standards</a> policy for details.</p>
        </article>
      </div>
    </>
  )
}

export async function getServerSideProps() {
  try {
    const res = await fetch('https://app.hrcitodaynews.in/api/v1/legal/terms?language=en', {
      headers: { accept: 'application/json' },
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
        title: data.title || 'Terms & Conditions',
        content: data.content || '',
      },
    }
  } catch (e) {
    return { props: { error: true } }
  }
}
