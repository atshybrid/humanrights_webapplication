import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'

const PLAY_URL = process.env.NEXT_PUBLIC_KHABARX_PLAY_URL || 'https://play.google.com/store/search?q=Khabarx&c=apps'
const APK_URL = process.env.NEXT_PUBLIC_APK_URL || ''

export default function MembershipSuccess(){
  const [data, setData] = useState(null)
  useEffect(() => {
    try{
      const raw = sessionStorage.getItem('hrci_join_success')
      if (raw){ setData(JSON.parse(raw)) }
    }catch(e){}
  }, [])

  const orderId = data?.orderId
  const level = data?.level
  const seat = data?.confirm?.seatDetails
  const cellName = seat?.cell?.name || data?.cell
  const designation = seat?.designation?.name || data?.designationCode
  const status = data?.confirm?.status || data?.confirm?.data?.status || 'PAID'

  return (
    <>
      <Head>
        <title>Membership confirmed — HRCI</title>
      </Head>
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="rounded-2xl overflow-hidden shadow-sm ring-1 ring-gray-200 bg-gradient-to-br from-white to-gray-50">
          <div className="p-6 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700 ring-1 ring-green-200">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-2.59a.75.75 0 10-1.22-.9l-3.236 4.383-1.39-1.39a.75.75 0 10-1.06 1.06l2 2a.75.75 0 001.14-.094l3.766-5.06z" clipRule="evenodd"/></svg>
                Membership payment successful
              </div>
              <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold text-gray-900">Welcome to HRCI</h1>
              <p className="mt-2 text-gray-700">Your seat is reserved. Complete your setup in the Khabarx mobile app to access all features.</p>

              <div className="mt-4 grid grid-cols-2 gap-y-1 text-sm text-gray-800">
                <span className="text-gray-500">Status</span><span className="font-semibold">{status}</span>
                <span className="text-gray-500">Order ID</span><span className="font-mono">{orderId || '—'}</span>
                {designation ? (<><span className="text-gray-500">Designation</span><span className="font-semibold">{designation}</span></>) : null}
                {cellName ? (<><span className="text-gray-500">Cell</span><span className="font-semibold">{cellName}</span></>) : null}
                {level ? (<><span className="text-gray-500">Level</span><span className="font-semibold">{level}</span></>) : null}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <a href={PLAY_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-secondary">
                  Get the app on Play Store
                </a>
                {APK_URL ? (
                  <a href={APK_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50">
                    Download APK
                  </a>
                ) : null}
                <Link href="/members" className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50">
                  Check other seats
                </Link>
              </div>
            </div>
            <div className="relative h-64 sm:h-80 md:h-full bg-white">
              <div className="absolute inset-0 grid place-items-center p-6">
                <div className="relative w-full max-w-xs">
                  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 to-secondary/10 blur-2xl rounded-3xl" />
                  <img src="/images/app-promo.svg" alt="Khabarx App" className="w-full h-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-10">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">What’s next?</h2>
            <ul className="mt-3 list-disc pl-5 text-sm text-gray-700 space-y-1">
              <li>Install the Khabarx mobile app and log in with your mobile number. {APK_URL ? 'You can also download the APK directly.' : ''}</li>
              <li>Complete your registration if prompted to activate your membership.</li>
              <li>Explore other roles or levels anytime and check seat availability.</li>
            </ul>
            <div className="mt-4">
              <Link href="/members" className="inline-flex items-center rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary">Go to Members directory</Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
