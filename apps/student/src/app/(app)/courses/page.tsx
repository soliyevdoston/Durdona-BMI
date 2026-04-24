'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Search, BookOpen, Users, Star, Clock, ChevronRight, Play } from 'lucide-react'
import { api } from '@/lib/api'
import { useApi } from '@/lib/useApi'
import { getDifficultyColor, getDifficultyLabel } from '@/lib/utils'

const CATEGORIES = ['Barchasi', 'Dasturlash', 'Web', 'Database', 'Tarmoq', 'Security']

const THUMBNAIL_MAP: Record<string, { emoji: string; color: string }> = {
  python: { emoji: '🐍', color: 'from-blue-700 to-cyan-700' },
  web: { emoji: '🌐', color: 'from-orange-700 to-amber-700' },
  database: { emoji: '🗄️', color: 'from-emerald-700 to-teal-700' },
  network: { emoji: '🔗', color: 'from-violet-700 to-purple-700' },
  algo: { emoji: '🧠', color: 'from-rose-700 to-pink-700' },
  security: { emoji: '🔒', color: 'from-slate-700 to-zinc-700' },
}

export default function CoursesPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Barchasi')
  const [filter, setFilter] = useState<'all' | 'enrolled' | 'available'>('all')

  const { data: courses, loading } = useApi(() => api.courses())

  const filtered = (courses || []).filter((c: any) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      (c.tags || []).some((t: string) => t.toLowerCase().includes(search.toLowerCase()))
    const matchCat = category === 'Barchasi' || c.category === category
    const matchFilter = filter === 'all' || (filter === 'enrolled' && (c.progress ?? 0) > 0) || (filter === 'available' && (c.progress ?? 0) === 0)
    return matchSearch && matchCat && matchFilter
  })

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-base-100">Kurslar Katalogi</h1>
        <p className="text-sm text-base-500 mt-1">AKT sohasidagi barcha yo'nalishlarni o'rganing</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-base-600" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            className="input pl-10" placeholder="Kurs yoki teglar bo'yicha qidirish..." />
        </div>
        <div className="flex gap-2">
          {(['all', 'enrolled', 'available'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${filter === f ? 'bg-accent-600 text-white border-accent-600' : 'bg-[#1A1A1F] text-base-400 border-[#27272A] hover:text-base-200'}`}>
              {f === 'all' ? 'Barchasi' : f === 'enrolled' ? 'Yozilganlar' : 'Mavjud'}
            </button>
          ))}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${category === cat ? 'bg-accent-600/20 text-accent-400 border border-accent-600/30' : 'text-base-500 hover:text-base-300'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Count */}
      <div className="text-sm text-base-500">
        {loading ? 'Yuklanmoqda...' : `${filtered.length} kurs topildi`}
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((course: any) => {
          const thumb = THUMBNAIL_MAP[course.thumbnail] || { emoji: '📚', color: 'from-base-700 to-base-600' }
          const enrolled = (course.progress ?? 0) > 0
          return (
            <Link key={course.id} href={`/courses/${course.id}`}
              className="card hover:border-[#3F3F46] transition-all duration-300 group overflow-hidden block">
              {/* Thumbnail */}
              <div className={`h-36 bg-gradient-to-br ${thumb.color} flex items-center justify-center text-5xl relative`}>
                <span>{thumb.emoji}</span>
                <div className="absolute inset-0 bg-black/20" />
                {enrolled && (
                  <div className="absolute top-3 right-3 badge-emerald text-xs">
                    Yozilgan
                  </div>
                )}
              </div>

              <div className="p-5">
                {/* Tags */}
                <div className="flex gap-1.5 mb-3 flex-wrap">
                  {(course.tags || []).slice(0, 3).map((tag: string) => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-[#1A1A1F] text-base-500 border border-[#27272A]">{tag}</span>
                  ))}
                </div>

                <h3 className="font-semibold text-base-100 group-hover:text-accent-400 transition-colors mb-2">{course.title}</h3>
                <p className="text-xs text-base-500 leading-relaxed mb-4 line-clamp-2">{course.description}</p>

                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-base-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />{course.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />{course.lessons} dars
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />{course.enrolled}
                  </div>
                </div>

                {/* Rating & Difficulty */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs text-amber-400 font-medium">{course.rating}</span>
                  </div>
                  <span className={`text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
                    {getDifficultyLabel(course.difficulty)}
                  </span>
                </div>

                {/* Progress / Instructor */}
                <div className="border-t border-[#1E1E24] pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-accent-600/20 border border-accent-600/30 flex items-center justify-center text-xs font-bold text-accent-400">
                        {course.instructorAvatar}
                      </div>
                      <span className="text-xs text-base-500">{course.instructor}</span>
                    </div>
                    {enrolled ? (
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-base-500">{course.progress}%</div>
                        <Play className="w-4 h-4 text-accent-400" />
                      </div>
                    ) : (
                      <ChevronRight className="w-4 h-4 text-base-600 group-hover:text-accent-400 transition-colors" />
                    )}
                  </div>
                  {enrolled && (
                    <div className="progress-bar mt-2.5">
                      <div className="progress-fill" style={{ width: `${course.progress}%` }} />
                    </div>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
