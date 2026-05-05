import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
import ArticleCard from '@/components/ArticleCard'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Rss, ArrowRight, BookOpen, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Articles — Inkwell',
  description: 'Discover well-crafted articles on technology, culture, and ideas — optimised for reading and discovery.',
}

const PER_PAGE = 9

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>
}) {
  const params = await searchParams
  const page = Math.max(1, parseInt(params.page || '1'))
  const categorySlug = params.category

  const where = {
    published: true,
    ...(categorySlug ? { category: { slug: categorySlug } } : {}),
  }

  const [articles, total, categories] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
      include: { author: true, category: true },
    }),
    prisma.article.count({ where }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ])

  const totalPages = Math.ceil(total / PER_PAGE)
  const featuredArticle = page === 1 && !categorySlug ? articles[0] : null
  const gridArticles = featuredArticle ? articles.slice(1) : articles

  return (
    <div style={{ background: 'var(--ink-bg)', minHeight: '100vh' }}>

      {/* ── Masthead Hero ─────────────────────────────────────── */}
      {!featuredArticle && page === 1 && !categorySlug && (
        <section className="home-masthead">
          <div className="container">
            <div className="masthead-inner">
              <div className="masthead-badge">
                <Sparkles size={12} />
                <span>Editorial Platform</span>
              </div>
              <h1 className="masthead-headline">
                Thoughtful writing,<br />
                <em>beautifully delivered.</em>
              </h1>
              <p className="masthead-sub">
                A curated space for in-depth articles on technology, culture,
                and ideas — crafted for readers, optimised for discovery.
              </p>
              <Link href="/rss.xml" className="btn btn-ghost btn-sm masthead-rss">
                <Rss size={14} />
                Subscribe via RSS
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Featured Article Hero ──────────────────────────────── */}
      {featuredArticle && (
        <section className="featured-hero">
          <div className="container">
            <div className="featured-hero-inner">
              <div className="featured-hero-content">
                <div className="featured-label">
                  <BookOpen size={12} />
                  <span>{featuredArticle.category?.name || 'Featured'}</span>
                </div>
                <h1 className="featured-hero-title">{featuredArticle.title}</h1>
                {featuredArticle.excerpt && (
                  <p className="featured-hero-excerpt">{featuredArticle.excerpt}</p>
                )}
                <div className="featured-hero-meta">
                  <span>{featuredArticle.author.name}</span>
                  {featuredArticle.publishedAt && (
                    <>
                      <span className="featured-meta-dot">·</span>
                      <span>{new Date(featuredArticle.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </>
                  )}
                </div>
                <Link href={`/articles/${featuredArticle.slug}`} className="btn btn-primary btn-lg featured-cta">
                  Read Article <ArrowRight size={16} />
                </Link>
              </div>
              <div className="featured-hero-visual">
                {featuredArticle.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={featuredArticle.coverImage}
                    alt={featuredArticle.coverImageAlt || featuredArticle.title}
                    className="featured-hero-img"
                  />
                ) : (
                  <div className="featured-hero-placeholder">
                    <span>✍</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Articles Section ───────────────────────────────────── */}
      <div className="container home-articles-section">

        {/* Section header + category filter */}
        <div className="articles-section-header">
          <div>
            <h2 className="articles-section-title">
              {categorySlug
                ? categories.find(c => c.slug === categorySlug)?.name ?? 'Articles'
                : page === 1 ? 'Latest Articles' : `Page ${page}`}
            </h2>
            <p className="articles-section-count">
              {total} article{total !== 1 ? 's' : ''}
            </p>
          </div>

          {categories.length > 0 && (
            <div className="filter-pills">
              <Link href="/" className={`filter-pill ${!categorySlug ? 'active' : ''}`}>All</Link>
              {categories.map((cat) => (
                <Link key={cat.id} href={`/?category=${cat.slug}`} className={`filter-pill ${categorySlug === cat.slug ? 'active' : ''}`}>
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="section-divider" />

        {/* Grid */}
        {gridArticles.length > 0 ? (
          <div className="grid-articles">
            {gridArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📝</div>
            <h3 className="empty-state-title">No articles yet</h3>
            <p className="empty-state-sub">
              {categorySlug
                ? 'No articles in this category yet. Try a different filter.'
                : 'Check back soon — new content is on its way.'}
            </p>
            {categorySlug && (
              <Link href="/" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
                View all articles
              </Link>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            {page > 1 ? (
              <Link href={`/?page=${page - 1}${categorySlug ? `&category=${categorySlug}` : ''}`} className="btn btn-secondary btn-sm">
                <ChevronLeft size={15} /> Previous
              </Link>
            ) : <span />}
            <span className="pagination-info">Page {page} of {totalPages}</span>
            {page < totalPages ? (
              <Link href={`/?page=${page + 1}${categorySlug ? `&category=${categorySlug}` : ''}`} className="btn btn-secondary btn-sm">
                Next <ChevronRight size={15} />
              </Link>
            ) : <span />}
          </div>
        )}

        {/* RSS link */}
        <div className="rss-row">
          <Link href="/rss.xml" className="btn btn-ghost btn-sm" style={{ color: 'var(--ink-text-muted)' }}>
            <Rss size={14} /> RSS Feed
          </Link>
        </div>
      </div>

      <style>{`
        /* ── Masthead ────────────────── */
        .home-masthead {
          background: linear-gradient(135deg, var(--ink-bg-dark) 0%, #1e3a5f 60%, #243447 100%);
          padding: 5rem 0 4rem;
          position: relative;
          overflow: hidden;
        }
        .home-masthead::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 60% at 60% 40%, rgba(46,125,96,0.18) 0%, transparent 70%);
        }
        .masthead-inner {
          position: relative;
          max-width: 680px;
        }
        .masthead-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.8);
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          padding: 0.3rem 0.875rem;
          border-radius: 99px;
          margin-bottom: 1.5rem;
          backdrop-filter: blur(4px);
        }
        .masthead-headline {
          font-family: var(--font-display);
          font-size: clamp(2.5rem, 6vw, 4rem);
          font-weight: 400;
          color: #fff;
          line-height: 1.15;
          margin-bottom: 1.25rem;
          letter-spacing: -0.01em;
        }
        .masthead-headline em {
          font-style: italic;
          color: var(--ink-accent);
        }
        .masthead-sub {
          font-size: 1.0625rem;
          color: rgba(255,255,255,0.65);
          line-height: 1.7;
          margin-bottom: 2rem;
          max-width: 520px;
        }
        .masthead-rss {
          color: rgba(255,255,255,0.6) !important;
          border-color: rgba(255,255,255,0.2) !important;
        }
        .masthead-rss:hover {
          background: rgba(255,255,255,0.08) !important;
          color: rgba(255,255,255,0.9) !important;
        }

        /* ── Featured Hero ───────────── */
        .featured-hero {
          background: linear-gradient(135deg, var(--ink-bg-dark) 0%, #1a2d45 100%);
          padding: 4rem 0;
          margin-bottom: 0;
        }
        .featured-hero-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: center;
        }
        @media (max-width: 768px) {
          .featured-hero-inner { grid-template-columns: 1fr; }
          .featured-hero-visual { order: -1; }
        }
        .featured-label {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          background: rgba(232,168,56,0.18);
          border: 1px solid rgba(232,168,56,0.3);
          color: var(--ink-accent);
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 0.3rem 0.875rem;
          border-radius: 99px;
          margin-bottom: 1.25rem;
        }
        .featured-hero-title {
          font-family: var(--font-display);
          font-size: clamp(1.75rem, 4vw, 3rem);
          font-weight: 400;
          color: #fff;
          line-height: 1.2;
          margin-bottom: 1rem;
          letter-spacing: -0.01em;
        }
        .featured-hero-excerpt {
          font-size: 1.0625rem;
          color: rgba(255,255,255,0.65);
          line-height: 1.7;
          margin-bottom: 1.25rem;
        }
        .featured-hero-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8125rem;
          color: rgba(255,255,255,0.45);
          margin-bottom: 2rem;
        }
        .featured-meta-dot { opacity: 0.4; }
        .featured-cta {
          background: var(--ink-accent) !important;
          color: var(--ink-bg-dark) !important;
          font-weight: 600 !important;
        }
        .featured-cta:hover {
          background: #f0b840 !important;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(232,168,56,0.35) !important;
        }
        .featured-hero-visual {
          border-radius: 16px;
          overflow: hidden;
          aspect-ratio: 4/3;
          box-shadow: 0 24px 64px rgba(0,0,0,0.4);
        }
        .featured-hero-img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
        }
        .featured-hero-placeholder {
          width: 100%; height: 100%;
          background: linear-gradient(135deg, var(--ink-primary) 0%, var(--ink-primary-light) 100%);
          display: flex; align-items: center; justify-content: center;
          font-size: 4rem;
        }

        /* ── Articles section ────────── */
        .home-articles-section {
          padding-top: 3rem;
          padding-bottom: 4rem;
        }
        .articles-section-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 1.25rem;
        }
        .articles-section-title {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 400;
          color: var(--ink-text-heading);
          margin-bottom: 0.125rem;
        }
        .articles-section-count {
          font-size: 0.8125rem;
          color: var(--ink-text-muted);
        }
        .section-divider {
          height: 1px;
          background: var(--ink-border);
          margin-bottom: 2rem;
        }

        /* ── Empty state ─────────────── */
        .empty-state {
          text-align: center;
          padding: 5rem 1rem;
          color: var(--ink-text-muted);
        }
        .empty-state-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          filter: grayscale(0.3);
        }
        .empty-state-title {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 400;
          color: var(--ink-text-heading);
          margin-bottom: 0.5rem;
        }
        .empty-state-sub {
          font-size: 0.9375rem;
          max-width: 360px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* ── Pagination ──────────────── */
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          margin-top: 3rem;
        }
        .pagination-info {
          font-size: 0.875rem;
          color: var(--ink-text-muted);
        }

        /* ── RSS row ─────────────────── */
        .rss-row {
          text-align: center;
          margin-top: 2rem;
        }
      `}</style>
    </div>
  )
}
