import Link from 'next/link'

function ErrorPage({ statusCode }) {
  const title = statusCode ? `Error ${statusCode}` : 'Something went wrong'
  const message = statusCode
    ? 'The page could not be loaded. Please try again.'
    : 'An unexpected error occurred. Please refresh the page.'

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-6xl font-extrabold text-[#FE0002]">{statusCode || '!'}</p>
        <h1 className="mt-4 text-xl font-bold text-gray-900">{title}</h1>
        <p className="mt-2 text-sm text-gray-600">{message}</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center rounded-lg bg-[#FE0002] px-4 py-2 text-sm font-semibold text-white hover:bg-[#d90002]"
          >
            Go Home
          </Link>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  )
}

ErrorPage.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default ErrorPage
