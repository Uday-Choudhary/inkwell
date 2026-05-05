import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import ArticleCard from '@/components/ArticleCard'
import Breadcrumb from '@/components/Breadcrumb'
import TableOfContents from '@/components/TableOfContents'
import { Clock, Calendar } from 'lucide-react'

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const articles = await prisma.article.findMany({ where: { published: true }, select: { slug: true } })
  return articles.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await prisma.article.findUnique({ where: { slug, published: true }, include: { author: true } })
  if (!article) return {}
  return {
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.excerpt || '',
    openGraph: {
      title: article.metaTitle || article.title,
      description: article.metaDescription || article.excerpt || '',
      images: article.ogImage || article.coverImage ? [{ url: (article.ogImage || article.coverImage)! }] : [],
      type: 'article',
      publishedTime: article.publishedAt?.toISOString(),
      authors: [article.author.name],
    },
    twitter: { card: 'summary_large_image' },
    alternates: { canonical: `/articles/${slug}` },
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = await prisma.article.findUnique({
    where: { slug, published: true },
    include: { author: true, category: true, tags: true },
  })

  if (!article) notFound()

  const related = article.categoryId
    ? await prisma.article.findMany({
        where: { published: true, categoryId: article.categoryId, id: { not: article.id } },
        take: 3,
        orderBy: { publishedAt: 'desc' },
        include: { author: true, category: true },
      })
    : []

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    image: article.coverImage,
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: { '@type': 'Person', name: article.author.name },
    publisher: { '@type': 'Organization', name: 'Inkwell' },
    description: article.metaDescription || article.excerpt,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div style={{ background: 'var(--ink-bg)', minHeight: '100vh' }}>
        {/* Breadcrumb */}
        <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>
          <Breadcrumb items={[
            { label: 'Home', href: '/' },
            { label: 'Articles', href: '/' },
            { label: article.title },
          ]} />
        </div>

        {/* Cover image */}
        {article.coverImage && (
          <div style={{ position: 'relative', aspectRatio: '21/9', maxHeight: 480, overflow: 'hidden', marginBottom: '3rem' }}>
            <Image
              src={article.coverImage}
              alt={article.coverImageAlt || article.title}
              fill
              priority
              style={{ objectFit: 'cover' }}
              sizes="100vw"
            />
          </div>
        )}

        {/* Main content + sidebar */}
        <div className="container" style={{ paddingBottom: '4rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem' }} className="article-layout">
            {/* Article */}
            <div style={{ maxWidth: 720 }}>
              {article.category && (
                <Link href={`/?category=${article.category.slug}`} className="category-badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>
                  {article.category.name}
                </Link>
              )}
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 400, lineHeight: 1.25, color: 'var(--ink-text-heading)', marginBottom: '1.5rem' }}>
                {article.title}
              </h1>

              {/* Meta */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap', paddingBottom: '1.5rem', borderBottom: '1px solid var(--ink-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--ink-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: '0.875rem', flexShrink: 0 }}>
                    {article.author.name[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--ink-text-heading)' }}>{article.author.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--ink-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contributor</div>
                  </div>
                </div>
                {article.publishedAt && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--ink-text-muted)' }}>
                    <Calendar size={14} />
                    <time dateTime={article.publishedAt.toISOString()}>{formatDate(article.publishedAt)}</time>
                  </div>
                )}
                {article.readingTimeMinutes && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--ink-accent)', fontWeight: 500 }}>
                    <Clock size={14} />
                    {article.readingTimeMinutes} min read
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="prose" dangerouslySetInnerHTML={{ __html: article.content }} />

              {/* Tags */}
              {article.tags.length > 0 && (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--ink-border)' }}>
                  {article.tags.map((tag) => (
                    <span key={tag.id} style={{ background: 'var(--ink-bg-sidebar)', border: '1px solid var(--ink-border)', borderRadius: 99, padding: '0.25rem 0.75rem', fontSize: '0.75rem', color: 'var(--ink-text-muted)' }}>
                      #{tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar TOC */}
            <aside style={{ display: 'none' }} className="toc-aside">
              <TableOfContents content={article.content} />
            </aside>
          </div>

          {/* Related articles */}
          {related.length > 0 && (
            <section style={{ marginTop: '4rem', paddingTop: '3rem', borderTop: '1px solid var(--ink-border)' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 400, marginBottom: '1.5rem', color: 'var(--ink-text-heading)' }}>
                Related Articles
              </h2>
              <div className="grid-articles">
                {related.map((a) => <ArticleCard key={a.id} article={a} />)}
              </div>
            </section>
          )}
        </div>
      </div>

      <style>{`
        @media (min-width: 1280px) {
          .article-layout { grid-template-columns: 1fr 260px !important; }
          .toc-aside { display: block !important; }
        }
      `}</style>
    </>
  )
}
