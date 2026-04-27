'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  BookOpen, LayoutDashboard, GraduationCap, Code2, ClipboardList,
  Award, Brain, Bell, LogOut, ChevronRight, Flame, Star, Menu, X
} from 'lucide-react'
import { useAuthStore } from '@/lib/store'
import { api } from '@/lib/api'
import { useApi } from '@/lib/useApi'
import { getLevelFromXP, getRankLabel } from '@/lib/utils'
import { ThemeToggle } from '@/components/ThemeToggle'

const NAV_ITEMS = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Bosh sahifa' },
  { href: '/courses', icon: GraduationCap, label: 'Kurslar' },
  { href: '/playground', icon: Code2, label: 'Kod Muhiti' },
  { href: '/assignments', icon: ClipboardList, label: 'Topshiriqlar' },
  { href: '/portfolio', icon: Award, label: 'Portfolio' },
  { href: '/ai', icon: Brain, label: 'AI Yordamchi' },
]

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuthStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const { data: notifications } = useApi(() => api.notifications())
  const notifList = notifications || []
  const unread = notifList.filter((n: any) => !n.read).length

  useEffect(() => {
    if (!user || user.role !== 'student') router.push('/login')
  }, [user, router])

  if (!user) return null

  const { level, current, required } = getLevelFromXP(user.xp)
  const progress = Math.round((current / required) * 100)

  const handleLogout = () => { logout(); router.push('/login') }

  const Sidebar = () => (
    <aside className="flex flex-col h-full bg-[var(--sidebar-bg)] border-r border-[var(--border-muted)]">
      {/* Logo */}
      <div className="p-5 border-b border-[var(--border-muted)]">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-600 to-accent-500 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-base-100">EduCode</span>
        </Link>
      </div>

      {/* User Profile Card */}
      <div className="p-4 border-b border-[var(--border-muted)]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-600/30 to-accent-600/10 border border-accent-600/30 flex items-center justify-center text-sm font-bold text-accent-400">
            {user.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-base-100 truncate">{user.name}</div>
            <div className="text-xs text-base-500">{getRankLabel(level)}</div>
          </div>
        </div>
        {/* XP Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-base-600">
            <span className="flex items-center gap-1"><Star className="w-3 h-3 text-base-500" /> Daraja {level}</span>
            <span>{current}/{required} XP</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
        {/* Streak */}
        <div className="flex items-center gap-1.5 mt-2.5 text-xs text-base-500">
          <Flame className="w-3.5 h-3.5" />
          <span className="font-medium">{user.streak} kunlik seriya</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href}
              onClick={() => setMobileOpen(false)}
              className={active ? 'nav-link-active' : 'nav-link'}>
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
              {active && <ChevronRight className="w-3 h-3 ml-auto opacity-50" />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-[var(--border-muted)]">
        <button onClick={handleLogout}
          className="nav-link w-full text-rose-500 hover:text-rose-400 hover:bg-rose-500/10">
          <LogOut className="w-4 h-4" />
          Chiqish
        </button>
      </div>
    </aside>
  )

  return (
    <div className="flex h-screen bg-app overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-64 flex-shrink-0 flex-col">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 flex flex-col animate-slide-in-right">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-14 border-b border-[var(--border-muted)] bg-[var(--header-bg)] backdrop-blur-sm flex items-center justify-between px-4 flex-shrink-0">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden btn-ghost p-2">
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden lg:block text-sm font-medium text-base-500">
            {NAV_ITEMS.find(n => pathname.startsWith(n.href))?.label || 'Dashboard'}
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <ThemeToggle />
            <div className="relative">
              <button onClick={() => setNotifOpen(!notifOpen)}
                className="btn-ghost relative p-2 rounded-xl">
                <Bell className="w-4 h-4" />
                {unread > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 card-elevated shadow-card-hover z-50 overflow-hidden animate-slide-up">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
                    <span className="text-sm font-semibold text-base-200">Bildirishnomalar</span>
                    <button onClick={() => setNotifOpen(false)}>
                      <X className="w-4 h-4 text-base-500" />
                    </button>
                  </div>
                  {notifList.map((n: any) => (
                    <div key={n.id} className={`px-4 py-3 border-b border-[var(--border-muted)] hover:bg-[var(--bg-overlay)] transition-colors ${!n.read ? 'bg-accent-600/5' : ''}`}>
                      <div className="flex items-start gap-2">
                        {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-accent-500 mt-1.5 flex-shrink-0" />}
                        <div className={!n.read ? '' : 'ml-3.5'}>
                          <div className="text-xs font-medium text-base-200">{n.title}</div>
                          <div className="text-xs text-base-500 mt-0.5">{n.body}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="w-8 h-8 rounded-xl bg-accent-600/20 border border-accent-600/30 flex items-center justify-center text-xs font-bold text-accent-400">
              {user.avatar}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-5 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
