import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getOrgSettings } from '../lib/api'
import ImageWithFallback from './ImageWithFallback'
import SectionHeader from './SectionHeader'

export default function About() {
  const [org, setOrg] = useState(null)
  useEffect(() => { getOrgSettings().then(setOrg).catch(() => {}) }, [])
  const orgName = org?.orgName || 'Human Rights Council - India'

  return (
    <section id="about" className="scroll-mt-20">
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          <SectionHeader
            title={`About ${orgName}`}
            description="We are a non-profit collective working to protect human rights, support victims, and empower communities across India. From urgent relief to long-term legal support, we stand with people when it matters most."
          />
          <ul className="space-y-3">
            {[
              'Free legal guidance and case support for vulnerable families',
              'Awareness drives on rights, entitlements, and safety',
              'Rapid response for emergencies with dignity-first aid',
            ].map((line) => (
              <li key={line} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-2.823a.75.75 0 10-1.22-.904l-3.236 4.367-1.39-1.39a.75.75 0 10-1.06 1.06l2.002 2.003a.75.75 0 001.133-.07l3.77-5.066z" clipRule="evenodd" />
                  </svg>
                </span>
                <span className="text-sm text-gray-800 sm:text-base">{line}</span>
              </li>
            ))}
          </ul>
          <div className="mt-7 flex flex-wrap gap-2 sm:gap-3">
            <Link href="/donations" className="inline-flex items-center rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-secondary sm:px-5">
              Donate
            </Link>
            <Link href="/contact" className="inline-flex items-center rounded-full border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:px-5">
              Contact
            </Link>
            <Link href="/documents" className="inline-flex items-center rounded-full border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:px-5">
              Documents
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div className="space-y-2 sm:space-y-3">
              <ImageWithFallback src="https://pub-b13a983e33694dbd96cd42158ce2147b.r2.dev/viteam.png" alt="Community support" className="h-36 w-full animate-fade-in-up rounded-2xl object-cover shadow-sm ring-1 ring-gray-200 will-change-transform transition-transform duration-300 hover:scale-[1.01] sm:h-40" />
              <ImageWithFallback src="https://pub-b13a983e33694dbd96cd42158ce2147b.r2.dev/oldagehome.png" alt="Rights awareness" className="h-40 w-full animate-fade-in-up rounded-2xl object-cover shadow-sm ring-1 ring-gray-200 will-change-transform transition-transform duration-300 hover:scale-[1.01] sm:h-48" style={{ animationDelay: '120ms' }} />
            </div>
            <div className="mt-4 space-y-2 sm:mt-6 sm:space-y-3">
              <ImageWithFallback src="https://pub-b13a983e33694dbd96cd42158ce2147b.r2.dev/women_empower.png" alt="Volunteers in action" className="h-40 w-full animate-fade-in-up rounded-2xl object-cover shadow-sm ring-1 ring-gray-200 will-change-transform transition-transform duration-300 hover:scale-[1.01] sm:h-48" style={{ animationDelay: '240ms' }} />
              <ImageWithFallback src="https://pub-b13a983e33694dbd96cd42158ce2147b.r2.dev/rural_developement.png" alt="Legal support" className="h-36 w-full animate-fade-in-up rounded-2xl object-cover shadow-sm ring-1 ring-gray-200 will-change-transform transition-transform duration-300 hover:scale-[1.01] sm:h-40" style={{ animationDelay: '360ms' }} />
            </div>
          </div>
          <div className="absolute -bottom-4 -left-4 hidden h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-secondary opacity-80 blur-xl sm:block" />
          <div className="absolute -top-4 -right-4 hidden h-20 w-20 rounded-2xl bg-gradient-to-br from-secondary to-primary opacity-80 blur-xl sm:block" />
        </div>
      </div>
    </section>
  )
}
