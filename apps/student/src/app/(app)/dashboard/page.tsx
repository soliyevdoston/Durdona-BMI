'use client'
import { useState } from 'react'
import Link from 'next/link'
import type { ElementType } from 'react'
import {
  Flame, Target, ChevronRight, Brain, BookOpen, CheckCircle2, CheckCircle, Circle,
  Zap, Trophy, ArrowRight, BarChart3, Calendar,
  Globe, Database, Network, GitBranch, Shield, Code2,
  Rocket, Wrench, Bot, Award, GraduationCap, Star
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts'
import { useAuthStore } from '@/lib/store'
import { api } from '@/lib/api'
import { useApi } from '@/lib/useApi'
import { getLevelFromXP, getRankLabel, formatDate } from '@/lib/utils'

const ACH_ICONS: Record<string, ElementType> = {
  rocket: Rocket, fire: Flame, bolt: Zap, code: Code2, check: CheckCircle,
  hammer: Wrench, bot: Bot, percent: Award, book: BookOpen, graduation: GraduationCap,
  trophy: Trophy, star: Star,
}
function AchIcon({ icon }: { icon: string }) {
  const Icon = ACH_ICONS[icon] || Award
  return <Icon className="w-4 h-4 text-base-500" />
}


const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="card-elevated px-3 py-2 text-xs">
        <p className="text-base-400 mb-1">{label}</p>
        <p className="text-accent-400">{payload[0].value} daqiqa</p>
      </div>
    )
  }
  return null
}

