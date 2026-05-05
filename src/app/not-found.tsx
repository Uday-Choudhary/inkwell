import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Not Found — Inkwell',
  description: 'The page you\'re looking for doesn\'t exist or has been moved.',
}

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--ink-bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(5rem, 15vw, 9rem)',
          fontWeight: 400,
          color: 'var(--ink-border-strong)',
          lineHeight: 1,
          marginBottom: '1rem',
          userSelect: 'none',
        }}>
          404
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.75rem',
          fontWeight: 400,
          color: 'var(--ink-text-heading)',
          marginBottom: '0.75rem',
        }}>
          Page not found
        </h1>

        <p style={{
          fontSize: '0.9375rem',
          color: 'var(--ink-text-muted)',
          lineHeight: 1.7,
          marginBottom: '2rem',
        }}>
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
          Head back to the homepage and keep exploring.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn btn-primary">
            Back to Articles
          </Link>
          <Link href="/search" className="btn btn-secondary">
            Search
          </Link>
        </div>
      </div>
    </div>
  )
}
