import Head from 'next/head'
import HeroSlider from '../components/HeroSlider'
import About from '../components/About'
import Contact from '../components/Contact'
import Donations from '../components/Donations'
import SuccessStories from '../components/SuccessStories'
import DonorWall from '../components/DonorWall'
import Documents from '../components/Documents'
import Footer from '../components/Footer'
import TrustBar from '../components/TrustBar'

export default function Home(){
  return (
    <>
      <Head>
        <title>Human Rights Council - India</title>
        <meta name="description" content="Human Rights Council - India. Protecting rights, empowering citizens." />
      </Head>
      <div className="min-h-screen flex flex-col">
  <HeroSlider />
        <TrustBar />
        <main className="flex-grow">
          <section className="max-w-6xl mx-auto p-6">
            <About />
            <Donations />
            <SuccessStories />
            <DonorWall />
            <Documents />
            <Contact />
          </section>
        </main>
        <Footer />
      </div>
    </>
  )
}
