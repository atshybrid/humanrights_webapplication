import Head from 'next/head'
import Link from 'next/link'

export default function KhabarXPoliciesLayout({ title = 'KhabarX — Policies & Pages', children }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <div className="container">
        <header>
          <div className="logo">KhabarX</div>
          <div>
            <div style={{ fontWeight: 700 }}>Policies & Legal Pages</div>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>Owner: Srikanth Chennupati • News App</div>
          </div>
          <nav>
            <Link href="/khabarx/privacy-policy">Privacy Policy</Link>
            <Link href="/khabarx/terms">Terms & Conditions</Link>
            <Link href="/khabarx/disclaimer">Disclaimer</Link>
            <Link href="/khabarx/content">Content Guidelines</Link>
            <Link href="/khabarx/contact">Contact</Link>
            <Link href="/khabarx/refund">Refund Policy</Link>
            <Link href="/khabarx/data-safety">Data Safety</Link>
          </nav>
        </header>

        {children}

        <footer>
          <div className="footer-links" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 8 }}>
            <Link href="/khabarx/privacy-policy">Privacy Policy</Link>
            <Link href="/khabarx/terms">Terms & Conditions</Link>
            <Link href="/khabarx/disclaimer">Disclaimer</Link>
            <Link href="/khabarx/content">Content Guidelines</Link>
            <Link href="/khabarx/refund">Refund Policy</Link>
            <Link href="/khabarx/data-safety">Data Safety</Link>
            <Link href="/khabarx/contact">Contact</Link>
          </div>
          <div>
            Made for KhabarX • <a href="/khabarx/privacy-policy" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Edit & reuse freely</a>
          </div>
        </footer>
      </div>
      <style jsx global>{`
        :root{--bg:#0f172a;--card:#0b1220;--muted:#9aa5bf;--accent:#06b6d4;--glass:rgba(255,255,255,0.03)}
        *{box-sizing:border-box}
        body{font-family:Inter,system-ui,Segoe UI,Roboto,Helvetica,Arial;line-height:1.6;margin:0;background:linear-gradient(180deg,#071020 0%, #081827 100%);color:#e6eef8}
        .container{max-width:1000px;margin:28px auto;padding:20px}
        header{display:flex;align-items:center;gap:16px;margin-bottom:22px}
        .logo{background:linear-gradient(90deg,var(--accent),#8b5cf6);padding:10px 14px;border-radius:10px;font-weight:700}
        nav{margin-left:auto;display:flex;gap:14px;flex-wrap:wrap}
        nav a{color:var(--muted);text-decoration:none;font-size:14px}
        nav a:hover{color:#fff}
        .card{background:var(--card);border-radius:12px;padding:22px;margin-bottom:18px;box-shadow:0 6px 18px rgba(2,6,23,0.6);border:1px solid rgba(255,255,255,0.03)}
        h1,h2,h3{color:#fff;margin:0 0 10px}
        p{margin:8px 0;color:var(--muted)}
        .meta{font-size:13px;color:var(--muted);margin-bottom:12px}
        ul{margin:8px 0 12px 20px}
        table{width:100%;border-collapse:collapse;margin-top:8px}
        th,td{padding:8px;border-bottom:1px dashed rgba(255,255,255,0.03);text-align:left;color:var(--muted)}
        .actions{display:flex;gap:8px;margin-top:12px}
        .btn{background:var(--accent);color:#022;padding:8px 12px;border-radius:8px;text-decoration:none;font-weight:600}
        .secondary{background:transparent;color:var(--muted);border:1px solid rgba(255,255,255,0.03);padding:8px 12px;border-radius:8px}
        footer{margin-top:18px;text-align:center;color:var(--muted);font-size:13px}
        .toc{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:18px}
        .toc a{background:var(--glass);padding:8px 10px;border-radius:8px;color:var(--muted);text-decoration:none;font-size:13px}
        .toc a:hover{color:#fff}
        pre{white-space:pre-wrap;background:rgba(255,255,255,0.02);padding:10px;border-radius:8px;color:var(--muted)}
        @media (max-width:640px){.container{padding:12px}.logo{font-size:14px;padding:8px}}
      `}</style>
    </>
  )
}
