import SectionHeader from './SectionHeader'

export default function Contact() {
  return (
    <section id="contact" className="scroll-mt-20">
      <SectionHeader
        title="Contact"
        description="Reach us for donations, legal help, or partnerships."
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-sm leading-relaxed text-gray-800 sm:text-base">
            <strong className="text-gray-900">Head Office</strong><br />
            HUMAN RIGHTS COUNCIL FOR INDIA (HRCI)<br />
            FLAT NO- 502 H NO- 831-, GD COLONY, MAYUR VIHAR PH- 3 DELHI- 110096
          </p>
          <p className="mt-4 text-sm sm:text-base">
            <strong className="text-gray-900">Email</strong><br />
            <a href="mailto:support@humanrightscouncilforindia.org" className="text-secondary hover:underline">
              support@humanrightscouncilforindia.org
            </a>
          </p>
          <p className="mt-4 text-sm sm:text-base">
            <strong className="text-gray-900">Phone</strong><br />
            <a href="tel:+918906189999" className="text-secondary hover:underline">+91 8906189999</a>
          </p>
        </div>
        <form className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <label className="block text-sm font-medium text-gray-700">
            Name
            <input className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/60" />
          </label>
          <label className="mt-4 block text-sm font-medium text-gray-700">
            Message
            <textarea className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/60" rows="4" />
          </label>
          <button type="button" className="mt-4 inline-flex items-center rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-secondary">
            Send
          </button>
        </form>
      </div>
    </section>
  )
}
