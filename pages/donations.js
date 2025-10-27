import Head from 'next/head'
import Script from 'next/script'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { getDonationEvents, getOrgSettings, createDonationOrder, confirmDonation } from '../lib/api'

export default function DonationsPage(){
  const router = useRouter()
  const [events, setEvents] = useState([])
  const [eventsLoading, setEventsLoading] = useState(true)
  const [org, setOrg] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [receipt, setReceipt] = useState(null)
  const [lastOrder, setLastOrder] = useState(null) // keep identifiers for UI fallback
  const [confirmDebug, setConfirmDebug] = useState(null)

  const [form, setForm] = useState({
    mode: 'direct', // 'direct' | 'event'
    eventId: '',
    amount: '',
    donorName: '',
    donorAddress: '',
    donorMobile: '',
    donorEmail: '',
    donorPan: '',
  })

  useEffect(() => {
    let alive = true
    setEventsLoading(true)
    getDonationEvents(20)
      .then((data)=>{ if(alive){ setEvents(data || []) } })
      .catch(()=>{})
      .finally(()=>{ if(alive){ setEventsLoading(false) } })
    getOrgSettings().then(setOrg).catch(()=>{})
    return ()=>{ alive = false }
  }, [])

  // prefill from URL query
  useEffect(() => {
    if (!router.isReady) return
    const q = router.query || {}
    if (q.mode === 'event') update('mode', 'event')
    if (q.eventId) update('eventId', String(q.eventId))
    if (q.amount) update('amount', String(q.amount))
  }, [router.isReady])

  const amountNum = useMemo(()=> Number(form.amount || 0), [form.amount])
  const needsKyc = amountNum > 10000
  const basePresets = [500, 1000, 2000, 10000]
  const selectedEvent = useMemo(() => events.find(e => String(e.id) === String(form.eventId)), [events, form.eventId])
  const presetAmounts = useMemo(() => {
    const arr = Array.isArray(selectedEvent?.presets)
      ? selectedEvent.presets.filter(n => typeof n === 'number' && n > 0)
      : []
    const merged = arr.length ? arr : basePresets
    // unique + sorted
    return Array.from(new Set(merged)).sort((a,b)=>a-b)
  }, [selectedEvent])

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setReceipt(null)
    if (!amountNum || amountNum < 1) {
      setError('Please enter a valid amount.')
      return
    }

    const isAnonymous = !needsKyc
    const payload = {
      eventId: form.mode === 'event' && form.eventId ? form.eventId : undefined,
      amount: amountNum,
      donorName: needsKyc ? form.donorName : undefined,
      donorAddress: needsKyc ? form.donorAddress : undefined,
      donorMobile: needsKyc ? form.donorMobile : undefined,
      donorEmail: needsKyc ? form.donorEmail : undefined,
      donorPan: needsKyc ? form.donorPan : undefined,
      isAnonymous,
      shareCode: undefined,
    }

    try {
      setLoading(true)
  const order = await createDonationOrder(payload)
  // Dev hint
  console.log('[donations] order response:', order)
      // Try to extract checkout key and order_id
      const orderData = order?.order || order?.data?.order || order
      const keyCandidates = [
        orderData?.providerKeyId, // prefer key sent by backend
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        org?.razorpayKeyId,
        org?.razorpay_key_id,
        org?.payment?.razorpay?.keyId,
      ].filter(Boolean)
      const key = keyCandidates[0]

      const orderId = orderData?.orderId || order?.orderId || order?.id || order?.data?.orderId
      const rzpOrderId =
        orderData?.providerOrderId ||
        order?.razorpay_order_id ||
        order?.providerRef ||
        order?.razorpay?.order_id ||
        order?.razorpayOrderId ||
        order?.data?.razorpay_order_id ||
        order?.data?.providerRef

      // Store for later display in receipt block
      setLastOrder({ orderId, rzpOrderId })

      if (!key || !rzpOrderId) {
        setError('Payment configuration missing. Backend must return providerKeyId and providerOrderId, or set NEXT_PUBLIC_RAZORPAY_KEY_ID.')
        setLoading(false)
        return
      }

      const options = {
        key,
        amount: Math.round(amountNum * 100),
        currency: 'INR',
        name: org?.orgName || 'Donation',
        description: form.mode === 'event' ? 'Event donation' : 'Direct donation',
        order_id: rzpOrderId,
        prefill: needsKyc ? {
          name: form.donorName,
          email: form.donorEmail,
          contact: form.donorMobile,
        } : {},
        theme: { color: '#FE0002' },
        handler: async function (response){
          try {
            const reqBody = {
              orderId: orderId || rzpOrderId,
              status: 'SUCCESS',
              provider: 'RAZORPAY',
              providerRef: response.razorpay_order_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }
            console.log('[donations] /donations/confirm request:', reqBody)
            const confirm = await confirmDonation(reqBody)
            console.log('[donations] /donations/confirm response:', confirm)
            setReceipt(confirm)
            setConfirmDebug({ request: reqBody, response: confirm })
            // Open receipt HTML if provided by backend (prefer nested verify.htmlUrl)
            const htmlUrl =
              confirm?.htmlUrl ||
              confirm?.data?.htmlUrl ||
              confirm?.receipt?.htmlUrl ||
              confirm?.receipt?.verify?.htmlUrl
            if (htmlUrl) {
              try { window.location.assign(htmlUrl) } catch (e) { /* noop */ }
            }
          } catch (err){
            console.error(err)
            setError('Payment confirmation failed. Please contact support with your payment ID.')
          } finally {
            setLoading(false)
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false)
          }
        }
      }

      if (typeof window !== 'undefined' && window.Razorpay){
        const rzp = new window.Razorpay(options)
        rzp.open()
      } else {
        setError('Payment SDK not loaded. Please refresh and try again.')
        setLoading(false)
      }
    } catch (err) {
      console.error(err)
      setError('Could not create order. Please try again later.')
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Donate — Human Rights Council</title>
        <meta name="description" content="Donate to support human rights work across India." />
      </Head>
      {/* Razorpay SDK */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      <section className="bg-gradient-to-r from-primary to-secondary text-white">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <h1 className="text-4xl font-extrabold tracking-tight">Make a Donation</h1>
          <p className="mt-3 text-white/90 max-w-2xl">Support legal aid, investigations, and community programs. Donate directly or towards a specific event.</p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <form onSubmit={handleSubmit} className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Donation type</label>
              <div className="mt-2 flex gap-3">
                <button type="button" onClick={()=>update('mode','direct')} className={`px-4 py-2 rounded-full text-sm font-semibold ${form.mode==='direct' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}>Direct</button>
                <button type="button" onClick={()=>update('mode','event')} className={`px-4 py-2 rounded-full text-sm font-semibold ${form.mode==='event' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}>Specific event</button>
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount (INR)</label>
              <input type="number" min="1" step="1" value={form.amount} onChange={(e)=>update('amount', e.target.value)} required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary/60 focus:border-secondary" placeholder="e.g., 500" />
              <p className="mt-1 text-xs text-gray-500">Above ₹10,000 requires name, mobile, and PAN.</p>
              {/* Quick amounts */}
              <div className="mt-3 flex flex-wrap gap-2">
                {presetAmounts.map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={()=>update('amount', String(v))}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border ${amountNum===v ? 'bg-secondary text-white border-secondary' : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'}`}
                  >
                    ₹{v.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Event cards when Specific event */}
          {form.mode==='event' && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700">Select an event</h3>
              {eventsLoading ? (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {[1,2,3].map(i => (
                    <div key={i} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm p-0">
                      <div className="animate-pulse">
                        <div className="h-32 w-full bg-gray-200" />
                        <div className="p-4">
                          <div className="h-5 w-2/3 bg-gray-200 rounded" />
                          <div className="mt-2 h-4 w-full bg-gray-200 rounded" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : events.length === 0 ? (
                <div className="mt-3 rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600">No events available right now.</div>
              ) : (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {events.map(ev => {
                    const selected = form.eventId === ev.id
                    return (
                      <button
                        key={ev.id}
                        type="button"
                        onClick={()=>update('eventId', ev.id)}
                        className={`text-left group overflow-hidden rounded-2xl border p-0 shadow-sm transition hover:shadow-md focus:outline-none ${selected ? 'border-secondary ring-2 ring-secondary/50' : 'border-gray-200'}`}
                        aria-pressed={selected}
                      >
                        <div className="relative h-32 w-full bg-gray-100">
                          {ev.coverImageUrl ? (
                            <img src={ev.coverImageUrl} alt={ev.title} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200" />
                          )}
                          <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${selected ? 'bg-secondary text-white' : 'bg-white/90 text-gray-900 ring-1 ring-gray-200'}`}>{selected ? 'Selected' : 'Event'}</span>
                        </div>
                        <div className="p-4">
                          <div className="font-semibold text-gray-900 line-clamp-1">{ev.title}</div>
                          {ev.description ? <p className="mt-1 text-sm text-gray-600 line-clamp-2">{ev.description}</p> : null}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
              {form.eventId ? (
                <p className="mt-2 text-xs text-gray-600">Selected event ID: <span className="font-mono">{String(form.eventId)}</span></p>
              ) : null}
            </div>
          )}

          {/* KYC fields if required */}
          {needsKyc && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input value={form.donorName} onChange={(e)=>update('donorName', e.target.value)} required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary/60 focus:border-secondary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mobile</label>
                <input value={form.donorMobile} onChange={(e)=>update('donorMobile', e.target.value)} required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary/60 focus:border-secondary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email (optional)</label>
                <input type="email" value={form.donorEmail} onChange={(e)=>update('donorEmail', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary/60 focus:border-secondary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">PAN</label>
                <input value={form.donorPan} onChange={(e)=>update('donorPan', e.target.value)} required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary/60 focus:border-secondary" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Address (optional)</label>
                <input value={form.donorAddress} onChange={(e)=>update('donorAddress', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary/60 focus:border-secondary" />
              </div>
            </div>
          )}

          {error ? (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>
          ) : null}

          <div className="mt-6 flex items-center justify-end gap-3">
            <button type="submit" disabled={loading} className="inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-secondary disabled:opacity-60">
              {loading ? 'Processing…' : 'Donate now'}
            </button>
          </div>
        </form>

        {/* Receipt */}
        {receipt && (
          <div className="mt-8 rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900">Payment Receipt</h2>
            {receipt.receiptHtml ? (
              <article className="prose mt-3 max-w-none" dangerouslySetInnerHTML={{ __html: receipt.receiptHtml }} />
            ) : (
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-y-1 text-sm">
                {(() => {
                  const pick = (...vals) => vals.find(v => !!v)
                  const status = pick(receipt.status, receipt.data?.status, 'SUCCESS')
                  const oid = pick(
                    receipt.orderId,
                    receipt.data?.orderId,
                    receipt.order?.orderId,
                    lastOrder?.orderId,
                  )
                  const rzpOrder = pick(
                    receipt.razorpay_order_id,
                    receipt.providerOrderId,
                    receipt.providerRef,
                    receipt.order?.providerOrderId,
                    receipt.data?.providerOrderId,
                    lastOrder?.rzpOrderId,
                  )
                  const paymentId = pick(
                    receipt.razorpay_payment_id,
                    receipt.data?.razorpay_payment_id,
                  )
                  const provider = pick(
                    receipt.provider,
                    receipt.data?.provider,
                    'RAZORPAY'
                  )
                  return (
                    <>
                      <div><span className="text-gray-500">Status:</span> <span className="font-medium text-gray-900">{status}</span></div>
                      <div><span className="text-gray-500">Order ID:</span> <span className="font-mono">{oid || '-'}</span></div>
                      <div><span className="text-gray-500">Provider:</span> <span className="font-medium text-gray-900">{provider}</span></div>
                      <div><span className="text-gray-500">Razorpay Order:</span> <span className="font-mono">{rzpOrder || '-'}</span></div>
                      <div><span className="text-gray-500">Payment ID:</span> <span className="font-mono">{paymentId || '-'}</span></div>
                    </>
                  )
                })()}
              </div>
            )}
            {(() => {
              const htmlUrl =
                receipt?.htmlUrl ||
                receipt?.data?.htmlUrl ||
                receipt?.receipt?.htmlUrl ||
                receipt?.receipt?.verify?.htmlUrl
              return htmlUrl ? (
                <a href={htmlUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary">View full receipt</a>
              ) : null
            })()}
            {confirmDebug && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-gray-700">Show /donations/confirm logs</summary>
                <pre className="mt-2 overflow-auto rounded bg-gray-50 p-3 text-xs text-gray-800">
{JSON.stringify(confirmDebug, null, 2)}
                </pre>
              </details>
            )}
          </div>
        )}
      </main>
    </>
  )
}
