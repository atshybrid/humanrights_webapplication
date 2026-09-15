import Link from 'next/link'
import SectionHeader from './SectionHeader'

export default function Documents() {
  return (
    <section id="documents" className="scroll-mt-20">
      <SectionHeader
        title="Trusted Documents"
        description="Our registrations, audit reports, and compliance documents."
        actionHref="/documents"
        actionLabel="Browse all"
      />
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: 'Registration certificate', href: '/documents' },
          { label: 'Audit report 2024 (PDF)', href: '/documents' },
          { label: 'Policy & Governance charter', href: '/documents' },
        ].map((doc) => (
          <Link
            key={doc.label}
            href={doc.href}
            className="rounded-xl border border-gray-200 bg-white px-4 py-4 text-sm font-medium text-gray-800 shadow-sm transition hover:border-secondary/30 hover:text-secondary"
          >
            {doc.label}
          </Link>
        ))}
      </div>
    </section>
  )
}
