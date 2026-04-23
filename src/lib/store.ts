'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
  isAuthenticated: boolean
  setUser: (user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'edu-auth' }
  )
)

interface UIState {
  sidebarOpen: boolean
  setSidebarOpen: (v: boolean) => void
  theme: 'dark' | 'light'
  toggleTheme: () => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  setSidebarOpen: (v) => set({ sidebarOpen: v }),
  theme: 'dark',
  toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
}))
