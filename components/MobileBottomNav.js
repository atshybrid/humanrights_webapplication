import Link from 'next/link'
import { useRouter } from 'next/router'

function NavItem({ href, label, icon, active }){
  return (
    <Link href={href} className={`flex flex-col items-center justify-center flex-1 py-2 ${active ? 'text-primary' : 'text-gray-600'}`}>
      <span className={`inline-flex h-6 w-6 items-center justify-center ${active ? 'text-primary' : 'text-gray-500'}`}>{icon}</span>
      <span className="text-[11px] leading-3 mt-1 font-medium">{label}</span>
    </Link>
  )
}

export default function MobileBottomNav(){
  const router = useRouter()
  const path = router.pathname || ''
  const isMembers = path.startsWith('/members')
  const isDonations = path.startsWith('/donations')
  const isDocuments = path.startsWith('/documents')
  const isContact = path.startsWith('/contact')
  const isHomeStories = path === '/' || path.startsWith('/stories')

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40">
      <div className="mx-auto max-w-6xl px-3 pb-[env(safe-area-inset-bottom)]">
        <div className="rounded-t-2xl bg-white ring-1 ring-gray-200 shadow-[0_-4px_18px_rgba(0,0,0,0.08)]">
          <div className="flex items-center">
            <NavItem
              href="/donations"
              label="Donate"
              active={isDonations}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6"><path d="M12 21.5c-4.694-3.62-7.388-6.403-8.25-8.358C2.246 11.545 2 10.86 2 10a5 5 0 0 1 9.055-2.96L12 8.118l.945-1.078A5 5 0 0 1 22 10c0 .86-.246 1.545-1.75 3.142-.862 1.955-3.556 4.738-8.25 8.358z"/></svg>
              }
            />
            <NavItem
              href="/members"
              label="Members"
              active={isMembers}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6"><path d="M7.5 7a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3 20.25a7.5 7.5 0 1 1 18 0V21H3v-.75z"/></svg>
              }
            />
            <NavItem
              href="/documents"
              label="Docs"
              active={isDocuments}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6"><path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625Z"/><path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z"/></svg>
              }
            />
            <NavItem
              href="/#stories"
              label="Stories"
              active={isHomeStories}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6"><path d="M12 4.5c-1.657 0-3 1.343-3 3v4.086a1.5 1.5 0 0 0 .44 1.06l2.12 2.121 2.121-2.12A1.5 1.5 0 0 0 15 11.586V7.5c0-1.657-1.343-3-3-3Z"/><path d="M6 7.5A6 6 0 0 1 18 7.5v4.086a3 3 0 0 1-.879 2.121l-3.94 3.94a1.5 1.5 0 0 1-2.122 0l-3.94-3.94A3 3 0 0 1 6 11.586V7.5Z"/></svg>
              }
            />
          </div>
        </div>
      </div>
    </nav>
  )
}
