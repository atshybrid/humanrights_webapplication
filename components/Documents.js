export default function Documents(){
  return (
    <section id="documents" className="mt-16">
      <h2 className="text-3xl font-bold text-gray-900">Trusted Documents</h2>
      <div className="mt-2 h-1.5 w-16 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
      <p className="mt-4 text-gray-600">Our registrations, audit reports, and compliance documents.</p>
      <ul className="mt-6 space-y-2 text-sm">
        <li><a className="text-secondary hover:underline" href="#">Registration certificate (PRGI / RNI placeholder)</a></li>
        <li><a className="text-secondary hover:underline" href="#">Audit report 2024 (PDF)</a></li>
        <li><a className="text-secondary hover:underline" href="#">Policy &amp; Governance charter</a></li>
      </ul>
    </section>
  )
}
