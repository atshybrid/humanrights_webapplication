import Link from 'next/link'

export default function SectionHeader({ title, description, actionHref, actionLabel }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{title}</h2>
        <div className="mt-2 h-1.5 w-16 rounded-full bg-gradient-to-r from-primary to-secondary" />
        {description ? (
          <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">{description}</p>
        ) : null}
      </div>
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="inline-flex w-fit items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-secondary"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  )
}
