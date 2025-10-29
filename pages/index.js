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
import SEOHead, { generateStructuredData } from '../components/SEOHead'

export default function Home(){
  return (
    <>
      <SEOHead 
        title="Home"
        description="HRCI works to protect and promote human rights across India through legal aid, investigations, and community programs. Join our mission for justice and equality."
        canonical="/"
        ogImage="/images/og-home.png"
      >
        {generateStructuredData('Organization', {
          name: 'Human Rights Council for India (HRCI)',
          url: process.env.NEXT_PUBLIC_SITE_URL || 'https://hrci.org',
          logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://hrci.org'}/images/logo.png`,
          description: 'HRCI works to protect and promote human rights across India through legal aid, investigations, and community programs.',
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'IN'
          },
          sameAs: [
            // Add your social media URLs here
            // 'https://facebook.com/hrci',
            // 'https://twitter.com/hrci',
          ]
        })}
      </SEOHead>
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
