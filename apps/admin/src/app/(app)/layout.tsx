'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  BookOpen, LayoutDashboard, Users, Server, Shield, BarChart3,
  Settings, FileText, Bell, LogOut, ChevronRight, Menu, Database
} from 'lucide-react'
import { useAuthStore } from '@/lib/store'
import { ThemeToggle } from '@/components/ThemeToggle'

const NAV_ITEMS = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Bosh sahifa' },
  { href: '/users', icon: Users, label: 'Foydalanuvchilar' },
  { href: '/courses', icon: BookOpen, label: 'Kurslar' },
  { href: '/analytics', icon: BarChart3, label: 'Tahlil' },
  { href: '/system', icon: Server, label: 'Tizim' },
  { href: '/logs', icon: FileText, label: 'Loglar' },
  { href: '/security', icon: Shield, label: 'Xavfsizlik' },
  { href: '/settings', icon: Settings, label: 'Sozlamalar' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuthStore()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) router.push('/login')
  }, [user, router])

  if (!user) return null

  const handleLogout = () => { logout(); router.push('/login') }

  const Sidebar = () => (
    <aside className="flex flex-col h-full bg-[var(--sidebar-bg,#0D0D10)] border-r border-[var(--border-muted,#1E1E24)]">
      <div className="p-5 border-b border-[#1E1E24]">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-500 flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-bold text-base-100">EduCode</div>
            <div className="text-xs text-emerald-400 -mt-0.5">Admin Paneli</div>
          </div>
        </Link>
      </div>

      <div className="p-4 border-b border-[#1E1E24]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600/30 to-emerald-600/10 border border-emerald-600/30 flex items-center justify-center text-sm font-bold text-emerald-400">
            {user.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-base-100 truncate">{user.name}</div>
            <div className="text-xs text-emerald-400 flex items-center gap-1">
              <Shield className="w-3 h-3" /> Super Admin
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href}
              onClick={() => setMobileOpen(false)}
              className={active
                ? 'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-emerald-400 bg-emerald-600/10 border border-emerald-600/20'
                : 'nav-link'}>
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
              {active && <ChevronRight className="w-3 h-3 ml-auto opacity-50" />}
            </Link>
          )
        })}
      </nav>

      {/* System Status */}
      <div className="p-3 border-t border-[#1E1E24]">
        <div className="flex items-center gap-2 text-xs text-base-500 mb-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Tizim faol · 99.97%
        </div>
        <button onClick={handleLogout}
          className="nav-link w-full mt-2 text-rose-500 hover:text-rose-400 hover:bg-rose-500/10">
          <LogOut className="w-4 h-4" />
          Chiqish
        </button>
      </div>
    </aside>
  )

  return (
    <div className="flex h-screen bg-app overflow-hidden">
      <div className="hidden lg:flex w-64 flex-shrink-0 flex-col">
        <Sidebar />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64">
            <Sidebar />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 border-b border-[var(--border-muted,#1E1E24)] bg-[var(--header-bg,rgba(13,13,16,0.85))] backdrop-blur-sm flex items-center justify-between px-4 flex-shrink-0">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden btn-ghost p-2">
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden lg:block text-sm font-medium text-base-500">
            {NAV_ITEMS.find(n => pathname.startsWith(n.href))?.label || 'Dashboard'}
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <ThemeToggle />
            <button className="btn-ghost relative p-2 rounded-xl">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-xl bg-emerald-600/20 border border-emerald-600/30 flex items-center justify-center text-xs font-bold text-emerald-400">
              {user.avatar}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
