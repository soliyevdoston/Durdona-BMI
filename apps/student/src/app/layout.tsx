import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EduCode — Talaba',
  description: 'AKT fanlarini amaliyot orqali o\'rganish platformasi',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" className="dark">
      <body className="text-base-100 antialiased">{children}</body>
    </html>
  )
}
