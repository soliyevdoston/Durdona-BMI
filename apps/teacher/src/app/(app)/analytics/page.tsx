'use client'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts'
import { Download, Calendar, TrendingUp, TrendingDown, Users, Target, Zap, Brain } from 'lucide-react'
import { api } from '@/lib/api'
import { useApi } from '@/lib/useApi'

const COLORS = ['#7C3AED', '#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="card-elevated px-3 py-2 text-xs space-y-1">
        {label && <p className="text-base-400 mb-1">{label}</p>}
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color || p.payload?.fill }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

const SKILLS_DATA = [
  { skill: 'Python', A: 85, B: 65 },
  { skill: 'SQL', A: 72, B: 58 },
  { skill: 'Web', A: 78, B: 70 },
  { skill: 'Algoritm', A: 62, B: 48 },
  { skill: 'OOP', A: 68, B: 55 },
  { skill: 'Tarmoq', A: 55, B: 40 },
]

export default function TeacherAnalyticsPage() {
  const { data: growth } = useApi(() => api.growth())
  const { data: difficulty } = useApi(() => api.difficulty())
  const { data: weekly } = useApi(() => api.weekly())
  const { data: aiSuggestions } = useApi(() => api.aiSuggestions())
  const { data: courses } = useApi(() => api.myCourses())
  const { data: students } = useApi(() => api.students())

  const categoryDistribution = Object.entries(
    ((courses as any[]) || []).reduce((acc: Record<string, number>, c: any) => {
      acc[c.category] = (acc[c.category] || 0) + 1
      return acc
    }, {})
  ).map(([name, value]) => ({ name, value }))

  const totalStudents = ((students as any[]) || []).length
  const activeStudents = ((students as any[]) || []).filter((s: any) => {
    if (!s.lastActive) return false
    return Date.now() - new Date(s.lastActive).getTime() < 86400000 * 3
  }).length
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-base-100">Tahlil va Hisobotlar</h1>
          <p className="text-sm text-base-500 mt-1">O'quvchilar natijalari va ta'lim samaradorligi</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary flex items-center gap-2">
            <Calendar className="w-4 h-4" /> So'nggi 30 kun
          </button>
          <button className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" /> Yuklab olish
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-base-500 uppercase tracking-wider">O'rtacha Bajarish</span>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-base-100">67%</div>
          <div className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> +8% bu oyda
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-base-500 uppercase tracking-wider">Faol O'quvchi</span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-3xl font-bold text-base-100">{activeStudents}</div>
          <div className="text-xs text-base-500 mt-1">
            {totalStudents > 0 ? Math.round((activeStudents / totalStudents) * 100) : 0}% faollik
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-base-500 uppercase tracking-wider">Aktivlik Vaqti</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-bold text-base-100">4.2s</div>
          <div className="text-xs text-amber-400">Kuniga o'rtacha</div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-base-500 uppercase tracking-wider">Tashlab Ketganlar</span>
            <TrendingDown className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-bold text-base-100">12%</div>
          <div className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
            <TrendingDown className="w-3 h-3" /> -3%
          </div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="section-title">O'quvchilar Dinamikasi</h2>
          <div className="flex gap-2">
            {['Hafta', 'Oy', 'Yil'].map(p => (
              <button key={p} className="text-xs px-3 py-1 rounded-full border border-[#27272A] text-base-500 hover:text-base-300 hover:border-[#3F3F46]">{p}</button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={growth || []}>
            <defs>
              <linearGradient id="c1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="c2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E1E24" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#52525B' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#52525B' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '11px' }} iconType="circle" />
            <Area type="monotone" dataKey="active" name="Faol" stroke="#7C3AED" fill="url(#c1)" strokeWidth={2} />
            <Area type="monotone" dataKey="completed" name="Tugatgan" stroke="#10B981" fill="url(#c2)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Difficulty Heatmap */}
        <div className="card p-5">
          <div className="mb-4">
            <h2 className="section-title">Mavzu Qiyinligi Xaritasi</h2>
            <p className="text-xs text-base-500 mt-0.5">Qaysi mavzular o'quvchilar uchun qiyin</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={difficulty || []} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E1E24" />
              <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#52525B' }} />
              <YAxis type="category" dataKey="topic" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#A1A1AA' }} width={85} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="difficulty" radius={[0, 6, 6, 0]}>
                {(difficulty || []).map((e: any, i: number) => (
                  <Cell key={i} fill={e.difficulty > 80 ? '#EF4444' : e.difficulty > 60 ? '#F59E0B' : '#10B981'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Skills Radar */}
        <div className="card p-5">
          <div className="mb-4">
            <h2 className="section-title">Ko'nikmalar Tahlili</h2>
            <p className="text-xs text-base-500 mt-0.5">Kategoriya bo'yicha o'rtacha</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={SKILLS_DATA}>
              <PolarGrid stroke="#27272A" />
              <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fill: '#A1A1AA' }} />
              <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#52525B' }} />
              <Radar name="Bu oy" dataKey="A" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.3} />
              <Radar name="O'tgan oy" dataKey="B" stroke="#0EA5E9" fill="#0EA5E9" fillOpacity={0.15} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="card p-5">
          <div className="mb-4">
            <h2 className="section-title">Kurslar Taqsimoti</h2>
            <p className="text-xs text-base-500 mt-0.5">Kategoriyalar bo'yicha</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={categoryDistribution.length ? categoryDistribution : [{ name: 'Kurs yo\'q', value: 1 }]} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={50} paddingAngle={2}>
                {(categoryDistribution.length ? categoryDistribution : [{ name: 'Kurs yo\'q', value: 1 }]).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px' }} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Activity */}
        <div className="card p-5">
          <div className="mb-4">
            <h2 className="section-title">Haftalik Faollik</h2>
            <p className="text-xs text-base-500 mt-0.5">Kun bo'yicha o'rtacha daqiqalar</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={weekly || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E1E24" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#52525B' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#52525B' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="minutes" name="Daqiqalar" fill="#7C3AED" radius={[6, 6, 0, 0]} />
              <Bar dataKey="tasks" name="Vazifalar" fill="#0EA5E9" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Insights */}
      <div className="card p-5 border-accent-600/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-accent-600/20 flex items-center justify-center">
            <Brain className="w-5 h-5 text-accent-400" />
          </div>
          <div>
            <h2 className="section-title">AI Didaktik Tavsiyalar</h2>
            <p className="text-xs text-base-500">Ma'lumotlarga asoslangan optimallashtirish yo'llari</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {(aiSuggestions || []).map((s: string, i: number) => (
            <div key={i} className="flex gap-3 p-4 rounded-xl bg-[#1A1A1F] border border-[#27272A]">
              <div className="w-7 h-7 rounded-lg bg-accent-600/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-accent-400">{i + 1}</span>
              </div>
              <p className="text-xs text-base-300 leading-relaxed">{s}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
