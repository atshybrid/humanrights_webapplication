export default function Contact(){
  return (
    <section id="contact" className="mt-16">
      <h2 className="text-3xl font-bold text-gray-900">Contact</h2>
      <div className="mt-2 h-1.5 w-16 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
      <p className="mt-4 text-gray-600">Reach us for donations, legal help, or partnerships.</p>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <p><strong>Address</strong><br/>Human Rights Council - India<br/>Hyderabad, Telangana</p>
          <p className="mt-2"><strong>Email</strong><br/>contact@hrc-india.org</p>
          <p className="mt-2"><strong>Phone</strong><br/>+91 90000 00000</p>
        </div>
        <form className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm">
          <label className="block">
            Name
            <input className="w-full mt-1 p-2 rounded border border-gray-300 focus:border-secondary focus:ring-2 focus:ring-secondary/60 outline-none transition" />
          </label>
          <label className="block mt-3">
            Message
            <textarea className="w-full mt-1 p-2 rounded border border-gray-300 focus:border-secondary focus:ring-2 focus:ring-secondary/60 outline-none transition" rows="4" />
          </label>
          <button className="mt-4 inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-secondary">Send</button>
        </form>
      </div>
    </section>
  )
}
