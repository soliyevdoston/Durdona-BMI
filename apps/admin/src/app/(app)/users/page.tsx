'use client'
import { useState } from 'react'
import {
  Search, MoreVertical, Edit, Trash2, Shield, ShieldCheck,
  UserPlus, Download, Users, GraduationCap, BookOpen, Crown, X, CheckCircle2
} from 'lucide-react'
import { api } from '@/lib/api'
import { useApi } from '@/lib/useApi'
import { formatDate } from '@/lib/utils'

const ROLE_CONFIG = {
  student: { label: "O'quvchi", color: 'badge-accent', Icon: GraduationCap },
  teacher: { label: "O'qituvchi", color: 'badge-sky', Icon: BookOpen },
  admin: { label: 'Admin', color: 'badge-emerald', Icon: ShieldCheck },
  super_admin: { label: 'Super Admin', color: 'badge bg-amber-500/10 text-amber-400 border border-amber-500/20', Icon: Crown },
}

function AddUserModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('student')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const handleSubmit = async () => {
    if (!name || !email || !password) { setError("Barcha maydonlar to'ldirilishi shart"); return }
    setLoading(true); setError(null)
    try {
      await api.createUser({ name, email, password, role })
      setDone(true)
      onSuccess()
    } catch (e: any) { setError(e.message) }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={!loading ? onClose : undefined} />
      <div className="relative w-full max-w-md card-elevated p-6 animate-slide-up">
        {done ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-7 h-7 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-base-100 mb-2">Yaratildi!</h2>
            <p className="text-sm text-base-500 mb-5">Foydalanuvchi muvaffaqiyatli qo'shildi.</p>
            <button onClick={onClose} className="btn-secondary w-full py-2.5">Yopish</button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-base-100">Yangi Foydalanuvchi</h2>
              <button onClick={onClose}><X className="w-5 h-5 text-base-500 hover:text-base-200" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-base-500 uppercase tracking-wider mb-2 block">To'liq Ism *</label>
                <input value={name} onChange={e => setName(e.target.value)} className="input" placeholder="Ism Familiya" />
              </div>
              <div>
                <label className="text-xs text-base-500 uppercase tracking-wider mb-2 block">Email *</label>
                <input value={email} onChange={e => setEmail(e.target.value)} className="input" type="email" placeholder="email@edu.uz" />
              </div>
              <div>
                <label className="text-xs text-base-500 uppercase tracking-wider mb-2 block">Rol</label>
                <select value={role} onChange={e => setRole(e.target.value)} className="input">
                  <option value="student">O'quvchi</option>
                  <option value="teacher">O'qituvchi</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-base-500 uppercase tracking-wider mb-2 block">Parol *</label>
                <input value={password} onChange={e => setPassword(e.target.value)} className="input" type="password" placeholder="Kamida 4 ta belgi" />
              </div>
            </div>
            {error && (
              <div className="mt-3 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2">{error}</div>
            )}
            <div className="flex gap-3 mt-6">
              <button onClick={onClose} disabled={loading} className="btn-secondary flex-1 py-2.5">Bekor</button>
              <button onClick={handleSubmit} disabled={loading}
                className="btn-primary bg-emerald-600 hover:bg-emerald-700 flex-1 py-2.5 flex items-center justify-center gap-2 disabled:opacity-70">
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <UserPlus className="w-4 h-4" />}
                {loading ? 'Yaratilmoqda...' : 'Yaratish'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'student' | 'teacher' | 'admin'>('all')
  const [menuOpen, setMenuOpen] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const { data, loading, refetch } = useApi(() => api.users())
  const ALL_USERS: any[] = (data || []).map((u: any) => ({
    ...u,
    lastSeen: u.lastActive || u.joinedAt,
  }))

  const filtered = ALL_USERS.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'all' || u.role === roleFilter
    return matchSearch && matchRole
  })

  const stats = {
    total: ALL_USERS.length,
    students: ALL_USERS.filter(u => u.role === 'student').length,
    teachers: ALL_USERS.filter(u => u.role === 'teacher').length,
    admins: ALL_USERS.filter(u => u.role === 'admin').length,
  }

  const handleDelete = async (userId: string, userName: string) => {
    if (!confirm(`"${userName}" ni o'chirishni tasdiqlaysizmi?`)) return
    setDeleting(userId)
    try {
      await api.deleteUser(userId)
      refetch()
    } catch (e: any) { alert(e.message) }
    setDeleting(null)
    setMenuOpen(null)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in" onClick={() => setMenuOpen(null)}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-base-100">Foydalanuvchilar</h1>
          <p className="text-sm text-base-500 mt-1">{stats.total} ta foydalanuvchi</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" /> Eksport
          </button>
          <button onClick={() => setShowAdd(true)}
            className="btn-primary bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2">
            <UserPlus className="w-4 h-4" /> Yangi Foydalanuvchi
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <Users className="w-4 h-4 text-accent-400 mb-2" />
          <div className="text-2xl font-bold text-base-100">{stats.total}</div>
          <div className="text-xs text-base-600">Jami</div>
        </div>
        <div className="stat-card">
          <GraduationCap className="w-4 h-4 text-accent-400 mb-2" />
          <div className="text-2xl font-bold text-accent-400">{stats.students}</div>
          <div className="text-xs text-base-600">O'quvchilar</div>
        </div>
        <div className="stat-card">
          <BookOpen className="w-4 h-4 text-sky-400 mb-2" />
          <div className="text-2xl font-bold text-sky-400">{stats.teachers}</div>
          <div className="text-xs text-base-600">O'qituvchilar</div>
        </div>
        <div className="stat-card">
          <ShieldCheck className="w-4 h-4 text-emerald-400 mb-2" />
          <div className="text-2xl font-bold text-emerald-400">{stats.admins}</div>
          <div className="text-xs text-base-600">Adminlar</div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-base-600" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            className="input pl-10" placeholder="Ism yoki email bo'yicha qidirish..." />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as any)} className="input w-auto">
          <option value="all">Barcha rollar</option>
          <option value="student">O'quvchilar</option>
          <option value="teacher">O'qituvchilar</option>
          <option value="admin">Adminlar</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1E1E24] bg-[#0D0D10]">
                <th className="text-left px-4 py-3 text-xs text-base-500 uppercase tracking-wider font-medium">Foydalanuvchi</th>
                <th className="text-left px-4 py-3 text-xs text-base-500 uppercase tracking-wider font-medium">Rol</th>
                <th className="text-left px-4 py-3 text-xs text-base-500 uppercase tracking-wider font-medium">XP</th>
                <th className="text-left px-4 py-3 text-xs text-base-500 uppercase tracking-wider font-medium">Qo'shilgan</th>
                <th className="text-left px-4 py-3 text-xs text-base-500 uppercase tracking-wider font-medium">Oxirgi faol</th>
                <th className="text-right px-4 py-3 text-xs text-base-500 uppercase tracking-wider font-medium">Amal</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={6} className="text-center py-8 text-base-600 text-sm">Yuklanmoqda...</td></tr>
              )}
              {!loading && filtered.map((u) => {
                const rc = (ROLE_CONFIG as any)[u.role] || ROLE_CONFIG.student
                return (
                  <tr key={u.id} className="border-b border-[#1E1E24] hover:bg-[#1A1A1F]/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold
                          ${u.role === 'admin' ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400' :
                            u.role === 'teacher' ? 'bg-sky-500/20 border border-sky-500/30 text-sky-400' :
                            'bg-accent-500/20 border border-accent-500/30 text-accent-400'}`}>
                          {u.avatar}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-base-200">{u.name}</div>
                          <div className="text-xs text-base-600">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={rc.color}>
                        <rc.Icon className="w-3.5 h-3.5" /> {rc.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-amber-400">{(u.xp || 0).toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-base-500">{formatDate(u.joinedAt)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-base-500">{formatDate(u.lastSeen)}</span>
                    </td>
                    <td className="px-4 py-3 text-right relative" onClick={e => e.stopPropagation()}>
                      <button onClick={() => setMenuOpen(menuOpen === u.id ? null : u.id)}
                        className="p-1.5 rounded-lg hover:bg-[#222229] text-base-500 hover:text-base-200 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {menuOpen === u.id && (
                        <div className="absolute right-0 top-full mt-1 w-44 card-elevated shadow-card-hover z-20 py-1 text-left animate-slide-up">
                          <button className="w-full px-3 py-2 text-xs flex items-center gap-2 hover:bg-[#222229] text-sky-400"
                            onClick={() => { setMenuOpen(null) }}>
                            <Shield className="w-3.5 h-3.5" /> Rol o'zgartirish
                          </button>
                          <button
                            onClick={() => handleDelete(u.id, u.name)}
                            disabled={deleting === u.id}
                            className="w-full px-3 py-2 text-xs flex items-center gap-2 hover:bg-rose-500/10 text-rose-400 disabled:opacity-50">
                            <Trash2 className="w-3.5 h-3.5" />
                            {deleting === u.id ? "O'chirilmoqda..." : "O'chirish"}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center py-8 text-base-600 text-sm">Foydalanuvchi topilmadi</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && (
        <AddUserModal onClose={() => setShowAdd(false)} onSuccess={refetch} />
      )}
    </div>
  )
}
