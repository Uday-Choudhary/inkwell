import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
import ArticleCard from '@/components/ArticleCard'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Rss } from 'lucide-react'

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
      {/* Hero */}
      {featuredArticle && (
        <section style={{ background: 'linear-gradient(135deg, var(--ink-bg-dark) 0%, #243447 100%)', padding: '4rem 0', marginBottom: '3rem' }}>
          <div className="container">
            <div style={{ maxWidth: 720 }}>
              <span className="category-badge" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', borderColor: 'transparent', marginBottom: '1rem', display: 'inline-block' }}>
                {featuredArticle.category?.name || 'Featured'}
              </span>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 400, color: '#fff', lineHeight: 1.2, marginBottom: '1.25rem' }}>
                {featuredArticle.title}
              </h1>
              {featuredArticle.excerpt && (
                <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.75)', marginBottom: '2rem', lineHeight: 1.7 }}>
                  {featuredArticle.excerpt}
                </p>
              )}
              <Link href={`/articles/${featuredArticle.slug}`} className="btn btn-primary">
                Read article →
              </Link>
            </div>
          </div>
        </section>
      )}

      <div className="container" style={{ paddingBottom: '4rem' }}>
        {/* Category filter */}
        {categories.length > 0 && (
          <div className="filter-pills" style={{ marginBottom: '2rem' }}>
            <Link href="/" className={`filter-pill ${!categorySlug ? 'active' : ''}`}>All</Link>
            {categories.map((cat) => (
              <Link key={cat.id} href={`/?category=${cat.slug}`} className={`filter-pill ${categorySlug === cat.slug ? 'active' : ''}`}>
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        {/* Article grid */}
        {gridArticles.length > 0 ? (
          <div className="grid-articles">
            {gridArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--ink-text-muted)' }}>
            <p style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No articles yet</p>
            <p>Check back soon for new content.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '3rem' }}>
            {page > 1 ? (
              <Link href={`/?page=${page - 1}${categorySlug ? `&category=${categorySlug}` : ''}`} className="btn btn-secondary btn-sm">
                <ChevronLeft size={15} /> Previous
              </Link>
            ) : <span />}
            <span style={{ fontSize: '0.875rem', color: 'var(--ink-text-muted)' }}>Page {page} of {totalPages}</span>
            {page < totalPages ? (
              <Link href={`/?page=${page + 1}${categorySlug ? `&category=${categorySlug}` : ''}`} className="btn btn-secondary btn-sm">
                Next <ChevronRight size={15} />
              </Link>
            ) : <span />}
          </div>
        )}

        {/* RSS Link */}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link href="/rss.xml" className="btn btn-ghost btn-sm" style={{ color: 'var(--ink-text-muted)' }}>
            <Rss size={14} /> RSS Feed
          </Link>
        </div>
      </div>
    </div>
  )
}
