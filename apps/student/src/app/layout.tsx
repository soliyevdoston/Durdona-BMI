import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'

export const metadata: Metadata = {
  title: 'EduCode — Talaba',
  description: 'AKT fanlarini amaliyot orqali o\'rganish platformasi',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <head>
        {/* Anti-flash: apply saved theme before React hydrates */}
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            var s = localStorage.getItem('edu-theme');
            var t = s ? JSON.parse(s).state?.theme : 'dark';
            var resolved = t === 'system'
              ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
              : (t || 'dark');
            document.documentElement.classList.add(resolved);
          } catch(e) {
            document.documentElement.classList.add('dark');
          }
        `}} />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
