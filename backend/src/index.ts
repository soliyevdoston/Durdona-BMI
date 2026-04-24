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

// Health check (Render uchun)
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

app.listen(PORT, () => {
  console.log(`✓ Backend ishga tushdi: http://localhost:${PORT}`)
  console.log(`  CORS: ${corsOrigins.join(', ')}`)
  console.log(`  Health: /api/health`)
})
