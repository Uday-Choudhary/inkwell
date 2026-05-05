import Link from 'next/link'
import { Clock, User } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface ArticleCardProps {
  article: {
    slug: string
    title: string
    excerpt?: string | null
    coverImage?: string | null
    coverImageAlt?: string | null
    publishedAt?: Date | null
    readingTimeMinutes?: number | null
    category?: { name: string; slug: string } | null
    author: { name: string }
  }
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="article-card">
      {/* Thumbnail */}
      <Link href={`/articles/${article.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div className="article-card-thumb">
          {article.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={article.coverImage}
              alt={article.coverImageAlt || article.title}
              className="article-card-img"
              loading="lazy"
            />
          ) : (
            <div className="article-card-placeholder">
              <div className="article-card-placeholder-overlay" />
              <span className="article-card-placeholder-icon">✍</span>
            </div>
          )}

          {/* Category pill over image */}
          {article.category && (
            <div className="article-card-cat-pill">
              {article.category.name}
            </div>
          )}
        </div>
      </Link>

      {/* Body */}
      <div className="article-card-body">
        <Link href={`/articles/${article.slug}`} style={{ textDecoration: 'none' }}>
          <h2 className="article-card-title">{article.title}</h2>
        </Link>

        {article.excerpt && (
          <p className="article-card-excerpt">{article.excerpt}</p>
        )}

        <div className="article-card-meta">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            <User size={11} style={{ opacity: 0.5 }} />
            {article.author.name}
          </span>
          {article.publishedAt && (
            <>
              <span style={{ opacity: 0.35 }}>·</span>
              <time dateTime={new Date(article.publishedAt).toISOString()}>
                {formatDate(article.publishedAt)}
              </time>
            </>
          )}
          {article.readingTimeMinutes && (
            <>
              <span style={{ opacity: 0.35 }}>·</span>
              <span className="reading-time-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                <Clock size={11} />
                {article.readingTimeMinutes} min
              </span>
            </>
          )}
        </div>
      </div>
    </article>
  )
}
