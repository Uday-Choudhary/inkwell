import Link from 'next/link'
import { PenLine, Rss } from 'lucide-react'

export default function SiteFooter() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>

          {/* Brand */}
          <div style={{ gridColumn: 'span 1' }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', marginBottom: '1rem' }}>
              <div style={{
                width: 30, height: 30,
                background: 'linear-gradient(135deg, var(--ink-primary) 0%, var(--ink-primary-light) 100%)',
                borderRadius: 7,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(27,77,62,0.4)',
              }}>
                <PenLine size={15} color="#fff" />
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: '#fff' }}>Inkwell</span>
            </Link>
            <p style={{ fontSize: '0.8125rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.5)', maxWidth: 220 }}>
              SEO-first content publishing with AI-powered meta generation.
            </p>
          </div>

          {/* Content links */}
          <div>
            <h3 style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)', marginBottom: '1rem', fontWeight: 600 }}>
              Content
            </h3>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              <Link href="/" className="footer-link">All Articles</Link>
              <Link href="/search" className="footer-link">Search</Link>
              <Link href="/rss.xml" className="footer-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                <Rss size={13} /> RSS Feed
              </Link>
            </nav>
          </div>

          {/* Platform links */}
          <div>
            <h3 style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)', marginBottom: '1rem', fontWeight: 600 }}>
              Platform
            </h3>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              <Link href="/admin" className="footer-link">Admin Panel</Link>
              <Link href="/sitemap.xml" className="footer-link">Sitemap</Link>
            </nav>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.3)' }}>
            © {new Date().getFullYear()} Inkwell. All rights reserved.
          </p>
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)' }}>
            Built with Next.js &amp; Prisma
          </p>
        </div>
      </div>
    </footer>
  )
}
