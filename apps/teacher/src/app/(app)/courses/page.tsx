'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { ElementType } from 'react'
import { Plus, Users, Star, MoreVertical, Edit, Copy, Trash2, Eye, BookOpen, Clock, Cpu, FileText, Code2, Network, Database, Globe } from 'lucide-react'
import { useState } from 'react'
import { api } from '@/lib/api'
import { useApi } from '@/lib/useApi'
import { getDifficultyColor, getDifficultyLabel } from '@/lib/utils'

const THUMB_MAP: Record<string, { icon: ElementType; color: string }> = {
  computer: { icon: Cpu, color: 'from-[#1E1E24] to-[#141418]' },
  files: { icon: FileText, color: 'from-[#1E1E24] to-[#141418]' },
  algo: { icon: Code2, color: 'from-[#1E1E24] to-[#141418]' },
  network: { icon: Network, color: 'from-[#1E1E24] to-[#141418]' },
  database: { icon: Database, color: 'from-[#1E1E24] to-[#141418]' },
  web: { icon: Globe, color: 'from-[#1E1E24] to-[#141418]' },
}

export default function TeacherCoursesPage() {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState<string | null>(null)
  const { data, refetch } = useApi(() => api.myCourses())
  const myCourses: any[] = data || []

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`"${title}" kursini o'chirishni tasdiqlaysizmi?`)) return
    try { await api.deleteCourse(id); refetch() } catch (e: any) { alert(e.message) }
    setMenuOpen(null)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-base-100">Mening Kurslarim</h1>
          <p className="text-sm text-base-500 mt-1">{myCourses.length} ta faol kurs</p>
        </div>
        <Link href="/create-course" className="btn-primary bg-sky-600 hover:bg-sky-700 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Yangi Kurs
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="text-xs text-base-500 uppercase tracking-wider mb-2">Jami Kurslar</div>
          <div className="text-2xl font-bold text-base-100">{myCourses.length}</div>
        </div>
        <div className="stat-card">
          <div className="text-xs text-base-500 uppercase tracking-wider mb-2">Jami O'quvchilar</div>
          <div className="text-2xl font-bold text-base-100">{myCourses.reduce((s, c) => s + c.enrolled, 0)}</div>
        </div>
        <div className="stat-card">
          <div className="text-xs text-base-500 uppercase tracking-wider mb-2">Jami Darslar</div>
          <div className="text-2xl font-bold text-base-100">{myCourses.reduce((s, c) => s + c.lessons, 0)}</div>
        </div>
        <div className="stat-card">
          <div className="text-xs text-base-500 uppercase tracking-wider mb-2">O'rtacha Reyting</div>
          <div className="text-2xl font-bold text-amber-400">
            {myCourses.length > 0
              ? (myCourses.reduce((s, c) => s + (c.rating || 0), 0) / myCourses.length).toFixed(1)
              : '—'}★
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {myCourses.map((course: any) => {
          const thumb = THUMB_MAP[course.thumbnail] || { icon: BookOpen, color: 'from-base-700 to-base-600' }
          return (
            <div key={course.id}
              onClick={() => router.push(`/courses/${course.id}`)}
              className="card hover:border-sky-600/40 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden relative group cursor-pointer">
              {/* Menu */}
              <button onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === course.id ? null : course.id) }}
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-lg bg-black/40 backdrop-blur-sm hover:bg-black/60 flex items-center justify-center">
                <MoreVertical className="w-4 h-4 text-white" />
              </button>
              {menuOpen === course.id && (
                <div onClick={(e) => e.stopPropagation()}
                  className="absolute top-12 right-3 z-20 w-48 card-elevated shadow-card-hover py-1 animate-slide-up">
                  {[
                    { icon: Eye, label: "Ko'rish", color: 'text-base-300', action: () => { setMenuOpen(null); router.push(`/courses/${course.id}`) } },
                    { icon: Edit, label: 'Tahrirlash', color: 'text-base-300', action: () => { setMenuOpen(null); router.push(`/courses/${course.id}`) } },
                    { icon: Copy, label: 'Nusxalash', color: 'text-base-300', action: () => setMenuOpen(null) },
                    { icon: Trash2, label: "O'chirish", color: 'text-rose-400', action: () => handleDelete(course.id, course.title) },
                  ].map((a) => (
                    <button key={a.label} onClick={a.action}
                      className={`w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:bg-[#222229] ${a.color}`}>
                      <a.icon className="w-3.5 h-3.5" /> {a.label}
                    </button>
                  ))}
                </div>
              )}

              <div className={`h-32 bg-gradient-to-br ${thumb.color} flex items-center justify-center relative border-b border-[#27272A]`}>
                <thumb.icon className="w-12 h-12 text-base-600" />
              </div>

              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="badge bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs">
                    {course.category}
                  </span>
                  <span className={`text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
                    {getDifficultyLabel(course.difficulty)}
                  </span>
                </div>

                <Link href={`/courses/${course.id}`} className="block">
                  <h3 className="font-semibold text-base-100 mb-2 line-clamp-1 group-hover:text-sky-400 transition-colors">{course.title}</h3>
                </Link>
                <p className="text-xs text-base-500 leading-relaxed mb-4 line-clamp-2">{course.description}</p>

                <div className="flex items-center justify-between text-xs text-base-600 pb-4 border-b border-[#1E1E24]">
                  <div className="flex items-center gap-1"><Users className="w-3 h-3" />{course.enrolled}</div>
                  <div className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{course.lessons} dars</div>
                  <div className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.duration}</div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-base-500" />
                    <span className="text-xs text-base-400 font-medium">{course.rating}</span>
                    <span className="text-xs text-base-600">({course.enrolled} baho)</span>
                  </div>
                  <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <Link href={`/courses/${course.id}`} className="btn-ghost p-1.5 border border-[#27272A]" title="Ichiga kirish">
                      <Eye className="w-3.5 h-3.5" />
                    </Link>
                    <Link href={`/courses/${course.id}`} className="btn-ghost p-1.5 border border-[#27272A]" title="Dars qo'shish">
                      <Edit className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {/* Create new card */}
        <Link href="/create-course"
          className="card p-8 flex flex-col items-center justify-center text-center border-dashed border-[#27272A] hover:border-sky-600/40 transition-colors min-h-[320px]">
          <div className="w-12 h-12 rounded-2xl bg-sky-600/10 border border-sky-600/20 flex items-center justify-center mb-3">
            <Plus className="w-6 h-6 text-sky-400" />
          </div>
          <p className="text-sm font-medium text-base-300">Yangi Kurs Yaratish</p>
          <p className="text-xs text-base-600 mt-1">O'quvchilar uchun yangi kontent</p>
        </Link>
      </div>
    </div>
  )
}
