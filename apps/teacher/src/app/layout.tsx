import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "EduCode — O'qituvchi",
  description: "AKT fanlari uchun o'qituvchi paneli",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" className="dark">
      <body className="text-base-100 antialiased">{children}</body>
    </html>
  )
}
