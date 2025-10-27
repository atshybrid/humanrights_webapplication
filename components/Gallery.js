export default function Gallery(){
  return (
    <section id="gallery" className="mt-16">
      <h2 className="text-3xl font-bold text-gray-900">Gallery</h2>
      <div className="mt-2 h-1.5 w-16 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
      <p className="mt-4 text-gray-600">Photos from events and community programs.</p>
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <img src="/images/gallery1.svg" className="h-32 w-full object-cover rounded-xl shadow-sm" />
        <img src="/images/gallery2.svg" className="h-32 w-full object-cover rounded-xl shadow-sm" />
        <img src="/images/gallery3.svg" className="h-32 w-full object-cover rounded-xl shadow-sm" />
        <img src="/images/gallery4.svg" className="h-32 w-full object-cover rounded-xl shadow-sm" />
      </div>
    </section>
  )
}
