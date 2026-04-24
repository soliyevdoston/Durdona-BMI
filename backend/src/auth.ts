import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

export type Role = 'student' | 'teacher' | 'admin' | 'super_admin'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-insecure-secret-change-in-prod'
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '7d') as any

export interface TokenPayload {
  id: string
  email: string
  role: Role
}

export const signToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload
  } catch {
    return null
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload
    }
  }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token kerak' })
  }
  const token = header.slice(7)
  const payload = verifyToken(token)
  if (!payload) return res.status(401).json({ error: "Token yaroqsiz yoki muddati o'tgan" })
  req.user = payload
  next()
}

export const requireRole = (...roles: Role[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: 'Avtorizatsiya kerak' })
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Bu amalga ruxsatingiz yo'q" })
    }
    next()
  }
