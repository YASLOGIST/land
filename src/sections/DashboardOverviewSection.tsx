'use client'

import { useState, useMemo } from 'react'
import { useTheme } from 'next-themes'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { useLanguage } from '@/hooks/use-language'
import type { Language } from '@/types/land-logistics'
import { t } from '@/lib/i18n'
import { Activity, Cpu, Sliders, RefreshCw } from 'lucide-react'
import ModelBadge from '@/components/ModelBadge'

// Styled Custom Tooltip for Recharts
interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ value: number | string; name?: string }>
  label?: string
  language: Language
}

function ChartTooltip({ active, payload, label, language }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null

  const val = payload[0].value
  const labelText =
    language === 'ar'
      ? 'حجم التدفق'
      : language === 'zh'
      ? '吞吐量'
      : language === 'tr'
      ? 'Taşıma Hacmi'
      : language === 'fr'
      ? 'Débit de Fret'
      : 'Throughput'

  return (
    <div className="rounded-xl border border-gold-500/30 bg-slate-950/95 p-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md">
      <p className="font-mono text-xs text-slate-400 mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-gold-400 shadow-[0_0_8px_rgba(232,179,23,0.8)]" />
        <span className="text-xs font-bold text-white">
          {labelText}: <span className="font-mono text-gold-300">{val.toLocaleString()} Tons/hr</span>
        </span>
      </div>
    </div>
  )
}

