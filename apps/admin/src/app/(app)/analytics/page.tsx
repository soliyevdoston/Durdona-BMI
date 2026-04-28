'use client'
import { TrendingUp, TrendingDown, Users, DollarSign, Target, Zap } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts'
import { api } from '@/lib/api'
import { useApi } from '@/lib/useApi'

const COLORS = ['#7C3AED', '#0EA5E9', '#10B981', '#F59E0B', '#EF4444']

const REVENUE = [
  { month: 'Yan', revenue: 12500, expenses: 7500 },
  { month: 'Fev', revenue: 14200, expenses: 8200 },
  { month: 'Mar', revenue: 16800, expenses: 8900 },
  { month: 'Apr', revenue: 19500, expenses: 9200 },
]

const PLATFORMS = [
  { name: 'Desktop', value: 52 },
  { name: 'Mobile', value: 38 },
  { name: 'Tablet', value: 10 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="card-elevated px-3 py-2 text-xs space-y-1">
        {label && <p className="text-base-400 mb-1">{label}</p>}
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color || p.payload?.fill }}>{p.name}: {p.value}</p>
        ))}
      </div>
    )
  }
  return null
}

export default function AdminAnalyticsPage() {
  const { data: growth } = useApi(() => api.growth())
  const { data: statsData } = useApi(() => api.systemStats())
  const stats = statsData || { totalUsers: 0, avgCompletionRate: 0 }
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-base-100">Keng Tahlil</h1>
        <p className="text-sm text-base-500 mt-1">Platforma statistikasi va tendensiyalar</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <DollarSign className="w-4 h-4 text-emerald-400 mb-2" />
          <div className="text-2xl font-bold text-base-100">$19.5K</div>
          <div className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> +16%
          </div>
          <div className="text-xs text-base-600">Daromad (oy)</div>
        </div>
        <div className="stat-card">
          <Users className="w-4 h-4 text-accent-400 mb-2" />
          <div className="text-2xl font-bold text-base-100">{stats.totalUsers.toLocaleString()}</div>
          <div className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> +24%
          </div>
          <div className="text-xs text-base-600">Jami foydalanuvchi</div>
        </div>
        <div className="stat-card">
          <Target className="w-4 h-4 text-sky-400 mb-2" />
          <div className="text-2xl font-bold text-base-100">{stats.avgCompletionRate}%</div>
          <div className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> +8%
          </div>
          <div className="text-xs text-base-600">Tugatish foizi</div>
        </div>
        <div className="stat-card">
          <Zap className="w-4 h-4 text-amber-400 mb-2" />
          <div className="text-2xl font-bold text-base-100">4.2s</div>
          <div className="text-xs text-rose-400 flex items-center gap-1 mt-1">
            <TrendingDown className="w-3 h-3" /> -0.3s
          </div>
          <div className="text-xs text-base-600">O'rtacha sessiya</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card p-5">
          <div className="mb-4">
            <h2 className="section-title">Daromad va Xarajatlar</h2>
            <p className="text-xs text-base-500 mt-0.5">Oylik moliyaviy ko'rsatkichlar</p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={REVENUE}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E1E24" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#52525B' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#52525B' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px' }} iconType="circle" />
              <Bar dataKey="revenue" name="Daromad" fill="#10B981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expenses" name="Xarajat" fill="#EF4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <div className="mb-4">
            <h2 className="section-title">Qurilma Taqsimoti</h2>
            <p className="text-xs text-base-500 mt-0.5">Foydalanuvchilar qaysi qurilmadan kiradi</p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={PLATFORMS} dataKey="value" cx="50%" cy="50%" outerRadius={80} innerRadius={45} paddingAngle={2}>
                {PLATFORMS.map((_, i) => <Cell key={i} fill={COLORS[i]} stroke="none" />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px' }} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-5">
        <div className="mb-4">
          <h2 className="section-title">Foydalanuvchi O'sishi</h2>
          <p className="text-xs text-base-500 mt-0.5">Oylik dinamika</p>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={growth || []}>
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E1E24" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#52525B' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#52525B' }} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="enrolled" stroke="#7C3AED" fill="url(#g1)" strokeWidth={2} name="Yangi" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
