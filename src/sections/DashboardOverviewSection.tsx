'use client'

import React, { useState, useMemo } from 'react'
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
import { Activity, Cpu, Sliders, RefreshCw } from 'lucide-react'

// Styled Custom Tooltip for Recharts
interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ value: number | string; name?: string }>
  label?: string
  language: 'en' | 'ar'
}

function ChartTooltip({ active, payload, label, language }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null

  const isRtl = language === 'ar'
  const val = payload[0].value
  const labelText = isRtl ? 'حجم التدفق' : 'Throughput'

  return (
    <div className="rounded-xl border border-cyan-500/30 bg-slate-950/95 p-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md">
      <p className="font-mono text-xs text-slate-400 mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
        <span className="text-xs font-bold text-white">
          {labelText}: <span className="font-mono text-cyan-300">{val.toLocaleString()} Tons/hr</span>
        </span>
      </div>
    </div>
  )
}

export default function DashboardOverviewSection() {
  const { resolvedTheme } = useTheme()
  const { language, direction } = useLanguage()

  const mode = resolvedTheme === 'light' ? 'light' : 'dark'

  const t = (en: string, ar: string) => ({ en, ar })

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
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_50%_40%,rgba(6,182,212,0.05),transparent)]"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-cyan-400 font-extrabold tracking-widest text-[11px] sm:text-xs uppercase mb-3 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
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
                        ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {ui.throughputTab[language]}
                  </button>
                  <button
                    onClick={() => setActiveMetric('fleet')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                      activeMetric === 'fleet'
                        ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 shadow-md'
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
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
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
                        stroke: '#06b6d4',
                        strokeWidth: 1,
                        strokeDasharray: '3 3'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey={activeMetric}
                      stroke="#06b6d4"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorMetric)"
                      dot={{
                        r: 3,
                        stroke: '#06b6d4',
                        strokeWidth: 2,
                        fill: '#020617'
                      }}
                      activeDot={{
                        r: 6,
                        stroke: '#22d3ee',
                        strokeWidth: 2,
                        fill: '#22d3ee'
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Simulated Live Spark/Footer within the Card */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-6 border-t border-slate-200/20 dark:border-white/[0.05]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                  <Activity className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase tracking-wider">
                    {ui.metricThroughput[language]}
                  </span>
                  <span className="text-sm font-black font-mono text-cyan-400">
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
              {/* Card Title */}
              <div className="mb-6">
                <h3
                  className={`text-lg sm:text-xl font-bold tracking-tight ${
                    mode === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {ui.efficiencyTitle[language]}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {ui.efficiencyDesc[language]}
                </p>
              </div>

              {/* PieChart Circular Gauge Rendering */}
              <div className="relative w-full h-[180px] flex items-center justify-center mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={gaugeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={68}
                      outerRadius={82}
                      startAngle={225}
                      endAngle={-45}
                      dataKey="value"
                      stroke="none"
                    >
                      {/* Active glowing path */}
                      <Cell fill="url(#gaugeCyanGradient)" />
                      {/* Inactive background track */}
                      <Cell fill={mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.08)'} />
                    </Pie>
                    <defs>
                      <linearGradient id="gaugeCyanGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                  </PieChart>
                </ResponsiveContainer>

                {/* Gauge Core Overlay HUD */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center mt-2">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest font-mono">
                    {gridLoad > 75 ? ui.highLoadText[language] : ui.optLoadText[language]}
                  </span>
                  <div className="flex items-baseline gap-0.5 justify-center mt-1">
                    <span className="text-4xl sm:text-5xl font-black font-mono tracking-tighter bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      {networkEfficiency}
                    </span>
                    <span className="text-lg font-bold text-slate-400">%</span>
                  </div>
                  <span className="text-[9px] font-mono px-2.5 py-0.5 rounded-full mt-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.15)] uppercase">
                    {(networkEfficiency * 0.4).toFixed(0)} / 40 {ui.nodesText[language]}
                  </span>
                </div>
              </div>

              {/* Dynamic HUD Grid Control Sliders (Allows user to play with data!) */}
              <div className="space-y-4 pt-4 border-t border-slate-200/20 dark:border-white/[0.05]">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-bold flex items-center gap-1.5 text-slate-400">
                    <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                    {ui.adjustedLoad[language]}
                  </span>
                  <span className="font-mono text-cyan-400 font-bold">{gridLoad}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="95"
                  value={gridLoad}
                  onChange={(e) => setGridLoad(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
                  aria-label="Adjust Simulated Grid Load"
                />
              </div>
            </div>

            {/* Command Calibrate Button */}
            <div className="mt-8">
              <button
                onClick={handleCalibrate}
                disabled={isCalibrating}
                className="relative w-full group overflow-hidden py-3 px-4 rounded-xl font-bold text-xs transition-all duration-300 flex items-center justify-center gap-2 border border-cyan-400/35 bg-[#051336]/80 text-cyan-400 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5),0_0_15px_rgba(6,182,212,0.1)] hover:shadow-[0_0_20px_rgba(6,182,212,0.35)] disabled:opacity-60"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isCalibrating ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
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
