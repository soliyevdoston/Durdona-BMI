'use client'
import Link from 'next/link'
import {
  Users, TrendingUp, AlertTriangle, Brain,
  ChevronRight, Video, Plus, FileText, CheckCircle2
} from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar, Legend
} from 'recharts'
import { useAuthStore } from '@/lib/store'
import { api } from '@/lib/api'
import { useApi } from '@/lib/useApi'

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="card-elevated px-3 py-2 text-xs space-y-1">
        <p className="text-base-400 mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
        ))}
      </div>
    )
  }
  return null
}

export default function TeacherDashboard() {
  const { user } = useAuthStore()

  const { data: students } = useApi(() => api.students())
  const { data: courses } = useApi(() => api.myCourses())
  const { data: assignments } = useApi(() => api.teachingAssignments())
  const { data: growth } = useApi(() => api.growth())
  const { data: difficulty } = useApi(() => api.difficulty())
  const { data: aiSuggestions } = useApi(() => api.aiSuggestions())

  if (!user) return null

  const studentList = students || []
  const atRisk = studentList.filter((s: any) => s.risk === 'high')
  const totalStudents = studentList.length
  const activeStudents = studentList.filter((s: any) => {
    if (!s.lastActive) return false
    const d = new Date(s.lastActive)
    return (Date.now() - d.getTime()) < 86400000 * 3
  }).length
  const pendingGrading = (assignments || []).reduce((sum: number, a: any) => sum + (a.submissions - a.graded), 0)

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <p className="text-xs text-base-500 uppercase tracking-wider mb-1.5">
            {new Date().toLocaleDateString('uz-UZ', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          <h1 className="text-2xl font-semibold text-base-100">Assalomu alaykum, {user.name.split(' ')[0]}.</h1>
          <p className="text-sm text-base-500 mt-1.5 max-w-lg">
            Hozir <span className="text-base-300 tabular-nums">{activeStudents}</span> o'quvchi faol,
            <span className="text-base-300 tabular-nums"> {pendingGrading}</span> ish baholashni kutmoqda.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/live" className="btn-secondary flex items-center gap-2 text-sm">
            <Video className="w-4 h-4 text-rose-400" /> Jonli dars
          </Link>
          <Link href="/create-course" className="btn-primary bg-sky-600 hover:bg-sky-700 flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> Yangi kurs
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-base-500 uppercase tracking-wider">O'quvchilar</span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-base-100">{totalStudents}</div>
          <div className="text-xs text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12% bu oyda
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-base-500 uppercase tracking-wider">Faol Bugun</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-base-100">{activeStudents}</div>
          <div className="text-xs text-base-500">
            {Math.round((activeStudents / totalStudents) * 100)}% faollik
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-base-500 uppercase tracking-wider">Baholash</span>
            <FileText className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-base-100">{pendingGrading}</div>
          <div className="text-xs text-amber-400">Kutilmoqda</div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-base-500 uppercase tracking-wider">Xavfli O'quvchi</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-400">{atRisk.length}</div>
          <div className="text-xs text-base-500">Aralashuv kerak</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title">O'quvchilar Dinamikasi</h2>
            <span className="text-xs text-base-600">So'nggi 8 oy</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={growth || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E1E24" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#52525B' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#52525B' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px' }} iconType="circle" />
              <Line type="monotone" dataKey="enrolled" name="Ro'yxatdan o'tgan" stroke="#0EA5E9" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="active" name="Faol" stroke="#7C3AED" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="completed" name="Tugatgan" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title">Mavzu Qiyinligi</h2>
            <span className="text-xs text-base-600">% o'quvchilar qiynalgan</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={difficulty || []} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E1E24" />
              <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#52525B' }} />
              <YAxis type="category" dataKey="topic" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#A1A1AA' }} width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="difficulty" radius={[0, 6, 6, 0]}>
                {(difficulty || []).map((entry: any, index: number) => (
                  <Bar key={index} dataKey="difficulty" fill={entry.difficulty > 80 ? '#EF4444' : entry.difficulty > 60 ? '#F59E0B' : '#10B981'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* At-Risk Students */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <h2 className="section-title">Xavfli O'quvchilar</h2>
            </div>
            <Link href="/students" className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1">
              Barchasi <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {atRisk.map((s: any) => (
              <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-rose-500/5 border border-rose-500/20 hover:bg-rose-500/10 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-xs font-bold text-rose-400">
                  {s.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-base-200 truncate">{s.name}</div>
                  <div className="flex items-center gap-3 text-xs text-base-500 mt-0.5">
                    <span>Oxirgi: {s.lastActive}</span>
                    <span>{s.completedTasks}/{s.totalTasks} vazifa</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-rose-400 font-medium">{s.progress}%</div>
                  <div className="text-xs text-base-600">progress</div>
                </div>
                <button className="btn-ghost px-3 py-1.5 text-xs border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 flex-shrink-0">
                  Xabar yuborish
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="card p-5 border-sky-600/20">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-sky-600/20 flex items-center justify-center">
              <Brain className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-base-200">AI Tavsiyalari</div>
              <div className="text-xs text-base-600">Bugungi tahlil</div>
            </div>
          </div>
          <div className="space-y-3">
            {(aiSuggestions || []).slice(0, 3).map((s: string, i: number) => (
              <div key={i} className="flex gap-2 text-xs text-base-400 leading-relaxed">
                <div className="w-5 h-5 rounded-full bg-sky-600/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-sky-400">{i + 1}</span>
                </div>
                <p>{s}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Access Courses */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Mening Kurslarim</h2>
          <Link href="/courses" className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1">
            Barchasi <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {(courses || []).slice(0, 3).map((c: any) => (
            <div key={c.id} className="p-4 rounded-xl bg-[#1A1A1F] border border-[#27272A] hover:border-sky-600/30 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="badge bg-sky-500/10 text-sky-400 border border-sky-500/20">{c.category}</div>
                <div className="text-xs text-base-500">{c.enrolled} o'quvchi</div>
              </div>
              <h3 className="font-medium text-sm text-base-200 mb-2">{c.title}</h3>
              <div className="flex items-center gap-2 text-xs text-base-600">
                <span>{c.lessons} dars</span>
                <span>·</span>
                <span>★ {c.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
