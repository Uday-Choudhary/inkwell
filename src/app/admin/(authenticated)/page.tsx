import { prisma } from '@/lib/prisma'
import { FileText, CheckCircle2, FileEdit } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export const metadata = { title: 'Dashboard | Inkwell Admin' }

export default async function AdminDashboardPage() {
  const [totalArticles, publishedArticles, draftArticles, recentArticles] = await Promise.all([
    prisma.article.count(),
    prisma.article.count({ where: { published: true } }),
    prisma.article.count({ where: { published: false } }),
    prisma.article.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 5,
      include: { author: { select: { name: true } } },
    }),
  ])

  return (
    <div style={{ padding: '2rem 3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--ink-text-heading)' }}>Dashboard</h1>
        <Link href="/admin/articles/new" className="btn btn-primary">
          + New Article
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'var(--ink-text-muted)' }}>
            <FileText size={20} />
            <span style={{ fontSize: '0.875rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Articles</span>
          </div>
          <div className="stat-value">{totalArticles}</div>
        </div>
        
        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: '#166534' }}>
            <CheckCircle2 size={20} />
            <span style={{ fontSize: '0.875rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Published</span>
          </div>
          <div className="stat-value">{publishedArticles}</div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: '#854D0E' }}>
            <FileEdit size={20} />
            <span style={{ fontSize: '0.875rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Drafts</span>
          </div>
          <div className="stat-value">{draftArticles}</div>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--ink-border)', overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--ink-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Recent Articles</h2>
          <Link href="/admin/articles" className="btn btn-ghost btn-sm">View All</Link>
        </div>
        
        {recentArticles.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Author</th>
                  <th>Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {recentArticles.map((article) => (
                  <tr key={article.id}>
                    <td>
                      <Link href={`/admin/articles/${article.id}/edit`} style={{ fontWeight: 500, color: 'var(--ink-text-heading)', textDecoration: 'none' }}>
                        {article.title}
                      </Link>
                    </td>
                    <td>
                      {article.published ? (
                        <span className="status-badge status-live">Live</span>
                      ) : (
                        <span className="status-badge status-draft">Draft</span>
                      )}
                    </td>
                    <td>{article.author.name}</td>
                    <td style={{ color: 'var(--ink-text-muted)' }}>{formatDate(article.updatedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--ink-text-muted)' }}>
            <p>No articles found. Start by creating your first article.</p>
          </div>
        )}
      </div>
    </div>
  )
}
