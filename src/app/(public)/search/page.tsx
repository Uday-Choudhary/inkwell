'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Search, Clock, ArrowRight, X } from 'lucide-react'

interface ArticleResult {
  id: string
  slug: string
  title: string
  excerpt?: string | null
  readingTimeMinutes?: number | null
  publishedAt?: string | null
  category?: { name: string; slug: string } | null
  author: { name: string }
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ArticleResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!query.trim()) {
      setResults([])
      setSearched(false)
      return
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`)
        if (res.ok) {
          const data = await res.json()
          setResults(data.articles || [])
        } else {
          setResults([])
        }
      } catch {
        setResults([])
      } finally {
        setLoading(false)
        setSearched(true)
      }
    }, 350)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

  return (
    <div style={{ background: 'var(--ink-bg)', minHeight: '100vh' }}>

      {/* Header band */}
      <section className="search-hero">
        <div className="container">
          <h1 className="search-title">Search Articles</h1>
          <p className="search-subtitle">Find in-depth writing on technology, culture, and ideas.</p>

          <div className="search-box-wrap">
            <Search size={18} className="search-icon" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Type to search…"
              className="search-input"
              aria-label="Search articles"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="search-clear"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Results */}
      <div className="container search-results-wrap">
        {loading && (
          <div className="search-status">
            <div className="search-spinner" />
            <span>Searching…</span>
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="search-empty">
            <div className="search-empty-icon">🔍</div>
            <h2 className="search-empty-title">No results for &ldquo;{query}&rdquo;</h2>
            <p className="search-empty-sub">Try different keywords or browse all articles.</p>
            <Link href="/" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
              Browse All Articles
            </Link>
          </div>
        )}

        {!loading && results.length > 0 && (
          <>
            <p className="search-result-count">
              {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
            </p>
            <ul className="search-result-list">
              {results.map(article => (
                <li key={article.id} className="search-result-item">
                  <Link href={`/articles/${article.slug}`} className="search-result-link">
                    <div className="search-result-meta">
                      {article.category && (
                        <span className="article-card-category">{article.category.name}</span>
                      )}
                      {article.readingTimeMinutes && (
                        <span className="search-result-time">
                          <Clock size={11} /> {article.readingTimeMinutes} min read
                        </span>
                      )}
                    </div>
                    <h2 className="search-result-title">{article.title}</h2>
                    {article.excerpt && (
                      <p className="search-result-excerpt">{article.excerpt}</p>
                    )}
                    <div className="search-result-author">
                      <span>{article.author.name}</span>
                      {article.publishedAt && (
                        <>
                          <span>·</span>
                          <span>{new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </>
                      )}
                    </div>
                    <span className="search-result-cta">
                      Read article <ArrowRight size={13} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}

        {!query && !searched && (
          <div className="search-prompt">
            <p>Start typing above to search articles.</p>
          </div>
        )}
      </div>

      <style>{`
        .search-hero {
          background: linear-gradient(135deg, var(--ink-bg-dark) 0%, #1e3347 100%);
          padding: 4rem 0 3rem;
          position: relative;
          overflow: hidden;
        }
        .search-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 60% 80% at 30% 60%, rgba(46,125,96,0.15) 0%, transparent 65%);
        }
        .search-title {
          font-family: var(--font-display);
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 400;
          color: #fff;
          margin-bottom: 0.5rem;
          position: relative;
        }
        .search-subtitle {
          font-size: 1rem;
          color: rgba(255,255,255,0.55);
          margin-bottom: 2rem;
          position: relative;
        }
        .search-box-wrap {
          position: relative;
          max-width: 640px;
        }
        .search-icon {
          position: absolute;
          left: 1.125rem;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.4);
          pointer-events: none;
        }
        .search-input {
          width: 100%;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 12px;
          padding: 0.875rem 3rem 0.875rem 3rem;
          font-size: 1rem;
          font-family: var(--font-body);
          color: #fff;
          outline: none;
          transition: border-color 200ms, background 200ms, box-shadow 200ms;
          backdrop-filter: blur(4px);
          -webkit-appearance: none;
        }
        .search-input::placeholder { color: rgba(255,255,255,0.3); }
        .search-input:focus {
          border-color: var(--ink-primary-light);
          background: rgba(255,255,255,0.1);
          box-shadow: 0 0 0 3px rgba(46,125,96,0.25);
        }
        .search-clear {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(255,255,255,0.4);
          padding: 0.25rem;
          border-radius: 4px;
          display: flex;
          align-items: center;
        }
        .search-clear:hover { color: rgba(255,255,255,0.8); }

        .search-results-wrap {
          padding-top: 2.5rem;
          padding-bottom: 4rem;
          min-height: 40vh;
        }
        .search-status {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: var(--ink-text-muted);
          font-size: 0.9375rem;
          padding: 2rem 0;
        }
        .search-spinner {
          width: 18px; height: 18px;
          border: 2px solid var(--ink-border);
          border-top-color: var(--ink-primary);
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .search-empty {
          text-align: center;
          padding: 4rem 1rem;
        }
        .search-empty-icon { font-size: 3rem; margin-bottom: 1rem; }
        .search-empty-title {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 400;
          color: var(--ink-text-heading);
          margin-bottom: 0.5rem;
        }
        .search-empty-sub { color: var(--ink-text-muted); font-size: 0.9375rem; }

        .search-result-count {
          font-size: 0.875rem;
          color: var(--ink-text-muted);
          margin-bottom: 1.5rem;
        }
        .search-result-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 1px;
          border: 1px solid var(--ink-border);
          border-radius: 16px;
          overflow: hidden;
          background: var(--ink-border);
        }
        .search-result-item {
          background: var(--ink-bg-card);
        }
        .search-result-link {
          display: block;
          padding: 1.5rem;
          text-decoration: none;
          transition: background 150ms;
        }
        .search-result-link:hover { background: #F5FAF7; }
        .search-result-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }
        .search-result-time {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          color: var(--ink-accent);
          font-weight: 500;
        }
        .search-result-title {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 400;
          color: var(--ink-text-heading);
          line-height: 1.35;
          margin-bottom: 0.375rem;
          transition: color 150ms;
        }
        .search-result-link:hover .search-result-title { color: var(--ink-primary); }
        .search-result-excerpt {
          font-size: 0.875rem;
          color: var(--ink-text-muted);
          line-height: 1.6;
          margin-bottom: 0.75rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .search-result-author {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.8125rem;
          color: var(--ink-text-muted);
          margin-bottom: 0.75rem;
        }
        .search-result-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--ink-primary);
        }

        .search-prompt {
          padding: 3rem 0;
          text-align: center;
          color: var(--ink-text-muted);
          font-size: 0.9375rem;
        }
      `}</style>
    </div>
  )
}
