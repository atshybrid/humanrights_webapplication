export default function TrustBar(){
  const items = [
    { title: 'Secure payments', desc: 'Powered by Razorpay', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M3 6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v10.5A2.25 2.25 0 0118.75 19.5H5.25A2.25 2.25 0 013 17.25V6.75zm2.25-.75a.75.75 0 00-.75.75v1.5h15V6.75a.75.75 0 00-.75-.75H5.25zM4.5 9.75v7.5c0 .414.336.75.75.75h13.5a.75.75 0 00.75-.75v-7.5h-15z" clipRule="evenodd"/></svg>
    )},
    { title: 'Tax receipts', desc: 'Get payment receipts online', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M7.5 3.75A1.5 1.5 0 009 2.25h6a1.5 1.5 0 011.5 1.5v16.94a.75.75 0 01-1.196.6L12 18.045l-3.304 3.244a.75.75 0 01-1.196-.6V3.75z"/></svg>
    )},
    { title: 'Transparent', desc: 'Audits and documents published', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M2.25 12c0-1.243 2.77-6.75 9.75-6.75S21.75 10.757 21.75 12 18.98 18.75 12 18.75 2.25 13.243 2.25 12zM12 9a3 3 0 100 6 3 3 0 000-6z" clipRule="evenodd"/></svg>
    )},
    { title: 'Real impact', desc: 'Stories and donor wall', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M11.48 3.499a2.25 2.25 0 011.04 0l6.614 1.89a2.25 2.25 0 011.616 1.616l1.89 6.614a2.25 2.25 0 010 1.04l-1.89 6.614a2.25 2.25 0 01-1.616 1.616l-6.614 1.89a2.25 2.25 0 01-1.04 0l-6.614-1.89A2.25 2.25 0 013.25 21.373l-1.89-6.614a2.25 2.25 0 010-1.04l1.89-6.614A2.25 2.25 0 015.756 5.39l6.614-1.89zM12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5z" clipRule="evenodd"/></svg>
    )},
  ]
  return (
    <section aria-label="Trust and safety" className="border-y border-gray-200 bg-white/60 backdrop-blur">
      <div className="max-w-6xl mx-auto px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {items.map((it) => (
          <div key={it.title} className="flex items-center gap-2 text-sm">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white ring-1 ring-white/30 shadow-sm">
              {it.icon}
            </span>
            <div className="leading-tight">
              <div className="font-semibold text-gray-900">{it.title}</div>
              <div className="text-gray-600">{it.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