export default function DashboardOverviewSection() {
  const { resolvedTheme } = useTheme()
  const { language, direction } = useLanguage()

  const mode = resolvedTheme === 'light' ? 'light' : 'dark'

  // Subtitle translations & static copy
  const ui = {
    kicker: t('ANALYTICS & CONTROL ROOM', 'لوحة التحكم والتحليل الفوري'),
    title: t('Autonomous Command Overview', 'نظرة عامة على لوحة القيادة المستقلة'),
    subtitle: t(
      'Real-time simulation throughput analytics and automated network health telemetry.',
      'تحليلات تدفق البيانات الفورية لعمليات المحاكاة وصحة الشبكة اللوجستية الذاتية.'
    ),
    throughputTab: t('Throughput Rate', 'معدل الإنتاجية التدفقية'),
    fleetTab: t('Active Fleet Units', 'مركبات الأسطول النشطة'),
    efficiencyTitle: t('Network Efficiency', 'كفاءة الشبكة اللوجستية'),
    efficiencyDesc: t('Real-time node sync and path recalculation stability rate.', 'معدل استقرار مزامنة عقد توجيه المسارات بالذكاء الاصطناعي.'),
    optimizeBtn: t('Calibrate Mesh Network', 'معايرة الشبكة الذاتية'),
    optimizingText: t('Recalibrating network paths...', 'جاري إعادة معايرة مسارات الشبكة...'),
    adjustedLoad: t('Simulated Grid Load', 'محاكاة حمل الشبكة البرية'),
    highLoadText: t('HEAVY TRAFFIC DETECTED', 'تم رصد حركة مرور كثيفة'),
    optLoadText: t('OPTIMAL LOAD FREIGHT', 'حالة الشحن مثالية ومستقرة'),
    metricThroughput: t('Aggregated Throughput', 'إجمالي التدفق المتراكم'),
    metricLatency: t('Mesh Sync Latency', 'زمن استجابة المزامنة'),
    metricRouting: t('Optimal Routes', 'المسارات البديلة المثلى'),
    tonsHr: t('Tons/hr', 'طن / ساعة'),
    nodesText: t('Nodes Synchronized', 'عقدة نشطة تمت مزامنتها')
  }

  // Interactive load states
  const [gridLoad, setGridLoad] = useState<number>(68) // Slider percentage
  const [activeMetric, setActiveMetric] = useState<'throughput' | 'fleet'>('throughput')
  const [isCalibrating, setIsCalibrating] = useState<boolean>(false)
  const [calibrationCounter, setCalibrationCounter] = useState<number>(0)

  // Calibrate button handler
  const handleCalibrate = () => {
    setIsCalibrating(true)
    setTimeout(() => {
      setIsCalibrating(false)
      setCalibrationCounter((prev) => prev + 1)
      // Slightly improve grid load or reset to optimal
      setGridLoad(42)
    }, 1800)
  }

  // Memoized efficiency value linked mathematically to simulated grid load
  const networkEfficiency = useMemo(() => {
    // Peak efficiency is around 40-50% load. High load or very low load degrades efficiency.
    const dev = Math.abs(gridLoad - 45)
    const rawEff = 99.4 - dev * 0.32 - (calibrationCounter > 0 ? -1.5 : 0)
    return Math.max(72.5, Math.min(99.8, parseFloat(rawEff.toFixed(1))))
  }, [gridLoad, calibrationCounter])

  // Data for Logistics Throughput Line/Area Chart (24 hour timeline)
  // Scaled dynamically by the simulated gridLoad factor to simulate real-time sensor updates!
  const throughputData = useMemo(() => {
    const scaleFactor = gridLoad / 50
    const baseData = [
      { time: '00:00', throughput: 1420, fleet: 320 },
      { time: '03:00', throughput: 1150, fleet: 280 },
      { time: '06:00', throughput: 1850, fleet: 410 },
      { time: '09:00', throughput: 2940, fleet: 650 },
      { time: '12:00', throughput: 3120, fleet: 710 },
      { time: '15:00', throughput: 2750, fleet: 680 },
      { time: '18:00', throughput: 3410, fleet: 790 },
      { time: '21:00', throughput: 2280, fleet: 540 },
      { time: '24:00', throughput: 1560, fleet: 350 }
    ]

    return baseData.map((d) => ({
      ...d,
      throughput: Math.round(d.throughput * scaleFactor),
      fleet: Math.round(d.fleet * (scaleFactor * 0.95 + 0.05))
    }))
  }, [gridLoad])

  // Radial Bar / Pie data for circular gauge
  const gaugeData = useMemo(() => {
    return [
      { value: networkEfficiency },
      { value: 100 - networkEfficiency }
    ]
  }, [networkEfficiency])

  return (
    <section
      id="dashboard-overview"
      className={`relative py-28 overflow-hidden transition-colors duration-500 ${
        mode === 'dark'
          ? 'bg-slate-950 border-t border-white/[0.08]'
          : 'bg-slate-50 border-t border-slate-200'
      }`}
      dir={direction}
    >
      {/* Background Ambience */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_50%_40%,rgba(232,179,23,0.05),transparent)]"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-gold-400 font-extrabold tracking-widest text-[11px] sm:text-xs uppercase mb-3 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
            {ui.kicker[language]}
          </p>
          <h2
            className={`text-3xl sm:text-5xl font-black tracking-tight mb-4 ${
              mode === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            {ui.title[language]}
          </h2>
          <p
            className={`text-sm sm:text-base leading-relaxed ${
              mode === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            {ui.subtitle[language]}
          </p>

          {/* The throughput and fleet series plotted below are a generated
              24-hour profile, not a recorded one. */}
          <div className="flex justify-center mt-5">
            <ModelBadge />
          </div>
        </div>

        {/* Command Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* Main Throughput Trend Area Chart Card */}
          <div
            className={`lg:col-span-2 rounded-3xl p-6 sm:p-8 transition-all duration-300 flex flex-col justify-between ${
              mode === 'dark'
                ? 'bg-white/[0.025] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)]'
                : 'bg-white border border-slate-200/90 shadow-lg'
            }`}
          >
            <div>
              {/* Card Header & Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h3
                    className={`text-lg sm:text-xl font-bold tracking-tight ${
                      mode === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {activeMetric === 'throughput' ? ui.throughputTab[language] : ui.fleetTab[language]}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 font-mono uppercase">
                    YASLOGIST HIGHWAY NETWORK METRICS
                  </p>
                </div>

                {/* Filter Selector Buttons */}
                <div className="flex p-1 rounded-xl bg-slate-900/60 border border-slate-700/50 self-start sm:self-auto shrink-0">
                  <button
                    onClick={() => setActiveMetric('throughput')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                      activeMetric === 'throughput'
                        ? 'bg-gradient-to-r from-gold-500 to-amber-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {ui.throughputTab[language]}
                  </button>
                  <button
                    onClick={() => setActiveMetric('fleet')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                      activeMetric === 'fleet'
                        ? 'bg-gradient-to-r from-gold-500 to-amber-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {ui.fleetTab[language]}
                  </button>
                </div>
              </div>

              {/* Area Chart Stage */}
              <div className="h-[280px] sm:h-[320px] w-full" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={throughputData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#E8B317" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#E8B317" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke={mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}
                    />
                    <XAxis
                      dataKey="time"
                      tickLine={false}
                      axisLine={false}
                      stroke={mode === 'dark' ? '#64748b' : '#475569'}
                      style={{ fontSize: 10, fontFamily: 'monospace' }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      stroke={mode === 'dark' ? '#64748b' : '#475569'}
                      style={{ fontSize: 10, fontFamily: 'monospace' }}
                    />
                    <Tooltip
                      content={<ChartTooltip language={language} />}
                      cursor={{
                        stroke: '#E8B317',
                        strokeWidth: 1,
                        strokeDasharray: '3 3'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey={activeMetric}
                      stroke="#E8B317"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorMetric)"
                      dot={{
                        r: 3,
                        stroke: '#E8B317',
                        strokeWidth: 2,
                        fill: '#020617'
                      }}
                      activeDot={{
                        r: 6,
                        stroke: '#FBBF24',
                        strokeWidth: 2,
                        fill: '#FBBF24'
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Simulated Live Spark/Footer within the Card */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-6 border-t border-slate-200/20 dark:border-white/[0.05]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gold-500/10 text-gold-400">
                  <Activity className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase tracking-wider">
                    {ui.metricThroughput[language]}
                  </span>
                  <span className="text-sm font-black font-mono text-gold-400">
                    {activeMetric === 'throughput'
                      ? `${Math.round(throughputData.reduce((acc, cur) => acc + cur.throughput, 0) / throughputData.length)} ${ui.tonsHr[language]}`
                      : `${Math.round(throughputData.reduce((acc, cur) => acc + cur.fleet, 0) / throughputData.length)} Units`}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase tracking-wider">
                    {ui.metricLatency[language]}
                  </span>
                  <span className="text-sm font-black font-mono text-purple-400">
                    {(8.4 + (100 - networkEfficiency) * 0.15).toFixed(1)} ms
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Circular Efficiency Gauge & Sync Sliders Card */}
          <div
            className={`rounded-3xl p-6 sm:p-8 transition-all duration-300 flex flex-col justify-between ${
              mode === 'dark'
                ? 'bg-white/[0.025] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)]'
                : 'bg-white border border-slate-200/90 shadow-lg'
            }`}
          >
            <div>
              {/* Card Title & Description */}
              <div className="mb-4">
                <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2">
                  <h3
                    className={`text-base sm:text-lg lg:text-xl font-bold tracking-tight ${
                      mode === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {ui.efficiencyTitle[language]}
                  </h3>
                  <span className="self-start xs:self-auto shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-gold-500/10 text-gold-400 border border-gold-500/25">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
                    {(networkEfficiency * 0.4).toFixed(0)} / 40 <span className="hidden sm:inline">{ui.nodesText[language]}</span>
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  {ui.efficiencyDesc[language]}
                </p>
              </div>

              {/* Dedicated Status Strip (OPTIMAL LOAD FREIGHT / HEAVY TRAFFIC DETECTED) */}
              <div className="flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl bg-slate-900/80 border border-gold-500/20 mb-3 backdrop-blur-md">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${gridLoad > 75 ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'}`} />
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-200 truncate">
                    {gridLoad > 75 ? ui.highLoadText[language] : ui.optLoadText[language]}
                  </span>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg shrink-0 ${
                  gridLoad > 75 ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {gridLoad > 75 ? 'WARN' : 'OPTIMAL'}
                </span>
              </div>

              {/* PieChart Circular Gauge Rendering */}
              <div className="relative w-full h-[190px] flex items-center justify-center mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={gaugeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={74}
                      outerRadius={88}
                      startAngle={225}
                      endAngle={-45}
                      dataKey="value"
                      stroke="none"
                    >
                      {/* Active glowing path */}
                      <Cell fill="url(#gaugeGoldGradient)" />
                      {/* Inactive background track */}
                      <Cell fill={mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.08)'} />
                    </Pie>
                    <defs>
                      <linearGradient id="gaugeGoldGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#E8B317" />
                        <stop offset="100%" stopColor="#F59E0B" />
                      </linearGradient>
                    </defs>
                  </PieChart>
                </ResponsiveContainer>

                {/* Gauge Core Overlay HUD - Pristine Centered Metrics */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-mono">
                    EFFICIENCY
                  </span>
                  <div className="flex items-baseline gap-0.5 justify-center mt-0.5">
                    <span className="text-4xl sm:text-5xl font-black font-mono tracking-tighter bg-gradient-to-r from-gold-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(232,179,23,0.3)]">
                      {networkEfficiency}
                    </span>
                    <span className="text-lg font-bold text-slate-400">%</span>
                  </div>
                  <span className="text-[9px] font-mono text-emerald-400/90 font-semibold uppercase tracking-wider mt-0.5">
                    REAL-TIME STABILITY
                  </span>
                </div>
              </div>

              {/* Dynamic HUD Grid Control Sliders (Allows user to play with data!) */}
              <div className="space-y-4 pt-4 border-t border-slate-200/20 dark:border-white/[0.05]">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-bold flex items-center gap-1.5 text-slate-400">
                    <Sliders className="w-3.5 h-3.5 text-gold-400" />
                    {ui.adjustedLoad[language]}
                  </span>
                  <span className="font-mono text-gold-400 font-bold">{gridLoad}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="95"
                  value={gridLoad}
                  onChange={(e) => setGridLoad(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-gold-400 focus:outline-none"
                  aria-label="Adjust Simulated Grid Load"
                />
              </div>
            </div>

            {/* Command Calibrate Button */}
            <div className="mt-8">
              <button
                onClick={handleCalibrate}
                disabled={isCalibrating}
                className="relative w-full group overflow-hidden py-3 px-4 rounded-xl font-bold text-xs transition-all duration-300 flex items-center justify-center gap-2 border border-gold-400/35 bg-[#151206]/80 text-gold-400 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5),0_0_15px_rgba(232,179,23,0.1)] hover:shadow-[0_0_20px_rgba(232,179,23,0.35)] disabled:opacity-60"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-gold-400 ${isCalibrating ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                <span>
                  {isCalibrating ? ui.optimizingText[language] : ui.optimizeBtn[language]}
                </span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
