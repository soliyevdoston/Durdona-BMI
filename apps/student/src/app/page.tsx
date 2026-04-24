'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'

export default function StudentRoot() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()

  useEffect(() => {
    if (isAuthenticated && user?.role === 'student') {
      router.replace('/dashboard')
    } else {
      router.replace('/login')
    }
  }, [isAuthenticated, user, router])

  return (
    <div className="min-h-screen bg-app flex items-center justify-center">
      <div className="text-center">
        <div className="w-9 h-9 rounded-md bg-base-100 text-base-950 flex items-center justify-center font-semibold mx-auto mb-4">E</div>
        <div className="text-sm text-base-500">Yo'naltirilmoqda...</div>
      </div>
    </div>
  )
}
