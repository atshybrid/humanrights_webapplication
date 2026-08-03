import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-6xl font-extrabold text-[#FE0002]">404</p>
        <h1 className="mt-4 text-xl font-bold text-gray-900">Page Not Found</h1>
        <p className="mt-2 text-sm text-gray-600">
          The page you are looking for does not exist or may have been moved.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center rounded-lg bg-[#FE0002] px-4 py-2 text-sm font-semibold text-white hover:bg-[#d90002]"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
