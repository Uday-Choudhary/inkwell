'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, PenLine } from 'lucide-react'

export default function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="site-nav">
      <div className="container" style={{ display: 'flex', alignItems: 'center', height: '100%', gap: '2rem' }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', flexShrink: 0 }}>
          <div style={{ width: 32, height: 32, background: 'var(--ink-primary)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PenLine size={18} color="#fff" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--ink-text-heading)' }}>Inkwell</span>
        </Link>

        {/* Desktop Nav */}
        <nav aria-label="Primary" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1 }} className="hidden-mobile">
          <Link href="/" className="nav-link">Articles</Link>
          <Link href="/search" className="nav-link">Search</Link>
        </nav>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link href="/admin" className="btn btn-primary btn-sm hidden-mobile">Admin</Link>
          <button
            aria-label="Toggle menu"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', display: 'none' }}
            className="mobile-menu-btn"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div style={{ background: '#fff', borderTop: '1px solid var(--ink-border)', padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link href="/" className="nav-link" onClick={() => setMobileOpen(false)}>Articles</Link>
          <Link href="/search" className="nav-link" onClick={() => setMobileOpen(false)}>Search</Link>
          <Link href="/admin" className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start' }} onClick={() => setMobileOpen(false)}>Admin</Link>
        </div>
      )}

      <style>{`
        @media (max-width: 767px) {
          .hidden-mobile { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  )
}
