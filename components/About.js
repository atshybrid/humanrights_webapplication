import { useEffect, useState } from 'react'
import { getOrgSettings } from '../lib/api'
import ImageWithFallback from './ImageWithFallback'

export default function About(){
  const [org, setOrg] = useState(null)
  useEffect(()=>{ getOrgSettings().then(setOrg).catch(()=>{}) },[])
  const orgName = org?.orgName || 'Human Rights Council - India'
  return (
    <section id="about" className="mt-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Content */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900">About {orgName}</h2>
          <div className="mt-2 h-1.5 w-16 bg-gradient-to-r from-primary to-secondary rounded-full" />
          <p className="mt-4 text-gray-600">
            We are a non-profit collective working to protect human rights, support victims, and empower
            communities across India. From urgent relief to long‑term legal support, we stand with people when
            it matters most.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              'Free legal guidance and case support for vulnerable families',
              'Awareness drives on rights, entitlements, and safety',
              'Rapid response for emergencies with dignity‑first aid',
            ].map((line, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-2.823a.75.75 0 10-1.22-.904l-3.236 4.367-1.39-1.39a.75.75 0 10-1.06 1.06l2.002 2.003a.75.75 0 001.133-.07l3.77-5.066z" clipRule="evenodd"/></svg>
                </span>
                <span className="text-gray-800">{line}</span>
              </li>
            ))}
          </ul>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="/donations" className="inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-secondary">Donate</a>
            <a href="/contact" className="inline-flex items-center rounded-full border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Contact</a>
            <a href={typeof window !== 'undefined' ? '/#documents' : '/#documents'} className="inline-flex items-center rounded-full border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Documents</a>
          </div>
        </div>

        {/* Image collage */}
        <div className="relative">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-3">
              <ImageWithFallback src="https://images.unsplash.com/photo-1509098681029-b45e9c845022?q=80&w=1200&auto=format&fit=crop" alt="Community support" className="h-40 w-full object-cover rounded-2xl ring-1 ring-gray-200 shadow-sm" />
              <ImageWithFallback src="https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?q=80&w=1200&auto=format&fit=crop" alt="Rights awareness" className="h-48 w-full object-cover rounded-2xl ring-1 ring-gray-200 shadow-sm" />
            </div>
            <div className="mt-6 space-y-3">
              <ImageWithFallback src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop" alt="Volunteers in action" className="h-48 w-full object-cover rounded-2xl ring-1 ring-gray-200 shadow-sm" />
              <ImageWithFallback src="https://images.unsplash.com/photo-1514826786317-59744fe2b1e5?q=80&w=1200&auto=format&fit=crop" alt="Legal support" className="h-40 w-full object-cover rounded-2xl ring-1 ring-gray-200 shadow-sm" />
            </div>
          </div>
          <div className="absolute -bottom-4 -left-4 hidden sm:block h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-secondary opacity-80 blur-xl" />
          <div className="absolute -top-4 -right-4 hidden sm:block h-20 w-20 rounded-2xl bg-gradient-to-br from-secondary to-primary opacity-80 blur-xl" />
        </div>
      </div>
    </section>
  )
}
