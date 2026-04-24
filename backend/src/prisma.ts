import { PrismaClient } from '@prisma/client'

// Global singleton (dev mode'da hot-reload paytida bir nechta client yaratilmasin)
const globalForPrisma = global as unknown as { prisma?: PrismaClient }

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Activity log helper
export const log = async (userId: string | null, action: string, meta?: Record<string, unknown>, ip?: string) => {
  try {
    await prisma.activityLog.create({
      data: { userId, action, meta: meta as any, ip },
    })
  } catch (e) {
    console.error('[log]', e)
  }
}

// Public user — passwordHash'ni olib tashlash
export const publicUser = (u: any) => {
  if (!u) return null
  const { passwordHash, ...pub } = u
  return pub
}
