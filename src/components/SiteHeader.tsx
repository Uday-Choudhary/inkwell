'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, PenLine, Search } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header className="site-nav">
      <div className="container" style={{ display: 'flex', alignItems: 'center', height: '100%', gap: '2rem' }}>

        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', flexShrink: 0 }}>
          <div style={{
            width: 34, height: 34,
            background: 'linear-gradient(135deg, var(--ink-primary) 0%, var(--ink-primary-light) 100%)',
            borderRadius: 9,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(27,77,62,0.3)',
          }}>
            <PenLine size={18} color="#fff" strokeWidth={2} />
          </div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.3rem',
            color: 'var(--ink-text-heading)',
            letterSpacing: '-0.01em',
          }}>
            Inkwell
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav aria-label="Primary" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flex: 1 }} className="hidden-mobile">
          <Link
            href="/"
            className={`nav-link nav-link-pill ${isActive('/') ? 'active' : ''}`}
          >
            Articles
          </Link>
          <Link
            href="/search"
            className={`nav-link nav-link-pill ${isActive('/search') ? 'active' : ''}`}
          >
            <Search size={13} style={{ display: 'inline', marginRight: 4 }} />
            Search
          </Link>
        </nav>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Desktop search icon shortcut */}
          <Link href="/search" className="nav-search-icon hidden-mobile" aria-label="Search">
            <Search size={18} />
          </Link>
          <Link href="/admin" className="btn btn-primary btn-sm hidden-mobile" style={{ borderRadius: 8 }}>Admin</Link>
          <button
            aria-label="Toggle menu"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.375rem', display: 'none', borderRadius: 6 }}
            className="mobile-menu-btn"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="mobile-nav-drawer">
          <Link href="/" className={`mobile-nav-link ${pathname === '/' ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>
            Articles
          </Link>
          <Link href="/search" className={`mobile-nav-link ${pathname.startsWith('/search') ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>
            <Search size={14} />
            Search
          </Link>
          <div style={{ borderTop: '1px solid var(--ink-border)', paddingTop: '1rem', marginTop: '0.25rem' }}>
            <Link href="/admin" className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setMobileOpen(false)}>
              Admin Panel
            </Link>
          </div>
        </div>
      )}

      <style>{`
        .nav-link-pill {
          padding: 0.375rem 0.875rem;
          border-radius: 8px;
          transition: background 150ms, color 150ms;
        }
        .nav-link-pill:hover, .nav-link-pill.active {
          background: #F0F7F4;
          color: var(--ink-primary) !important;
        }
        .nav-search-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px; height: 34px;
          border-radius: 8px;
          color: var(--ink-text-muted);
          transition: background 150ms, color 150ms;
          text-decoration: none;
        }
        .nav-search-icon:hover {
          background: var(--ink-bg-sidebar);
          color: var(--ink-primary);
        }
        .mobile-nav-drawer {
          background: #fff;
          border-top: 1px solid var(--ink-border);
          padding: 1rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }
        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 0.75rem;
          border-radius: 8px;
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--ink-text-body);
          text-decoration: none;
          transition: background 150ms;
        }
        .mobile-nav-link:hover, .mobile-nav-link.active {
          background: #F0F7F4;
          color: var(--ink-primary);
        }
        @media (max-width: 767px) {
          .hidden-mobile { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  )
}
