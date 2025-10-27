import { useEffect, useState } from 'react'
import { getOrgSettings } from '../lib/api'

export default function Hero(){
  const [org, setOrg] = useState(null)
  useEffect(()=>{
    getOrgSettings().then(setOrg).catch(()=>{})
  },[])
  const logo = org?.hrciLogoUrl || '/images/hero-placeholder.svg'
  const orgName = org?.orgName || 'Human Rights Council - India'
  return (
    <header className="bg-gradient-to-r from-primary to-secondary text-white">
      <div className="max-w-6xl mx-auto px-6 py-24 flex flex-col sm:flex-row items-center gap-10">
        <div className="flex-1">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight drop-shadow-sm">{orgName}</h1>
          <p className="mt-4 text-lg/7 text-white/90 max-w-2xl">Protecting rights, supporting victims, building a fairer future for every citizen.</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#donations" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-base font-semibold text-secondary shadow-sm ring-1 ring-white/20 transition hover:shadow-md hover:bg-gray-100">
              Donate
            </a>
            <a href="/contact" className="inline-flex items-center gap-2 rounded-full border border-white/80 px-6 py-3 text-base font-medium text-white/95 backdrop-blur-sm transition hover:bg-white/10">
              Contact us
            </a>
          </div>
        </div>
        <div className="w-full sm:w-1/2 flex justify-center">
          <img src={logo} alt="Org logo" className="w-52 h-52 sm:w-60 sm:h-60 object-contain rounded-2xl bg-white/15 p-5 shadow-lg ring-1 ring-white/20" />
        </div>
      </div>
    </header>
  )
}
