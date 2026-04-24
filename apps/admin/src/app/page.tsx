'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useAuthStore } from '@/lib/store'

export default function AdminLanding() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
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
        <Link href="/login" className="inline-flex items-center gap-1 mt-4 text-sm text-base-300 hover:text-base-100">
          Kirish <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  )
}
