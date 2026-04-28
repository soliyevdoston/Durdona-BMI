'use client'
import Link from 'next/link'
import {
  Users, BookOpen, FileText, Server, TrendingUp, Activity,
  HardDrive, Cpu, Shield, AlertCircle, ChevronRight,
  UserPlus, CheckCircle2, Zap
} from 'lucide-react'
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts'
import { api } from '@/lib/api'
import { useApi } from '@/lib/useApi'

const COLORS = ['#7C3AED', '#0EA5E9', '#10B981', '#F59E0B']

function getLogIcon(action: string) {
  if (action.includes('lesson') || action.includes('course')) return { icon: BookOpen, color: 'text-sky-400' }
  if (action.includes('auth') || action.includes('register')) return { icon: UserPlus, color: 'text-accent-400' }
  if (action.includes('xp') || action.includes('achievement')) return { icon: Zap, color: 'text-amber-400' }
  if (action.includes('assignment') || action.includes('submit')) return { icon: FileText, color: 'text-emerald-400' }
  if (action.includes('ai') || action.includes('code')) return { icon: CheckCircle2, color: 'text-purple-400' }
  return { icon: Activity, color: 'text-base-400' }
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'hozir'
  if (min < 60) return `${min} daq oldin`
  const h = Math.floor(min / 60)
  if (h < 24) return `${h} soat oldin`
  return `${Math.floor(h / 24)} kun oldin`
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="card-elevated px-3 py-2 text-xs space-y-1">
        <p className="text-base-400 mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color || p.payload?.fill }}>{p.name}: {p.value}</p>
        ))}
      </div>
    )
  }
  return null
}

