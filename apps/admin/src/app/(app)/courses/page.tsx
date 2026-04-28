'use client'
import { useState } from 'react'
import { Search, BookOpen, Users, Star, Eye, Edit, Trash2, Plus } from 'lucide-react'
import { api } from '@/lib/api'
import { useApi } from '@/lib/useApi'
import { getDifficultyColor, getDifficultyLabel } from '@/lib/utils'

export default function AdminCoursesPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [deleting, setDeleting] = useState<string | null>(null)

  const { data, refetch } = useApi(() => api.courses())
  const courses: any[] = data || []

  const filtered = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) &&
    (category === 'all' || c.category === category)
  )

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`"${title}" kursini o'chirishni tasdiqlaysizmi?`)) return
    setDeleting(id)
    try { await api.deleteCourse(id); refetch() } catch (e: any) { alert(e.message) }
    setDeleting(null)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-base-100">Kurslarni Boshqarish</h1>
          <p className="text-sm text-base-500 mt-1">{courses.length} ta kurs tizimda</p>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-base-600" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            className="input pl-10" placeholder="Kurs qidirish..." />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="input w-auto">
          <option value="all">Barcha kategoriyalar</option>
          <option value="Dasturlash">Dasturlash</option>
          <option value="Web">Web</option>
          <option value="Database">Database</option>
          <option value="Tarmoq">Tarmoq</option>
          <option value="Security">Xavfsizlik</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1E1E24] bg-[#0D0D10]">
                <th className="text-left px-4 py-3 text-xs text-base-500 uppercase tracking-wider font-medium">Kurs</th>
                <th className="text-left px-4 py-3 text-xs text-base-500 uppercase tracking-wider font-medium">Kategoriya</th>
                <th className="text-left px-4 py-3 text-xs text-base-500 uppercase tracking-wider font-medium">Qiyinlik</th>
                <th className="text-left px-4 py-3 text-xs text-base-500 uppercase tracking-wider font-medium">O'qituvchi</th>
                <th className="text-left px-4 py-3 text-xs text-base-500 uppercase tracking-wider font-medium">Talabalar</th>
                <th className="text-left px-4 py-3 text-xs text-base-500 uppercase tracking-wider font-medium">Reyting</th>
                <th className="text-right px-4 py-3 text-xs text-base-500 uppercase tracking-wider font-medium">Amal</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c: any) => (
                <tr key={c.id} className="border-b border-[#1E1E24] hover:bg-[#1A1A1F]/50">
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-base-200 line-clamp-1">{c.title}</div>
                    <div className="text-xs text-base-600">{c.lessons} dars · {c.duration}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="badge bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs">{c.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium ${getDifficultyColor(c.difficulty)}`}>
                      {getDifficultyLabel(c.difficulty)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-xs font-bold text-sky-400">
                        {c.instructorAvatar}
                      </div>
                      <span className="text-xs text-base-400">{c.instructor}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-sm text-base-300">
                      <Users className="w-3 h-3 text-base-500" /> {c.enrolled}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-amber-400 font-medium">{c.rating}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-[#222229] text-base-500 hover:text-base-200"><Eye className="w-4 h-4" /></button>
                      <button className="p-1.5 rounded-lg hover:bg-[#222229] text-base-500 hover:text-base-200"><Edit className="w-4 h-4" /></button>
                      <button
                        onClick={() => handleDelete(c.id, c.title)}
                        disabled={deleting === c.id}
                        className="p-1.5 rounded-lg hover:bg-rose-500/10 text-base-500 hover:text-rose-400 disabled:opacity-50">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
