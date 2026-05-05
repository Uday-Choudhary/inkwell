'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FileText, Tag, Folder, Settings, LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'

export default function AdminSidebar() {
  const pathname = usePathname()

  const links = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/articles', label: 'Articles', icon: FileText },
    { href: '/admin/tags', label: 'Tags', icon: Tag },
    { href: '/admin/categories', label: 'Categories', icon: Folder },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <aside className="admin-sidebar">
      <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '1rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: '#fff' }}>Inkwell Admin</h2>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href))
          return (
            <Link key={link.href} href={link.href} className={`admin-sidebar-link ${isActive ? 'active' : ''}`}>
              <Icon size={18} />
              {link.label}
            </Link>
          )
        })}
      </nav>

      <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="admin-sidebar-link"
          style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left', color: '#DC2626' }}
        >
          <LogOut size={18} />
          Log out
        </button>
      </div>
    </aside>
  )
}
