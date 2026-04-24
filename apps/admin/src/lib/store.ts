'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api } from './api'

export type Role = 'student' | 'teacher' | 'admin' | 'super_admin'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  avatar: string
  xp: number
  level: number
  streak: number
  joinedAt: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<User>
  register: (data: { name: string; email: string; password: string; role: Role }) => Promise<User>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email, password) => {
        const { token, user } = await api.login(email, password, 'admin')
        if (typeof window !== 'undefined') localStorage.setItem('edu-token', token)
        set({ user, token, isAuthenticated: true })
        return user
      },

      register: async (data) => {
        const { token, user } = await api.register(data)
        if (typeof window !== 'undefined') localStorage.setItem('edu-token', token)
        set({ user, token, isAuthenticated: true })
        return user
      },

      logout: async () => {
        try { await api.logout() } catch {}
        if (typeof window !== 'undefined') localStorage.removeItem('edu-token')
        set({ user: null, token: null, isAuthenticated: false })
      },

      refresh: async () => {
        try {
          const user = await api.me()
          set({ user, isAuthenticated: true })
        } catch {
          if (typeof window !== 'undefined') localStorage.removeItem('edu-token')
          set({ user: null, token: null, isAuthenticated: false })
        }
      },
    }),
    { name: 'edu-auth' }
  )
)

interface UIState {
  sidebarOpen: boolean
  setSidebarOpen: (v: boolean) => void
}
export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  setSidebarOpen: (v) => set({ sidebarOpen: v }),
}))
