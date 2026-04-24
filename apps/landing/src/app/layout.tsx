import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EduCode — AKT Virtual Sinf',
  description: "AKT fanlarini amaliyot orqali o'rganish va o'qitish platformasi",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" className="dark">
      <body className="text-base-100 antialiased">{children}</body>
    </html>
  )
}
