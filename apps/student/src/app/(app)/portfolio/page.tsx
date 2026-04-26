'use client'
import { useState } from 'react'
import type { ElementType } from 'react'
import {
  Award, Star, Lock, Download, Share2, Trophy, Flame, Code2, BookOpen, Zap,
  Rocket, CheckCircle, Wrench, Bot, GraduationCap, Database, Network, GitBranch, Shield
} from 'lucide-react'
import { useAuthStore } from '@/lib/store'
import { api } from '@/lib/api'
import { useApi } from '@/lib/useApi'
import { getLevelFromXP, getRankLabel } from '@/lib/utils'

const ACH_ICONS: Record<string, ElementType> = {
  rocket: Rocket, fire: Flame, bolt: Zap, code: Code2, check: CheckCircle,
  hammer: Wrench, bot: Bot, percent: Award, book: BookOpen, graduation: GraduationCap,
  trophy: Trophy, star: Star,
}
function AchIcon({ icon, className }: { icon: string; className?: string }) {
  const Icon = ACH_ICONS[icon] || Award
  return <Icon className={className || 'w-5 h-5 text-base-500'} />
}

const CERTIFICATES = [
  { id: 'cert-1', title: 'Python Dasturlash Asoslari', date: '2025-03-15', score: 94, color: 'from-blue-700 to-cyan-700' },
  { id: 'cert-2', title: 'Web Dasturlash: HTML & CSS', date: '2025-01-20', score: 88, color: 'from-orange-700 to-amber-700' },
]

const PROJECTS = [
  { id: 'p-1', title: 'Kalkulyator Ilovasi', desc: 'Python bilan yaratilgan konsol kalkulyator. OOP prinsiplariga asoslanadi.', lang: 'Python', stars: 12, color: 'text-blue-400', date: '2026-03-10' },
  { id: 'p-2', title: 'Portfolio Sayti', desc: 'HTML, CSS va JavaScript bilan yaratilgan responsive portfolio sayti.', lang: 'HTML/CSS/JS', stars: 8, color: 'text-orange-400', date: '2026-02-20' },
  { id: 'p-3', title: 'Talabalar DB', desc: 'PostgreSQL da talabalar ma\'lumotlar bazasi. Murakkab SQL so\'rovlar.', lang: 'SQL', stars: 5, color: 'text-emerald-400', date: '2026-01-15' },
]

