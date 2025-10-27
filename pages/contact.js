import Head from 'next/head'

export default function ContactPage() {
  const email = 'support@humanrightscouncilforindia.org'
  const offices = [
    {
      title: 'Head Office',
      address: 'NEW DELHI',
    },
    {
      title: 'Regional Office',
      address:
        '7-19, CANAL CENTER, KARAMCHEDU ( POST), (M.D), BAPATLA (DIST), A.P. PIN CODE - 523168',
    },
    {
      title: 'Administration Office',
      address:
        '309, KKC COMPLEX, NEAR LIC BUILDING, CHIRALA, BAPATLA DISTRICT, ANDHRA PRADESH',
    },
  ]

  return (
    <>
      <Head>
        <title>Contact Us — Human Rights Council</title>
        <meta name="description" content="Contact Human Rights Council — email and office addresses." />
      </Head>

      {/* Top banner */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <h1 className="text-4xl font-extrabold tracking-tight">Contact Us</h1>
          <p className="mt-3 text-white/90 max-w-2xl">
            We’re here to help with donations, legal support, partnerships, and press.
          </p>
        </div>
      </section>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Contact methods */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Email card */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path d="M1.5 8.67v8.58A3.75 3.75 0 0 0 5.25 21h13.5A3.75 3.75 0 0 0 22.5 17.25V8.67l-8.422 5.053a3.75 3.75 0 0 1-3.656 0L1.5 8.67Z" />
                    <path d="M22.5 6.75v-.003A3.75 3.75 0 0 0 18.75 3h-13.5A3.75 3.75 0 0 0 1.5 6.747V6.75l9.206 5.523a2.25 2.25 0 0 0 2.088 0L22.5 6.75Z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Email</h2>
                  <a href={`mailto:${email}`} className="text-secondary hover:underline break-all">
                    {email}
                  </a>
                </div>
              </div>
            </div>

            {/* Offices */}
            <div className="mt-6 space-y-4">
              {offices.map((o) => (
                <div key={o.title} className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 p-6">
                  <h3 className="text-base font-semibold text-gray-900">{o.title}</h3>
                  <p className="mt-1 text-gray-700 leading-6">{o.address}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900">Send us a message</h2>
              <p className="mt-1 text-gray-600 text-sm">We’ll get back to you as soon as possible.</p>

              <form
                className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4"
                onSubmit={(e) => {
                  e.preventDefault()
                  const form = e.currentTarget
                  const name = form.name.value
                  const emailInput = form.email.value
                  const subject = form.subject.value
                  const message = form.message.value
                  const mailto = `mailto:${email}?subject=${encodeURIComponent(
                    `[Website] ${subject}`
                  )}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${emailInput}\n\n${message}`)}`
                  window.location.href = mailto
                }}
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700">Your name</label>
                  <input
                    name="name"
                    required
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary/60 focus:border-secondary"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary/60 focus:border-secondary"
                    placeholder="you@example.com"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Subject</label>
                  <input
                    name="subject"
                    required
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary/60 focus:border-secondary"
                    placeholder="How can we help?"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Message</label>
                  <textarea
                    name="message"
                    rows={6}
                    required
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary/60 focus:border-secondary"
                    placeholder="Write your message..."
                  />
                </div>
                <div className="md:col-span-2 flex items-center justify-between">
                  <p className="text-xs text-gray-500">By submitting, you agree we may contact you regarding your request.</p>
                  <button
                    type="submit"
                    className="inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-secondary"
                  >
                    Send message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
