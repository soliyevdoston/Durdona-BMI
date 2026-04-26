import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function formatRelative(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  if (minutes < 1) return "Hozirgina"
  if (minutes < 60) return `${minutes}m oldin`
  if (hours < 24) return `${hours}s oldin`
  if (days < 7) return `${days}k oldin`
  return formatDate(d)
}

export function getProgress(completed: number, total: number): number {
  return total > 0 ? Math.round((completed / total) * 100) : 0
}

export function getLevelFromXP(xp: number): { level: number; current: number; required: number } {
  const levels = [0, 100, 250, 500, 900, 1400, 2000, 2800, 3800, 5000, 7000]
  let level = 1
  for (let i = 0; i < levels.length - 1; i++) {
    if (xp >= levels[i]) level = i + 1
    else break
  }
  const current = xp - (levels[level - 1] || 0)
  const required = (levels[level] || levels[levels.length - 1]) - (levels[level - 1] || 0)
  return { level, current, required }
}

export function getRankLabel(level: number): string {
  const ranks = ['Boshlang\'ich', 'Yangi boshlovchi', 'O\'rganuvchi', 'Ishqiboz', 'Malakali',
    'Ekspert', 'Usta', 'Olim', 'Daho', 'Legenda', 'Grand Master']
  return ranks[Math.min(level - 1, ranks.length - 1)]
}

export function truncate(str: string, n: number): string {
  return str.length > n ? str.slice(0, n - 1) + '…' : str
}

export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export function getDifficultyColor(diff: string): string {
  switch (diff) {
    case 'beginner': return 'text-emerald-400'
    case 'intermediate': return 'text-amber-400'
    case 'advanced': return 'text-rose-400'
    default: return 'text-base-400'
  }
}


export function getDifficultyLabel(diff: string): string {
  switch (diff) {
    case 'beginner': return 'Boshlang\'ich'
    case 'intermediate': return 'O\'rta'
    case 'advanced': return 'Murakkab'
    default: return diff
  }
}
