export default function LandingSection({ variant = 'default', children }) {
  const surface =
    variant === 'alt'
      ? 'bg-white border-y border-gray-200/80 shadow-sm'
      : ''

  return (
    <div className={surface}>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">{children}</div>
    </div>
  )
}
