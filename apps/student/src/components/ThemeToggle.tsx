'use client'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useThemeStore, type Theme } from '@/lib/themeStore'

const OPTIONS: { value: Theme; icon: React.ElementType; label: string }[] = [
  { value: 'light',  icon: Sun,     label: 'Yorug\'' },
  { value: 'system', icon: Monitor, label: 'Sistema' },
  { value: 'dark',   icon: Moon,    label: 'Qorong\'u' },
]

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore()
  return (
    <div className="flex items-center gap-0.5 p-1 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)]">
      {OPTIONS.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          title={label}
          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200
            ${theme === value
              ? 'bg-[var(--bg-overlay)] text-[color:var(--text-primary)] shadow-sm'
              : 'text-[color:var(--text-muted)] hover:text-[color:var(--text-secondary)]'
            }`}
        >
          <Icon className="w-3.5 h-3.5" />
        </button>
      ))}
    </div>
  )
}
