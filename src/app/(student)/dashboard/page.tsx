'use client'
import { useState } from 'react'
import Link from 'next/link'
import {
  Flame, Star, Target, TrendingUp, Clock, Code2,
  ChevronRight, Brain, BookOpen, CheckCircle2, Circle,
  Zap, Trophy, ArrowRight, BarChart3, Calendar
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts'
import { useAuthStore } from '@/lib/store'
import { COURSES, ASSIGNMENTS, ACHIEVEMENTS, ANALYTICS_DATA, AI_SUGGESTIONS } from '@/lib/data'
import { getLevelFromXP, getRankLabel, getDifficultyColor, getDifficultyLabel, formatDate } from '@/lib/utils'

const TODAY_TASKS = [
  { id: 1, text: 'Python: Sikllar darsini tugatish', done: false, xp: 25, type: 'lesson' },
  { id: 2, text: 'Kalkulyator topshirig\'ini topshirish', done: false, xp: 50, type: 'assignment' },
  { id: 3, text: 'Web dasturlash: 3 darsni ko\'rish', done: true, xp: 30, type: 'lesson' },
  { id: 4, text: 'SQL testidan o\'tish', done: true, xp: 40, type: 'quiz' },
]

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
  const [tasks, setTasks] = useState(TODAY_TASKS)
  if (!user) return null

  const { level, current, required } = getLevelFromXP(user.xp)
  const xpProgress = Math.round((current / required) * 100)
  const activeCourses = COURSES.filter(c => (c.progress ?? 0) > 0)
  const pendingAssignments = ASSIGNMENTS.filter(a => a.status === 'pending')
  const earnedAchievements = ACHIEVEMENTS.filter(a => a.earned)
  const completedTasks = tasks.filter(t => t.done).length
  const todayXP = tasks.filter(t => t.done).reduce((sum, t) => sum + t.xp, 0)
  const aiTip = AI_SUGGESTIONS[0]

  const toggleTask = (id: number) => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">

      {/* Welcome Banner */}
      <div className="relative card overflow-hidden p-6">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-600/10 via-transparent to-transparent" />
        <div className="absolute right-0 top-0 w-64 h-full opacity-5">
          <div className="absolute right-8 top-8 w-40 h-40 bg-accent-500 rounded-full blur-2xl" />
        </div>
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-base-500 text-sm mb-1">Xush kelibsiz,</p>
            <h1 className="text-2xl font-bold text-base-100">{user.name.split(' ')[0]} 👋</h1>
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1.5 badge-accent">
                <Flame className="w-3.5 h-3.5" />
                {user.streak} kunlik seriya
              </div>
              <div className="flex items-center gap-1.5 badge bg-base-800 text-base-400 border border-base-700">
                <Star className="w-3.5 h-3.5 text-amber-400" />
                {getRankLabel(level)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-400">{level}</div>
              <div className="text-xs text-base-500">Daraja</div>
            </div>
            <div className="w-px h-10 bg-[#27272A]" />
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-400">{user.xp.toLocaleString()}</div>
              <div className="text-xs text-base-500">XP</div>
            </div>
            <div className="w-px h-10 bg-[#27272A]" />
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400">{todayXP}</div>
              <div className="text-xs text-base-500">Bugungi XP</div>
            </div>
          </div>
        </div>
        {/* XP Progress */}
        <div className="mt-4 relative">
          <div className="flex justify-between text-xs text-base-600 mb-1.5">
            <span>Daraja {level} → {level + 1}</span>
            <span>{current}/{required} XP</span>
          </div>
          <div className="progress-bar h-2">
            <div className="progress-fill h-2" style={{ width: `${xpProgress}%` }} />
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-base-500 uppercase tracking-wider">Kurslar</span>
            <BookOpen className="w-4 h-4 text-accent-400" />
          </div>
          <div className="text-2xl font-bold text-base-100">{activeCourses.length}</div>
          <div className="text-xs text-base-500">Faol kurslar</div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-base-500 uppercase tracking-wider">Topshiriqlar</span>
            <Target className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-base-100">{pendingAssignments.length}</div>
          <div className="text-xs text-amber-500">Kutilmoqda</div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-base-500 uppercase tracking-wider">Yutuqlar</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-base-100">{earnedAchievements.length}/{ACHIEVEMENTS.length}</div>
          <div className="text-xs text-base-500">Nishonlar</div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-base-500 uppercase tracking-wider">Bugungi</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-base-100">{completedTasks}/{tasks.length}</div>
          <div className="text-xs text-emerald-500">Vazifalar bajarildi</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">

        {/* Left: Courses + Chart */}
        <div className="lg:col-span-2 space-y-5">

          {/* Active Courses */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">Faol Kurslar</h2>
              <Link href="/student/courses" className="text-xs text-accent-400 hover:text-accent-300 flex items-center gap-1">
                Barchasi <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {activeCourses.map((course) => {
                const pct = course.progress ?? 0
                return (
                  <Link key={course.id} href={`/student/courses/${course.id}`}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#1A1A1F] transition-colors group">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0
                      ${course.thumbnail === 'python' ? 'bg-blue-600/20 text-blue-400' :
                        course.thumbnail === 'web' ? 'bg-orange-600/20 text-orange-400' :
                        'bg-emerald-600/20 text-emerald-400'}`}>
                      {course.thumbnail === 'python' ? '🐍' : course.thumbnail === 'web' ? '🌐' : '🗄️'}
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
              <AreaChart data={ANALYTICS_DATA.weeklyActivity}>
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
              {tasks.map((task) => (
                <button key={task.id} onClick={() => toggleTask(task.id)}
                  className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#1A1A1F] transition-colors text-left group">
                  {task.done
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
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
          <div className="card p-5 border-accent-600/20">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-accent-600/20 flex items-center justify-center">
                <Brain className="w-4 h-4 text-accent-400" />
              </div>
              <div>
                <div className="text-xs font-semibold text-base-200">AI Tavsiyasi</div>
                <div className="text-xs text-base-600">Shaxsiy</div>
              </div>
            </div>
            <p className="text-xs text-base-400 leading-relaxed mb-3">{aiTip}</p>
            <Link href="/student/ai" className="text-xs text-accent-400 hover:text-accent-300 flex items-center gap-1">
              AI bilan suhbat <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Recent Achievements */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">So'nggi Yutuqlar</h2>
              <Link href="/student/portfolio" className="text-xs text-accent-400 hover:text-accent-300">
                Barchasi
              </Link>
            </div>
            <div className="space-y-2">
              {earnedAchievements.slice(0, 4).map((ach) => (
                <div key={ach.id} className="flex items-center gap-3 p-2 rounded-xl">
                  <span className="text-2xl">{ach.icon}</span>
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
              {ASSIGNMENTS.filter(a => a.status === 'pending').slice(0, 3).map((a) => (
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
