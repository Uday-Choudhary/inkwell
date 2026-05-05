import Link from 'next/link'
import { PenLine } from 'lucide-react'

export default function SiteFooter() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
              <div style={{ width: 28, height: 28, background: 'var(--ink-primary-light)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PenLine size={15} color="#fff" />
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: '#fff' }}>Inkwell</span>
            </div>
            <p style={{ fontSize: '0.8125rem', lineHeight: 1.6 }}>SEO-first content publishing with built-in AI assistance.</p>
          </div>

          <div>
            <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.875rem' }}>Content</h3>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link href="/" className="footer-link">All Articles</Link>
              <Link href="/search" className="footer-link">Search</Link>
              <Link href="/rss.xml" className="footer-link">RSS Feed</Link>
            </nav>
          </div>

          <div>
            <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.875rem' }}>Platform</h3>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link href="/admin" className="footer-link">Admin Panel</Link>
              <Link href="/sitemap.xml" className="footer-link">Sitemap</Link>
              <Link href="/robots.txt" className="footer-link">Robots.txt</Link>
            </nav>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ fontSize: '0.8125rem' }}>© {new Date().getFullYear()} Inkwell. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1rem' }}>
          </div>
        </div>
      </div>
    </footer>
  )
}
