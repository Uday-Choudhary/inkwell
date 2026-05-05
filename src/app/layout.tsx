import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'Inkwell — SEO-Optimised Content Publishing', template: '%s | Inkwell' },
  description: 'A lightweight, SEO-first content publishing platform with AI-powered meta generation.',
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  robots: { index: true, follow: true },
  openGraph: { type: 'website', siteName: 'Inkwell' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <a href="#main-content" className="skip-to-content">Skip to content</a>
        {children}
      </body>
    </html>
  )
}