export default function StudentDashboard() {
  const { user } = useAuthStore()
  const [doneTasks, setDoneTasks] = useState<Set<string>>(new Set())

  const { data: courses } = useApi(() => api.myCourses())
  const { data: assignments } = useApi(() => api.myAssignments())
  const { data: achievements } = useApi(() => api.achievements())
  const { data: weekly } = useApi(() => api.weekly())
  const { data: aiSuggestions } = useApi(() => api.aiSuggestions())

  if (!user) return null

  const { level, current, required } = getLevelFromXP(user.xp)
  const xpProgress = Math.round((current / required) * 100)
  const activeCourses = (courses || []).filter((c: any) => (c.progress ?? 0) > 0)
  const pendingAssignments = (assignments || []).filter((a: any) => a.status === 'pending')
  const earnedAchievements = (achievements || []).filter((a: any) => a.earned)
  const totalAchievements = (achievements || []).length
  const tasks = pendingAssignments.slice(0, 5).map((a: any) => ({
    id: String(a.id),
    text: a.title,
    done: doneTasks.has(String(a.id)),
    xp: a.type === 'project' ? 100 : a.type === 'quiz' ? 40 : 50,
    type: a.type,
  }))
  const completedTasks = tasks.filter(t => t.done).length
  const todayXP = tasks.filter(t => t.done).reduce((sum: number, t: any) => sum + t.xp, 0)
  const aiTip = aiSuggestions?.[0] || ''

  const toggleTask = (id: string) => setDoneTasks(prev => {
    const n = new Set(prev)
    n.has(id) ? n.delete(id) : n.add(id)
    return n
  })

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">

      {/* Welcome Banner */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs text-base-500 uppercase tracking-wider mb-1.5">
              {new Date().toLocaleDateString('uz-UZ', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            <h1 className="text-2xl font-semibold text-base-100">Salom, {user.name.split(' ')[0]}.</h1>
            <div className="flex items-center gap-2 mt-3">
              {user.streak > 0 && (
                <span className="badge bg-[#1A1A1F] text-base-300 border border-[#27272A]">
                  <Flame className="w-3 h-3 text-amber-400" />
                  {user.streak} kunlik seriya
                </span>
              )}
              <span className="badge bg-[#1A1A1F] text-base-400 border border-[#27272A]">
                {getRankLabel(level)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-6 sm:gap-8 tabular-nums">
            <div className="text-center">
              <div className="text-2xl font-semibold text-base-100">{level}</div>
              <div className="text-xs text-base-500 mt-0.5">Daraja</div>
            </div>
            <div className="w-px h-8 bg-[#27272A]" />
            <div className="text-center">
              <div className="text-2xl font-semibold text-base-100">{user.xp.toLocaleString()}</div>
              <div className="text-xs text-base-500 mt-0.5">Jami XP</div>
            </div>
            <div className="w-px h-8 bg-[#27272A]" />
            <div className="text-center">
              <div className="text-2xl font-semibold text-emerald-400">+{todayXP}</div>
              <div className="text-xs text-base-500 mt-0.5">Bugun</div>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <div className="flex justify-between text-xs text-base-600 mb-1.5">
            <span>Daraja {level} → {level + 1}</span>
            <span className="font-mono">{current}/{required} XP</span>
          </div>
          <div className="progress-bar h-1.5">
            <div className="progress-fill h-1.5" style={{ width: `${xpProgress}%` }} />
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-base-500 uppercase tracking-wider">Kurslar</span>
            <BookOpen className="w-4 h-4 text-base-500" />
          </div>
          <div className="text-2xl font-bold text-base-100">{activeCourses.length}</div>
          <div className="text-xs text-base-500">Faol kurslar</div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-base-500 uppercase tracking-wider">Topshiriqlar</span>
            <Target className="w-4 h-4 text-base-500" />
          </div>
          <div className="text-2xl font-bold text-base-100">{pendingAssignments.length}</div>
          <div className="text-xs text-base-500">Kutilmoqda</div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-base-500 uppercase tracking-wider">Yutuqlar</span>
            <Trophy className="w-4 h-4 text-base-500" />
          </div>
          <div className="text-2xl font-bold text-base-100">{earnedAchievements.length}/{totalAchievements}</div>
          <div className="text-xs text-base-500">Nishonlar</div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-base-500 uppercase tracking-wider">Bugungi</span>
            <Zap className="w-4 h-4 text-base-500" />
          </div>
          <div className="text-2xl font-bold text-base-100">{completedTasks}/{tasks.length}</div>
          <div className="text-xs text-base-500">Vazifalar bajarildi</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">

        {/* Left: Courses + Chart */}
        <div className="lg:col-span-2 space-y-5">

          {/* Active Courses */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">Faol Kurslar</h2>
              <Link href="/courses" className="text-xs text-accent-400 hover:text-accent-300 flex items-center gap-1">
                Barchasi <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {activeCourses.map((course: any) => {
                const pct = course.progress ?? 0
                return (
                  <Link key={course.id} href={`/courses/${course.id}`}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#1A1A1F] transition-colors group">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#1A1A1F] border border-[#27272A] text-base-500">
                      {course.thumbnail === 'python' ? <Code2 className="w-5 h-5" /> :
                       course.thumbnail === 'web' ? <Globe className="w-5 h-5" /> :
                       course.thumbnail === 'database' ? <Database className="w-5 h-5" /> :
                       course.thumbnail === 'network' ? <Network className="w-5 h-5" /> :
                       course.thumbnail === 'algo' ? <GitBranch className="w-5 h-5" /> :
                       course.thumbnail === 'security' ? <Shield className="w-5 h-5" /> :
                       <BookOpen className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-base-200 group-hover:text-base-100 truncate">{course.title}</div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="progress-bar flex-1">
                          <div className="progress-fill" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-base-500 flex-shrink-0">{pct}%</span>
                      </div>
                      <div className="text-xs text-base-600 mt-0.5">{course.completedLessons}/{course.lessons} dars</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-base-700 group-hover:text-base-400 transition-colors" />
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Activity Chart */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">Haftalik Faollik</h2>
              <div className="badge bg-base-800 text-base-400 border border-base-700">
                <BarChart3 className="w-3 h-3" />
                Bu hafta
              </div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={weekly || []}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#52525B' }} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="minutes" stroke="#7C3AED" strokeWidth={2} fill="url(#areaGrad)" dot={{ fill: '#7C3AED', r: 3, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Today + AI + Achievements */}
        <div className="space-y-5">

          {/* Today's Tasks */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">Bugungi Vazifalar</h2>
              <span className="text-xs text-base-500">{completedTasks}/{tasks.length}</span>
            </div>
            <div className="space-y-2">
              {tasks.length === 0 && (
                <p className="text-xs text-base-600 text-center py-3">Kutilayotgan topshiriqlar yo'q</p>
              )}
              {tasks.map((task) => (
                <button key={task.id} onClick={() => toggleTask(task.id)}
                  className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#1A1A1F] transition-colors text-left group">
                  {task.done
                    ? <CheckCircle2 className="w-4 h-4 text-base-400 flex-shrink-0 mt-0.5" />
                    : <Circle className="w-4 h-4 text-base-600 flex-shrink-0 mt-0.5 group-hover:text-base-400" />
                  }
                  <div className="flex-1 min-w-0">
                    <span className={`text-xs leading-relaxed ${task.done ? 'line-through text-base-600' : 'text-base-300'}`}>
                      {task.text}
                    </span>
                    <div className="text-xs text-amber-500 mt-0.5">+{task.xp} XP</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* AI Tip */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#1A1A1F] border border-[#27272A] flex items-center justify-center">
                <Brain className="w-4 h-4 text-base-500" />
              </div>
              <div>
                <div className="text-xs font-semibold text-base-200">AI Tavsiyasi</div>
                <div className="text-xs text-base-600">Shaxsiy</div>
              </div>
            </div>
            <p className="text-xs text-base-400 leading-relaxed mb-3">{aiTip}</p>
            <Link href="/ai" className="text-xs text-accent-400 hover:text-accent-300 flex items-center gap-1">
              AI bilan suhbat <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Recent Achievements */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">So'nggi Yutuqlar</h2>
              <Link href="/portfolio" className="text-xs text-accent-400 hover:text-accent-300">
                Barchasi
              </Link>
            </div>
            <div className="space-y-2">
              {earnedAchievements.slice(0, 4).map((ach: any) => (
                <div key={ach.id} className="flex items-center gap-3 p-2 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-[#1A1A1F] border border-[#27272A] flex items-center justify-center flex-shrink-0">
                    <AchIcon icon={ach.icon} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-base-200">{ach.title}</div>
                    <div className="text-xs text-base-600">{ach.description}</div>
                  </div>
                  <div className="text-xs text-amber-400">+{ach.xpReward}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-base-500" />
              <h2 className="section-title">Yaqin Muddatlar</h2>
            </div>
            <div className="space-y-2">
              {(assignments || []).filter((a: any) => a.status === 'pending').slice(0, 3).map((a: any) => (
                <div key={a.id} className="flex items-center justify-between p-2.5 rounded-xl bg-[#1A1A1F]">
                  <div>
                    <div className="text-xs font-medium text-base-200 line-clamp-1">{a.title}</div>
                    <div className="text-xs text-base-600">{a.course}</div>
                  </div>
                  <div className="text-xs text-amber-400 flex-shrink-0 ml-2">{formatDate(a.dueDate)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
