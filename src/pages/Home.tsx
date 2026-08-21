import Navbar from '@/components/Navbar'
import HeroSection from '@/sections/HeroSection'
import LandLogisticsSection from '@/sections/LandLogisticsSection'
import CapabilitiesSection from '@/sections/CapabilitiesSection'
import StatsSection from '@/sections/StatsSection'
import ShowcaseSection from '@/sections/ShowcaseSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-white selection:bg-cyan-500 selection:text-slate-950">
      <Navbar />
      <HeroSection />
      <LandLogisticsSection />
      <CapabilitiesSection />
      <StatsSection />
      <ShowcaseSection />
      <Footer />
    </div>
  )
}
