import '../styles/globals.css'
import { Inter } from 'next/font/google'
import Navbar from '../components/Navbar'
import dynamic from 'next/dynamic'

const MobileBottomNav = dynamic(() => import('../components/MobileBottomNav'), { ssr: false })

const inter = Inter({ subsets: ['latin'] })

export default function App({ Component, pageProps }) {
  return (
    <div className={inter.className}>
      <Navbar />
      <Component {...pageProps} />
      {/* Spacer so content doesn't hide behind the fixed mobile nav */}
      <div className="h-16 md:hidden" />
      <MobileBottomNav />
    </div>
  )
}
