import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

import authRoutes from './routes/auth'
import userRoutes from './routes/users'
import courseRoutes from './routes/courses'
import lessonRoutes from './routes/lessons'
import assignmentRoutes from './routes/assignments'
import miscRoutes from './routes/misc'

const app = express()
const PORT = Number(process.env.PORT) || 8080

// CORS — vergul bilan ajratilgan ro'yxat yoki "*"
const corsOrigins = (process.env.CORS_ORIGINS || '*').split(',').map(s => s.trim())
app.use(cors({
  origin: corsOrigins.includes('*') ? true : corsOrigins,
  credentials: true,
}))

app.use(express.json({ limit: '2mb' }))
app.use(morgan('tiny'))

// Health check (Railway uchun)
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'educode-backend',
    version: '1.0.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  })
})

// API route'lar
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/lessons', lessonRoutes)
app.use('/api/assignments', assignmentRoutes)
app.use('/api', miscRoutes)

// 404
app.use((_req, res) => res.status(404).json({ error: 'Route topilmadi' }))

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[error]', err)
  res.status(500).json({ error: 'Ichki server xatosi' })
})

// Diagnostic: DATABASE_URL bor-yo'qligini va formatini tekshirish
const dbUrl = process.env.DATABASE_URL
if (!dbUrl) {
  console.error('✗ DATABASE_URL o\'rnatilmagan!')
} else {
  const trimmed = dbUrl.trim()
  const hasWhitespace = dbUrl !== trimmed
  const startsOk = trimmed.startsWith('postgresql://') || trimmed.startsWith('postgres://')
  console.log(`✓ DATABASE_URL: uzunligi=${dbUrl.length}, trimmed=${trimmed.length}, startsOk=${startsOk}${hasWhitespace ? ' ⚠ (bo\'sh joy bor!)' : ''}`)
}

app.listen(PORT, () => {
  console.log(`✓ Backend ishga tushdi: http://localhost:${PORT}`)
  console.log(`  CORS: ${corsOrigins.join(', ')}`)
  console.log(`  Health: /api/health`)

  // Render free tier "uxlamaslik" uchun o'zini-o'zi ping qiladi
  if (process.env.NODE_ENV === 'production' && process.env.RENDER_EXTERNAL_URL) {
    const selfUrl = `${process.env.RENDER_EXTERNAL_URL}/api/health`
    setInterval(async () => {
      try {
        const r = await fetch(selfUrl)
        console.log(`[keep-alive] ping OK — ${new Date().toISOString()} (${r.status})`)
      } catch (e) {
        console.warn('[keep-alive] ping failed:', e)
      }
    }, 10 * 60 * 1000) // har 10 daqiqada
    console.log(`  Keep-alive: har 10 daqiqada ${selfUrl} ping qilinadi`)
  }
})
