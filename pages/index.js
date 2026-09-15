import HeroSlider from '../components/HeroSlider'
import About from '../components/About'
import Contact from '../components/Contact'
import Donations from '../components/Donations'
import SuccessStories from '../components/SuccessStories'
import DonorWall from '../components/DonorWall'
import Documents from '../components/Documents'
import Gallery from '../components/Gallery'
import Footer from '../components/Footer'
import TrustBar from '../components/TrustBar'
import LandingSection from '../components/LandingSection'
import SEOHead, { generateStructuredData } from '../components/SEOHead'
import { fetchGallery } from '../lib/gallery'
import { getDonationEvents, getStories, getTopDonors } from '../lib/api'

function hasLandingDonations(events = []) {
  return events.some((ev) => !/\bgeneral donation\b/i.test(String(ev?.title || '')))
}

export async function getStaticProps() {
  const empty = {
    stories: [],
    donors: [],
    donationEvents: [],
    galleryItems: [],
  }

  try {
    const [stories, donors, donationEvents, gallery] = await Promise.all([
      getStories(8).catch(() => []),
      getTopDonors(20).catch(() => []),
      getDonationEvents(6).catch(() => []),
      fetchGallery({ mediaType: 'IMAGE', limit: 8 }).catch(() => ({ data: [] })),
    ])

    return {
      props: {
        stories,
        donors,
        donationEvents,
        galleryItems: gallery?.data || [],
      },
      revalidate: 60,
    }
  } catch {
    return { props: empty, revalidate: 60 }
  }
}

export default function Home({
  stories = [],
  donors = [],
  donationEvents = [],
  galleryItems = [],
}) {
  const showDonations = hasLandingDonations(donationEvents)
  const showStories = stories.length > 0
  const showDonors = donors.length > 0
  const showGallery = galleryItems.length > 0

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
            addressCountry: 'IN',
          },
          sameAs: [],
        })}
      </SEOHead>
      <div className="flex min-h-screen flex-col">
        <HeroSlider />
        <TrustBar />
        <main className="flex-grow">
          <LandingSection variant="default">
            <About />
          </LandingSection>

          {showDonations ? (
            <LandingSection variant="alt">
              <Donations events={donationEvents} />
            </LandingSection>
          ) : null}

          {showStories ? (
            <LandingSection variant="default">
              <SuccessStories stories={stories} />
            </LandingSection>
          ) : null}

          {showDonors ? (
            <LandingSection variant="alt">
              <DonorWall donors={donors} />
            </LandingSection>
          ) : null}

          <LandingSection variant="default">
            <Documents />
          </LandingSection>

          {showGallery ? (
            <LandingSection variant="alt">
              <Gallery items={galleryItems} />
            </LandingSection>
          ) : null}

          <LandingSection variant="default">
            <Contact />
          </LandingSection>
        </main>
        <Footer />
      </div>
    </>
  )
}
