import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getOrgSettings } from '../lib/api'
import { Skeleton } from './Skeleton'

export default function Navbar() {
  const [org, setOrg] = useState(null)
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    getOrgSettings().then(setOrg).catch(() => {})
  }, [])

  const logo = org?.hrciLogoUrl || null
  const orgName = org?.orgName || null

  // When not on home page, links should navigate to home with hash
  const to = (hash) => (router.pathname === '/' ? `#${hash}` : `/#${hash}`)

  const NavLinks = ({ onClick }) => (
    <>
      <Link href={to('about')} className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-secondary" onClick={onClick}>About</Link>
      <Link href={to('donations')} className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-secondary" onClick={onClick}>Donations</Link>
      <Link href="/members" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-secondary" onClick={onClick}>Members</Link>
  <Link href={to('success-stories')} className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-secondary" onClick={onClick}>Stories</Link>
      <Link href={to('donor-wall')} className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-secondary" onClick={onClick}>Donors</Link>
      <Link href="/documents" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-secondary" onClick={onClick}>Documents</Link>
  <Link href="/contact" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-secondary" onClick={onClick}>Contact</Link>
    </>
  )

  return (
    <header className="sticky top-0 z-50">
      <div className="relative border-b border-white/20 bg-white/70 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
        <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-secondary via-primary to-secondary opacity-80" />
        <nav className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex min-w-0 flex-1 items-center gap-3">
              {logo ? (
                <img src={logo} alt="Logo" className="h-9 w-9 rounded bg-gray-100 object-contain p-1 ring-1 ring-gray-200" />
              ) : (
                <Skeleton className="h-9 w-9 rounded" />
              )}
              {orgName ? (
                <span className="text-sm sm:text-base font-semibold text-gray-900 truncate max-w-[55vw] sm:max-w-none">{orgName}</span>
              ) : (
                <Skeleton className="h-5 w-48 rounded" />
              )}
            </Link>

            <div className="hidden md:flex items-center">
              <NavLinks />
              <Link
                href="/donations"
                className="ml-3 inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-secondary"
              >
                Donate
              </Link>
            </div>

            <button
              aria-label="Toggle navigation"
              className="md:hidden ml-2 inline-flex flex-shrink-0 items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-secondary"
              onClick={() => setOpen(!open)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {open && (
          <div className="md:hidden border-t border-gray-200 bg-white/90 backdrop-blur">
            <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col">
              <NavLinks onClick={() => setOpen(false)} />
              <Link
                href="/donations"
                className="mt-2 inline-flex w-fit items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-secondary"
                onClick={() => setOpen(false)}
              >
                Donate
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
