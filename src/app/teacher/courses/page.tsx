'use client'
import Link from 'next/link'
import { Plus, Users, Star, MoreVertical, Edit, Copy, Trash2, Eye, BookOpen, Clock } from 'lucide-react'
import { useState } from 'react'
import { COURSES } from '@/lib/data'
import { getDifficultyColor, getDifficultyLabel } from '@/lib/utils'

const THUMB_MAP: Record<string, { emoji: string; color: string }> = {
  python: { emoji: '🐍', color: 'from-blue-700 to-cyan-700' },
  web: { emoji: '🌐', color: 'from-orange-700 to-amber-700' },
  database: { emoji: '🗄️', color: 'from-emerald-700 to-teal-700' },
  network: { emoji: '🔗', color: 'from-violet-700 to-purple-700' },
  algo: { emoji: '🧠', color: 'from-rose-700 to-pink-700' },
  security: { emoji: '🔒', color: 'from-slate-700 to-zinc-700' },
}

export default function TeacherCoursesPage() {
  const [menuOpen, setMenuOpen] = useState<string | null>(null)
  const myCourses = COURSES.slice(0, 4)

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-base-100">Mening Kurslarim</h1>
          <p className="text-sm text-base-500 mt-1">{myCourses.length} ta faol kurs</p>
        </div>
        <Link href="/teacher/create-course" className="btn-primary bg-sky-600 hover:bg-sky-700 flex items-center gap-2">
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
          <div className="text-xs text-base-500 uppercase tracking-wider mb-2">Jami Talabalar</div>
          <div className="text-2xl font-bold text-base-100">{myCourses.reduce((s, c) => s + c.enrolled, 0)}</div>
        </div>
        <div className="stat-card">
          <div className="text-xs text-base-500 uppercase tracking-wider mb-2">Jami Darslar</div>
          <div className="text-2xl font-bold text-base-100">{myCourses.reduce((s, c) => s + c.lessons, 0)}</div>
        </div>
        <div className="stat-card">
          <div className="text-xs text-base-500 uppercase tracking-wider mb-2">O'rtacha Reyting</div>
          <div className="text-2xl font-bold text-amber-400">
            {(myCourses.reduce((s, c) => s + c.rating, 0) / myCourses.length).toFixed(1)}★
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {myCourses.map((course) => {
          const thumb = THUMB_MAP[course.thumbnail] || { emoji: '📚', color: 'from-base-700 to-base-600' }
          return (
            <div key={course.id} className="card hover:border-sky-600/30 transition-all duration-300 overflow-hidden relative">
              {/* Menu */}
              <button onClick={() => setMenuOpen(menuOpen === course.id ? null : course.id)}
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-lg bg-black/40 backdrop-blur-sm hover:bg-black/60 flex items-center justify-center">
                <MoreVertical className="w-4 h-4 text-white" />
              </button>
              {menuOpen === course.id && (
                <div className="absolute top-12 right-3 z-20 w-48 card-elevated shadow-card-hover py-1 animate-slide-up">
                  {[
                    { icon: Eye, label: 'Ko\'rish', color: 'text-base-300' },
                    { icon: Edit, label: 'Tahrirlash', color: 'text-base-300' },
                    { icon: Copy, label: 'Nusxalash', color: 'text-base-300' },
                    { icon: Trash2, label: 'O\'chirish', color: 'text-rose-400' },
                  ].map((a) => (
                    <button key={a.label} className={`w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:bg-[#222229] ${a.color}`}>
                      <a.icon className="w-3.5 h-3.5" /> {a.label}
                    </button>
                  ))}
                </div>
              )}

              <div className={`h-32 bg-gradient-to-br ${thumb.color} flex items-center justify-center text-4xl relative`}>
                <span>{thumb.emoji}</span>
                <div className="absolute inset-0 bg-black/20" />
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

                <h3 className="font-semibold text-base-100 mb-2 line-clamp-1">{course.title}</h3>
                <p className="text-xs text-base-500 leading-relaxed mb-4 line-clamp-2">{course.description}</p>

                <div className="flex items-center justify-between text-xs text-base-600 pb-4 border-b border-[#1E1E24]">
                  <div className="flex items-center gap-1"><Users className="w-3 h-3" />{course.enrolled}</div>
                  <div className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{course.lessons} dars</div>
                  <div className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.duration}</div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs text-amber-400 font-medium">{course.rating}</span>
                    <span className="text-xs text-base-600">({course.enrolled} baho)</span>
                  </div>
                  <div className="flex gap-1.5">
                    <button className="btn-ghost p-1.5 border border-[#27272A]"><Eye className="w-3.5 h-3.5" /></button>
                    <button className="btn-ghost p-1.5 border border-[#27272A]"><Edit className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {/* Create new card */}
        <Link href="/teacher/create-course"
          className="card p-8 flex flex-col items-center justify-center text-center border-dashed border-[#27272A] hover:border-sky-600/40 transition-colors min-h-[320px]">
          <div className="w-12 h-12 rounded-2xl bg-sky-600/10 border border-sky-600/20 flex items-center justify-center mb-3">
            <Plus className="w-6 h-6 text-sky-400" />
          </div>
          <p className="text-sm font-medium text-base-300">Yangi Kurs Yaratish</p>
          <p className="text-xs text-base-600 mt-1">Talabalar uchun yangi kontent</p>
        </Link>
      </div>
    </div>
  )
}
