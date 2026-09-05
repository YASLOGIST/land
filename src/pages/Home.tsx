import { lazy, Suspense } from 'react'
import Navbar from '@/components/Navbar'
import HeroSection from '@/sections/HeroSection'
import VisionTransitionSection from '@/sections/VisionTransitionSection'
import LandLogisticsSection from '@/sections/LandLogisticsSection'
import CrossModalHandoff from '@/components/CrossModalHandoff'
import Footer from '@/components/Footer'

// Dynamic lazy imports for heavy GIS simulation components and secondary modules
const CapabilitiesSection = lazy(() => import('@/sections/CapabilitiesSection'))
const StatsSection = lazy(() => import('@/sections/StatsSection'))
const DashboardOverviewSection = lazy(() => import('@/sections/DashboardOverviewSection'))
const CorridorDispatchSection = lazy(() => import('@/sections/CorridorDispatchSection'))
const DisruptionCommandSection = lazy(() => import('@/sections/DisruptionCommandSection'))
const ShowcaseSection = lazy(() => import('@/sections/ShowcaseSection'))

function SectionLoadingFallback() {
  return (
    <div className="w-full py-20 flex items-center justify-center bg-slate-100/60 dark:bg-slate-950/60">
      <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-gold-500/20 text-gold-700 dark:text-gold-400 font-mono text-xs shadow-sm">
        <span className="w-2 h-2 rounded-full bg-gold-500 animate-ping" />
        <span>INITIALIZING DIGITAL TWIN…</span>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <div className="relative min-h-screen bg-white dark:bg-slate-950 text-slate-950 dark:text-white selection:bg-gold-500 selection:text-slate-950 transition-colors duration-300">
      <Navbar />
      <HeroSection />
      <VisionTransitionSection />
      <LandLogisticsSection />
      <Suspense fallback={<SectionLoadingFallback />}>
        <CapabilitiesSection />
        <StatsSection />
        <DashboardOverviewSection />
        <CorridorDispatchSection />
        <DisruptionCommandSection />
        <ShowcaseSection />
      </Suspense>
      <CrossModalHandoff />
      <Footer />
    </div>
  )
}


