'use client'
import { Server, Cpu, HardDrive, Database, Globe, Activity, Download, RefreshCw, Upload, Zap } from 'lucide-react'
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const SERVER_METRICS = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  cpu: 20 + Math.random() * 40,
  memory: 40 + Math.random() * 30,
  network: 10 + Math.random() * 60,
}))

const SERVICES = [
  { name: 'API Server', status: 'healthy', uptime: '99.97%', latency: '42ms', color: 'emerald' },
  { name: 'Database', status: 'healthy', uptime: '99.99%', latency: '18ms', color: 'emerald' },
  { name: 'WebSocket', status: 'healthy', uptime: '99.95%', latency: '28ms', color: 'emerald' },
  { name: 'AI Service', status: 'degraded', uptime: '98.5%', latency: '350ms', color: 'amber' },
  { name: 'Code Sandbox', status: 'healthy', uptime: '99.92%', latency: '120ms', color: 'emerald' },
  { name: 'Storage (S3)', status: 'healthy', uptime: '100%', latency: '65ms', color: 'emerald' },
  { name: 'Email Service', status: 'healthy', uptime: '99.9%', latency: '210ms', color: 'emerald' },
  { name: 'Redis Cache', status: 'healthy', uptime: '99.98%', latency: '3ms', color: 'emerald' },
]

const BACKUPS = [
  { id: 1, date: '2026-04-23', size: '2.4 GB', type: 'Avtomatik', status: 'success' },
  { id: 2, date: '2026-04-22', size: '2.3 GB', type: 'Avtomatik', status: 'success' },
  { id: 3, date: '2026-04-21', size: '2.3 GB', type: 'Qo\'lda', status: 'success' },
  { id: 4, date: '2026-04-20', size: '2.2 GB', type: 'Avtomatik', status: 'success' },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="card-elevated px-3 py-2 text-xs space-y-1">
        <p className="text-base-400 mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }}>{p.name}: {p.value.toFixed(1)}%</p>
        ))}
      </div>
    )
  }
  return null
}

export default function SystemPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-base-100">Tizim Monitoringi</h1>
          <p className="text-sm text-base-500 mt-1">Server holati va xizmatlar</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Yangilash
          </button>
          <button className="btn-primary bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2">
            <Download className="w-4 h-4" /> Hisobot yuklab olish
          </button>
        </div>
      </div>

      {/* Main metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-base-500 uppercase tracking-wider">CPU Yuki</span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-emerald-400">34%</div>
          <div className="progress-bar mt-2">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '34%' }} />
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-base-500 uppercase tracking-wider">RAM</span>
            <Activity className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-3xl font-bold text-sky-400">58%</div>
          <div className="text-xs text-base-600 mt-1">9.2 GB / 16 GB</div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-base-500 uppercase tracking-wider">Xotira</span>
            <HardDrive className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-bold text-amber-400">68%</div>
          <div className="text-xs text-base-600 mt-1">340 GB / 500 GB</div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-base-500 uppercase tracking-wider">Network</span>
            <Globe className="w-4 h-4 text-accent-400" />
          </div>
          <div className="text-3xl font-bold text-accent-400">42%</div>
          <div className="text-xs text-base-600 mt-1">125 Mbps</div>
        </div>
      </div>

      {/* Chart */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">24 Soatlik Monitoring</h2>
          <div className="flex gap-3 text-xs text-base-500">
            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-500 rounded-full" /> CPU</div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-sky-500 rounded-full" /> Memory</div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-accent-500 rounded-full" /> Network</div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={SERVER_METRICS}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E1E24" />
            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#52525B' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#52525B' }} domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="cpu" name="CPU" stroke="#10B981" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="memory" name="Memory" stroke="#0EA5E9" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="network" name="Network" stroke="#7C3AED" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Services Status */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Xizmatlar Holati</h2>
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              7/8 Sog'lom
            </span>
          </div>
          <div className="space-y-2">
            {SERVICES.map((s) => (
              <div key={s.name} className="flex items-center justify-between p-3 rounded-xl bg-[#1A1A1F] hover:bg-[#222229] transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${s.status === 'healthy' ? 'bg-emerald-500' : s.status === 'degraded' ? 'bg-amber-500' : 'bg-rose-500'}`} />
                  <div>
                    <div className="text-sm font-medium text-base-200">{s.name}</div>
                    <div className="text-xs text-base-600">Uptime: {s.uptime}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-base-400">{s.latency}</div>
                  <div className={`text-xs capitalize ${s.status === 'healthy' ? 'text-emerald-400' : s.status === 'degraded' ? 'text-amber-400' : 'text-rose-400'}`}>
                    {s.status === 'healthy' ? 'Sog\'lom' : s.status === 'degraded' ? 'Sust' : 'Ishlamayapti'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Backups */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Zaxira Nusxalar</h2>
            <button className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" /> Yangi Backup
            </button>
          </div>
          <div className="space-y-2">
            {BACKUPS.map(b => (
              <div key={b.id} className="flex items-center justify-between p-3 rounded-xl bg-[#1A1A1F] hover:bg-[#222229] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Database className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-sm text-base-200">{b.date}</div>
                    <div className="text-xs text-base-600">{b.size} · {b.type}</div>
                  </div>
                </div>
                <button className="btn-ghost p-2 text-base-500 hover:text-base-200">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-xl bg-sky-500/5 border border-sky-500/20">
            <div className="flex items-center gap-2 text-xs text-sky-400">
              <Zap className="w-3 h-3" />
              Keyingi avtomatik backup: Ertaga 03:00
            </div>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="card p-5">
        <h2 className="section-title mb-4">Tizim Ma'lumotlari</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Versiya', value: 'v2.4.0' },
            { label: 'Platforma', value: 'Next.js 14 + Node 20' },
            { label: 'DB Versiya', value: 'PostgreSQL 16.2' },
            { label: 'Docker', value: 'v25.0.3' },
            { label: 'Region', value: 'EU-West' },
            { label: 'SSL', value: 'Valid (TLS 1.3)' },
            { label: 'Node Count', value: '4 nodes' },
            { label: 'CDN', value: 'CloudFlare' },
          ].map(i => (
            <div key={i.label}>
              <div className="text-xs text-base-600 uppercase tracking-wider mb-1">{i.label}</div>
              <div className="text-sm font-medium text-base-200">{i.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