export default function AdminDashboard() {
  const { data: statsData } = useApi(() => api.systemStats())
  const { data: logs } = useApi(() => api.systemLogs(10))
  const { data: growth } = useApi(() => api.growth())

  const stats = statsData || {
    totalUsers: 0, activeToday: 0, coursesTotal: 0, lessonsTotal: 0,
    assignmentsTotal: 0, avgCompletionRate: 0, avgRating: 0,
    serverLoad: 0, storageUsed: 0, uptime: 0,
    roleCounts: { students: 0, teachers: 0, admins: 0 },
  }

  const roleDistribution = [
    { name: 'Talabalar', value: stats.roleCounts?.students || 0 },
    { name: "O'qituvchilar", value: stats.roleCounts?.teachers || 0 },
    { name: 'Adminlar', value: stats.roleCounts?.admins || 0 },
  ].filter(r => r.value > 0)

  const activityLog: any[] = logs || []

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-base-100">Tizim Boshqaruvi</h1>
        <p className="text-sm text-base-500 mt-1">Umumiy statistika va tizim holati</p>
      </div>

      {/* Main KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-base-500 uppercase tracking-wider">Jami Foydalanuvchi</span>
            <Users className="w-4 h-4 text-accent-400" />
          </div>
          <div className="text-3xl font-bold text-base-100">{stats.totalUsers.toLocaleString()}</div>
          <div className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> +24% oyda
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-base-500 uppercase tracking-wider">Bugun Faol</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-base-100">{stats.activeToday}</div>
          <div className="text-xs text-base-500 mt-1">
            {Math.round((stats.activeToday / stats.totalUsers) * 100)}% faollik
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-base-500 uppercase tracking-wider">Kurslar</span>
            <BookOpen className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-3xl font-bold text-base-100">{stats.coursesTotal}</div>
          <div className="text-xs text-base-500 mt-1">{stats.lessonsTotal} dars</div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-base-500 uppercase tracking-wider">Tugatish Foizi</span>
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-bold text-base-100">{stats.avgCompletionRate}%</div>
          <div className="text-xs text-base-500 mt-1">{stats.avgRating}★ reyting</div>
        </div>
      </div>

      {/* System Health */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-400" />
            <h2 className="section-title">Tizim Salomatligi</h2>
          </div>
          <span className="badge-emerald">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Tizim ishlamoqda
          </span>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#1A1A1F]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-base-500 flex items-center gap-1.5"><Cpu className="w-3 h-3" /> Server yuki</span>
              <span className="text-sm font-bold text-emerald-400">{stats.serverLoad}%</span>
            </div>
            <div className="progress-bar">
              <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${stats.serverLoad}%` }} />
            </div>
          </div>
          <div className="p-4 rounded-xl bg-[#1A1A1F]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-base-500 flex items-center gap-1.5"><HardDrive className="w-3 h-3" /> Xotira</span>
              <span className="text-sm font-bold text-amber-400">{stats.storageUsed}%</span>
            </div>
            <div className="progress-bar">
              <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${stats.storageUsed}%` }} />
            </div>
          </div>
          <div className="p-4 rounded-xl bg-[#1A1A1F]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-base-500 flex items-center gap-1.5"><Activity className="w-3 h-3" /> Uptime</span>
              <span className="text-sm font-bold text-emerald-400">{stats.uptime}%</span>
            </div>
            <div className="progress-bar">
              <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${stats.uptime}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Revenue/Users */}
        <div className="lg:col-span-2 card p-5">
          <div className="mb-4">
            <h2 className="section-title">Platforma O'sishi</h2>
            <p className="text-xs text-base-500 mt-0.5">Oylik dinamika</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={growth || []}>
              <defs>
                <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E1E24" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#52525B' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#52525B' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px' }} iconType="circle" />
              <Area type="monotone" dataKey="enrolled" name="Yangi" stroke="#10B981" fill="url(#grad1)" strokeWidth={2} />
              <Area type="monotone" dataKey="active" name="Faol" stroke="#7C3AED" fill="url(#grad2)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Role Distribution */}
        <div className="card p-5">
          <div className="mb-4">
            <h2 className="section-title">Foydalanuvchilar</h2>
            <p className="text-xs text-base-500 mt-0.5">Rol bo'yicha</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={roleDistribution} dataKey="value" cx="50%" cy="50%" outerRadius={70} innerRadius={40} paddingAngle={2}>
                {roleDistribution.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {roleDistribution.map((r, i) => (
              <div key={r.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                  <span className="text-base-400">{r.name}</span>
                </div>
                <span className="text-base-300 font-medium">{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Log & Alerts */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">So'nggi Faoliyat</h2>
            <Link href="/logs" className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
              Barchasi <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {activityLog.length === 0 ? (
              <p className="text-xs text-base-600 py-4 text-center">Faoliyat yo'q</p>
            ) : activityLog.map((entry: any) => {
              const { icon: Icon, color } = getLogIcon(entry.action)
              return (
                <div key={entry.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#1A1A1F] transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-[#1A1A1F] flex items-center justify-center">
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-base-200">
                      <span className="font-medium">{entry.user?.name || 'Tizim'}</span>{' '}
                      <span className="text-base-500">{entry.action}</span>
                    </div>
                  </div>
                  <span className="text-xs text-base-700 flex-shrink-0">{timeAgo(entry.createdAt)}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="space-y-5">
          {/* Alerts */}
          <div className="card p-5 border-amber-500/20">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <h2 className="section-title">Ogohlantirishlar</h2>
            </div>
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                <div className="text-xs font-medium text-amber-400">Xotira 68%</div>
                <div className="text-xs text-base-500 mt-0.5">Tez orada tozalash kerak</div>
              </div>
              <div className="p-3 rounded-xl bg-sky-500/5 border border-sky-500/10">
                <div className="text-xs font-medium text-sky-400">Backup rejalashtirildi</div>
                <div className="text-xs text-base-500 mt-0.5">Ertaga 03:00 da</div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                <div className="text-xs font-medium text-emerald-400">Yangi versiya</div>
                <div className="text-xs text-base-500 mt-0.5">v2.4.1 mavjud</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card p-5">
            <h2 className="section-title mb-3">Tezkor Amallar</h2>
            <div className="space-y-2">
              {[
                { label: 'Foydalanuvchilarni boshqarish', icon: Users, href: '/users' },
                { label: 'Tizim sozlamalari', icon: Server, href: '/system' },
                { label: 'Xavfsizlik auditi', icon: Shield, href: '/security' },
              ].map(a => (
                <Link key={a.label} href={a.href}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#1A1A1F] transition-colors text-sm text-base-300">
                  <a.icon className="w-4 h-4 text-base-500" />
                  {a.label}
                  <ChevronRight className="w-3 h-3 ml-auto text-base-700" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
