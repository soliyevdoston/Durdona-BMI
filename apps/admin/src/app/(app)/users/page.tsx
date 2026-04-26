'use client'
import { useState } from 'react'
import {
  Search, MoreVertical, Edit, Trash2, Ban, Shield, ShieldCheck,
  UserPlus, Mail, Download, Users, GraduationCap, BookOpen, Crown
} from 'lucide-react'
import { api } from '@/lib/api'
import { useApi } from '@/lib/useApi'
import { formatDate } from '@/lib/utils'

const ROLE_CONFIG = {
  student: { label: 'Talaba', color: 'badge-accent', Icon: GraduationCap },
  teacher: { label: "O'qituvchi", color: 'badge-sky', Icon: BookOpen },
  admin: { label: 'Admin', color: 'badge-emerald', Icon: ShieldCheck },
  super_admin: { label: 'Super Admin', color: 'badge bg-amber-500/10 text-amber-400 border border-amber-500/20', Icon: Crown },
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'student' | 'teacher' | 'admin'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [menuOpen, setMenuOpen] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)

  const { data, loading } = useApi(() => api.users())
  const ALL_USERS: any[] = (data || []).map((u: any) => ({
    ...u,
    status: 'active',
    lastSeen: u.lastActive || u.joinedAt,
  }))

  const filtered = ALL_USERS.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'all' || u.role === roleFilter
    const matchStatus = statusFilter === 'all' || u.status === statusFilter
    return matchSearch && matchRole && matchStatus
  })

  const stats = {
    total: ALL_USERS.length,
    students: ALL_USERS.filter(u => u.role === 'student').length,
    teachers: ALL_USERS.filter(u => u.role === 'teacher').length,
    admins: ALL_USERS.filter(u => u.role === 'admin').length,
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
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

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <Users className="w-4 h-4 text-accent-400 mb-2" />
          <div className="text-2xl font-bold text-base-100">{stats.total}</div>
          <div className="text-xs text-base-600">Jami</div>
        </div>
        <div className="stat-card">
          <GraduationCap className="w-4 h-4 text-accent-400 mb-2" />
          <div className="text-2xl font-bold text-accent-400">{stats.students}</div>
          <div className="text-xs text-base-600">Talabalar</div>
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

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-base-600" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            className="input pl-10" placeholder="Ism yoki email bo'yicha qidirish..." />
        </div>
        <div className="flex gap-2 flex-wrap">
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as any)}
            className="input w-auto">
            <option value="all">Barcha rollar</option>
            <option value="student">Talabalar</option>
            <option value="teacher">O'qituvchilar</option>
            <option value="admin">Adminlar</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}
            className="input w-auto">
            <option value="all">Barcha holatlar</option>
            <option value="active">Faol</option>
            <option value="inactive">Nofaol</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1E1E24] bg-[#0D0D10]">
                <th className="text-left px-4 py-3 text-xs text-base-500 uppercase tracking-wider font-medium">Foydalanuvchi</th>
                <th className="text-left px-4 py-3 text-xs text-base-500 uppercase tracking-wider font-medium">Rol</th>
                <th className="text-left px-4 py-3 text-xs text-base-500 uppercase tracking-wider font-medium">Holat</th>
                <th className="text-left px-4 py-3 text-xs text-base-500 uppercase tracking-wider font-medium">Qo'shilgan</th>
                <th className="text-left px-4 py-3 text-xs text-base-500 uppercase tracking-wider font-medium">Oxirgi faol</th>
                <th className="text-right px-4 py-3 text-xs text-base-500 uppercase tracking-wider font-medium">Amal</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => {
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
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-emerald-500' : 'bg-base-600'}`} />
                        <span className={`text-xs ${u.status === 'active' ? 'text-emerald-400' : 'text-base-500'}`}>
                          {u.status === 'active' ? 'Faol' : 'Nofaol'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-base-500">{formatDate(u.joinedAt)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-base-500">{formatDate(u.lastSeen)}</span>
                    </td>
                    <td className="px-4 py-3 text-right relative">
                      <button onClick={() => setMenuOpen(menuOpen === u.id ? null : u.id)}
                        className="p-1.5 rounded-lg hover:bg-[#222229] text-base-500 hover:text-base-200 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {menuOpen === u.id && (
                        <div className="absolute right-0 top-full mt-1 w-44 card-elevated shadow-card-hover z-20 py-1 text-left animate-slide-up">
                          {[
                            { icon: Mail, label: 'Xabar yuborish', color: 'text-base-300' },
                            { icon: Edit, label: 'Tahrirlash', color: 'text-base-300' },
                            { icon: Shield, label: 'Rol o\'zgartirish', color: 'text-sky-400' },
                            { icon: Ban, label: 'Bloklash', color: 'text-amber-400' },
                            { icon: Trash2, label: 'O\'chirish', color: 'text-rose-400' },
                          ].map(a => (
                            <button key={a.label} className={`w-full px-3 py-2 text-xs flex items-center gap-2 hover:bg-[#222229] ${a.color}`}>
                              <a.icon className="w-3.5 h-3.5" /> {a.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAdd(false)} />
          <div className="relative w-full max-w-md card-elevated p-6 animate-slide-up">
            <h2 className="text-xl font-bold text-base-100 mb-5">Yangi Foydalanuvchi</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-base-500 uppercase tracking-wider mb-2 block">To'liq Ism</label>
                <input className="input" placeholder="Ism Familiya" />
              </div>
              <div>
                <label className="text-xs text-base-500 uppercase tracking-wider mb-2 block">Email</label>
                <input className="input" type="email" placeholder="email@edu.uz" />
              </div>
              <div>
                <label className="text-xs text-base-500 uppercase tracking-wider mb-2 block">Rol</label>
                <select className="input">
                  <option value="student">Talaba</option>
                  <option value="teacher">O'qituvchi</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-base-500 uppercase tracking-wider mb-2 block">Vaqtinchalik Parol</label>
                <input className="input" type="text" placeholder="Avtomatik generatsiya qilinadi" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAdd(false)} className="btn-secondary flex-1 py-2.5">Bekor</button>
              <button onClick={() => setShowAdd(false)}
                className="btn-primary bg-emerald-600 hover:bg-emerald-700 flex-1 py-2.5 flex items-center justify-center gap-2">
                <UserPlus className="w-4 h-4" /> Yaratish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
