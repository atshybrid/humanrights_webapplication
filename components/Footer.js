export default function Footer(){
  return (
    <footer className="bg-gradient-to-r from-secondary to-primary text-white">
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
        <div className="sm:col-span-1">
          <strong className="text-white">Human Rights Council - India</strong>
          <div className="text-sm mt-2 text-white/90">© {new Date().getFullYear()} All rights reserved</div>
        </div>
        <nav className="text-sm">
          <div className="font-semibold text-white mb-2">Site Links</div>
          <a className="block hover:underline" href="/">Home</a>
          <a className="block hover:underline" href="/documents">Documents</a>
          <a className="block hover:underline" href="/members">Members</a>
          <a className="block hover:underline" href="/donations">Donations</a>
          <a className="block hover:underline" href="/contact">Contact</a>
          <a className="block hover:underline" href="/privacy-policy">Privacy Policy</a>
          <a className="block hover:underline" href="/terms">Terms</a>
        </nav>
        <nav className="text-sm">
          <div className="font-semibold text-white mb-2">KhabarX Pages</div>
          <a className="block hover:underline" href="/khabarx/privacy-policy">Privacy Policy</a>
          <a className="block hover:underline" href="/khabarx/terms">Terms &amp; Conditions</a>
          <a className="block hover:underline" href="/khabarx/disclaimer">Disclaimer</a>
          <a className="block hover:underline" href="/khabarx/content">Content Guidelines</a>
          <a className="block hover:underline" href="/khabarx/refund">Refund Policy</a>
          <a className="block hover:underline" href="/khabarx/data-safety">Data Safety</a>
          <a className="block hover:underline" href="/khabarx/contact">Contact</a>
        </nav>
      </div>
    </footer>
  )
}
