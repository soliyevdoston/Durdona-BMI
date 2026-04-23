import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EduCode — Virtual ICT Classroom',
  description: 'Advanced virtual classroom for ICT education with AI-powered learning',
  keywords: 'ICT, programming, education, virtual classroom, AI learning',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-base-950 text-base-100 antialiased">
        {children}
      </body>
    </html>
  )
}