export default function PortfolioPage() {
  const { user } = useAuthStore()
  const [tab, setTab] = useState<'achievements' | 'certificates' | 'projects'>('achievements')

  const { data: achievements } = useApi(() => api.achievements())
  const { data: courses } = useApi(() => api.myCourses())

  if (!user) return null

  const { level } = getLevelFromXP(user.xp)
  const achList: any[] = achievements || []
  const earned = achList.filter(a => a.earned)
  const notEarned = achList.filter(a => !a.earned)
  const completedCourses = (courses || []).filter((c: any) => (c.progress ?? 0) >= 100).length

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Profile Card */}
      <div className="card p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-600/8 to-transparent" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-600/30 to-accent-600/10 border-2 border-accent-600/40 flex items-center justify-center text-2xl font-bold text-accent-400">
              {user.avatar}
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-amber-500 border-2 border-base-950 flex items-center justify-center text-xs font-bold text-black">
              {level}
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-base-100">{user.name}</h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="badge-accent">{getRankLabel(level)}</span>
              <span className="badge bg-base-800 text-base-400 border border-base-700">
                <Star className="w-3 h-3 text-base-500" />{user.xp.toLocaleString()} XP
              </span>
              <span className="badge bg-base-800 text-base-400 border border-base-700">
                <Flame className="w-3 h-3 text-base-500" />{user.streak} kunlik seriya
              </span>
            </div>
            <div className="flex items-center gap-4 mt-3 text-sm text-base-500">
              <span><strong className="text-base-200">{earned.length}</strong> nishon</span>
              <span><strong className="text-base-200">{completedCourses}</strong> kurs tugatdi</span>
              <span><strong className="text-base-200">{CERTIFICATES.length}</strong> sertifikat</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary flex items-center gap-2 text-xs py-2 px-3">
              <Share2 className="w-3.5 h-3.5" /> Ulashish
            </button>
            <button className="btn-secondary flex items-center gap-2 text-xs py-2 px-3">
              <Download className="w-3.5 h-3.5" /> Yuklab olish
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="relative grid grid-cols-4 gap-3 mt-5 pt-5 border-t border-[#1E1E24]">
          {[
            { label: 'Daraja', value: level, icon: Trophy },
            { label: 'Jami XP', value: user.xp.toLocaleString(), icon: Zap },
            { label: 'Kurslar', value: (courses || []).filter((c: any) => (c.progress ?? 0) > 0).length, icon: BookOpen },
            { label: 'Loyihalar', value: PROJECTS.length, icon: Code2 },
          ].map(s => (
            <div key={s.label} className="text-center">
              <s.icon className="w-5 h-5 text-base-500 mx-auto mb-1" />
              <div className="text-xl font-bold text-base-100">{s.value}</div>
              <div className="text-xs text-base-600">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[#111113] border border-[#1E1E24] rounded-xl w-fit">
        {[
          { id: 'achievements', label: `Yutuqlar (${earned.length})` },
          { id: 'certificates', label: 'Sertifikatlar' },
          { id: 'projects', label: 'Loyihalar' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as any)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${tab === t.id ? 'bg-[#1A1A1F] text-base-100 shadow-card' : 'text-base-500 hover:text-base-300'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Achievements */}
      {tab === 'achievements' && (
        <div className="space-y-5">
          <div>
            <h2 className="section-title mb-3">Olgan Yutuqlar ({earned.length})</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {earned.map((ach) => (
                <div key={ach.id} className="card p-4 flex items-start gap-3 hover:border-accent-600/30 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-[#1A1A1F] border border-[#27272A] flex items-center justify-center flex-shrink-0">
                    <AchIcon icon={ach.icon} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-base-100">{ach.title}</div>
                    <div className="text-xs text-base-500 mt-0.5">{ach.description}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="badge-amber text-xs">+{ach.xpReward} XP</div>
                      {ach.earnedAt && <span className="text-xs text-base-700">{ach.earnedAt}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="section-title mb-3 text-base-600">Qo'lga Kiritilmagan ({notEarned.length})</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {notEarned.map((ach) => (
                <div key={ach.id} className="card p-4 flex items-start gap-3 opacity-40">
                  <div className="w-10 h-10 rounded-xl bg-base-700/30 border border-base-700/30 flex items-center justify-center flex-shrink-0">
                    <AchIcon icon={ach.icon} className="w-6 h-6 text-base-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <div className="font-semibold text-sm text-base-500">{ach.title}</div>
                      <Lock className="w-3 h-3 text-base-700" />
                    </div>
                    <div className="text-xs text-base-600">{ach.description}</div>
                    <div className="badge-amber text-xs mt-2 opacity-60">+{ach.xpReward} XP</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Certificates */}
      {tab === 'certificates' && (
        <div className="grid md:grid-cols-2 gap-5">
          {CERTIFICATES.map((cert) => (
            <div key={cert.id} className="card overflow-hidden">
              <div className={`h-28 bg-gradient-to-br ${cert.color} relative flex flex-col items-center justify-center`}>
                <div className="absolute inset-0 bg-black/20" />
                <Award className="w-10 h-10 text-white/80 relative" />
                <div className="text-xs text-white/60 mt-1 relative">Sertifikat</div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-base-100 mb-2">{cert.title}</h3>
                <div className="flex items-center justify-between text-xs text-base-500 mb-4">
                  <span>Sana: {cert.date}</span>
                  <span className={`font-bold text-sm ${cert.score >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {cert.score}/100
                  </span>
                </div>
                <button className="btn-secondary w-full text-xs py-2 flex items-center justify-center gap-2">
                  <Download className="w-3.5 h-3.5" /> Yuklab olish (PDF)
                </button>
              </div>
            </div>
          ))}
          <div className="card p-8 flex flex-col items-center justify-center text-center border-dashed border-[#27272A] hover:border-accent-600/30 transition-colors">
            <Award className="w-10 h-10 text-base-700 mb-3" />
            <p className="text-sm text-base-600">Kurslarni tugatib yangi sertifikat oling</p>
          </div>
        </div>
      )}

      {/* Projects */}
      {tab === 'projects' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROJECTS.map((proj) => (
            <div key={proj.id} className="card p-5 hover:border-[#3F3F46] transition-all group">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className={`text-xs font-medium px-2 py-1 rounded-lg bg-[#1A1A1F] border border-[#27272A] ${proj.color}`}>
                  {proj.lang}
                </div>
                <div className="flex items-center gap-1 text-xs text-amber-400">
                  <Star className="w-3 h-3 fill-current" /> {proj.stars}
                </div>
              </div>
              <h3 className="font-semibold text-base-100 mb-2 group-hover:text-accent-400 transition-colors">{proj.title}</h3>
              <p className="text-xs text-base-500 leading-relaxed mb-4">{proj.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-base-700">{proj.date}</span>
                <button className="text-xs text-accent-400 hover:text-accent-300 transition-colors flex items-center gap-1">
                  Ko'rish <Code2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
          <div className="card p-5 flex flex-col items-center justify-center text-center border-dashed border-[#27272A] hover:border-accent-600/30 transition-colors cursor-pointer min-h-[160px]">
            <Code2 className="w-8 h-8 text-base-700 mb-2" />
            <p className="text-xs text-base-600">Yangi loyiha qo'shish</p>
          </div>
        </div>
      )}
    </div>
  )
}

