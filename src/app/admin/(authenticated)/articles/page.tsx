'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { Edit, Trash2, Globe, EyeOff, Search } from 'lucide-react'
import { toast } from '@/components/ToastContainer'
import { useRouter } from 'next/navigation'

export default function AdminArticlesPage() {
  const router = useRouter()
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchArticles = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/articles?published=false&limit=100')
      const data = await res.json()
      if (data.articles) setArticles(data.articles)
    } catch (err) {
      toast({ type: 'error', message: 'Failed to fetch articles' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArticles()
  }, [])

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return

    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast({ type: 'success', message: 'Article deleted successfully' })
        fetchArticles()
      } else {
        throw new Error('Failed to delete')
      }
    } catch (err) {
      toast({ type: 'error', message: 'Error deleting article' })
    }
  }

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/articles/${id}/publish`, { method: 'POST' })
      if (res.ok) {
        toast({ type: 'success', message: `Article ${currentStatus ? 'unpublished' : 'published'} successfully` })
        fetchArticles()
        router.refresh()
      } else {
        throw new Error('Failed to toggle status')
      }
    } catch (err) {
      toast({ type: 'error', message: 'Error updating article status' })
    }
  }

  const filteredArticles = articles.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div style={{ padding: '2rem 3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--ink-text-heading)' }}>Articles</h1>
          <p style={{ color: 'var(--ink-text-muted)', fontSize: '0.875rem' }}>Manage your blog posts and content</p>
        </div>
        <Link href="/admin/articles/new" className="btn btn-primary">
          + New Article
        </Link>
      </div>

      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--ink-border)', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--ink-border)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: 400 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-text-muted)' }} />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--ink-text-muted)' }}>Loading articles...</div>
        ) : filteredArticles.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.map((article) => (
                  <tr key={article.id}>
                    <td>
                      <div style={{ fontWeight: 500, color: 'var(--ink-text-heading)' }}>{article.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--ink-text-muted)', marginTop: '0.25rem' }}>/{article.slug}</div>
                    </td>
                    <td>
                      {article.published ? (
                        <span className="status-badge status-live">Live</span>
                      ) : (
                        <span className="status-badge status-draft">Draft</span>
                      )}
                    </td>
                    <td style={{ color: 'var(--ink-text-muted)' }}>
                      {article.publishedAt ? formatDate(article.publishedAt) : '-'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleTogglePublish(article.id, article.published)}
                          className="btn btn-ghost btn-sm"
                          title={article.published ? "Unpublish" : "Publish"}
                          style={{ color: article.published ? '#854D0E' : '#166534' }}
                        >
                          {article.published ? <EyeOff size={16} /> : <Globe size={16} />}
                        </button>
                        <Link href={`/admin/articles/${article.id}/edit`} className="btn btn-ghost btn-sm" title="Edit">
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(article.id, article.title)}
                          className="btn btn-ghost btn-sm"
                          title="Delete"
                          style={{ color: '#DC2626' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--ink-text-muted)' }}>
            <p>No articles found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
