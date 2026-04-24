import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EduCode — Virtual AKT Classroom',
  description: 'Advanced virtual classroom for AKT education with AI-powered learning',
  keywords: 'AKT, programming, education, virtual classroom, AI learning',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="text-base-100 antialiased">
        {children}
      </body>
    </html>
  )
}
