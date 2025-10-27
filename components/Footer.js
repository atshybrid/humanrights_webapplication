export default function Footer(){
  return (
    <footer className="bg-gradient-to-r from-secondary to-primary text-white">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <strong className="text-white">Human Rights Council - India</strong>
          <div className="text-sm mt-2 text-white/90">© {new Date().getFullYear()} All rights reserved</div>
        </div>
        <nav className="mt-2 sm:mt-0 text-sm">
          <a className="block hover:underline" href="/privacy-policy">Privacy Policy</a>
          <a className="block hover:underline" href="/terms">Terms</a>
        </nav>
      </div>
    </footer>
  )
}
