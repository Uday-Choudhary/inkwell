import Link from 'next/link'
import Image from 'next/image'
import { Clock } from 'lucide-react'
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
      <Link href={`/articles/${article.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', background: 'var(--ink-bg-sidebar)' }}>
          {article.coverImage ? (
            <Image
              src={article.coverImage}
              alt={article.coverImageAlt || article.title}
              fill
              className="article-card-image"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--ink-primary) 0%, var(--ink-primary-light) 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'rgba(255,255,255,0.3)' }}>✍</span>
            </div>
          )}
        </div>
      </Link>

      <div className="article-card-body">
        {article.category && (
          <span className="article-card-category">{article.category.name}</span>
        )}

        <Link href={`/articles/${article.slug}`} style={{ textDecoration: 'none' }}>
          <h2 className="article-card-title">{article.title}</h2>
        </Link>

        {article.excerpt && <p className="article-card-excerpt">{article.excerpt}</p>}

        <div className="article-card-meta">
          <span>{article.author.name}</span>
          <span>·</span>
          {article.publishedAt && (
            <time dateTime={new Date(article.publishedAt).toISOString()}>
              {formatDate(article.publishedAt)}
            </time>
          )}
          {article.readingTimeMinutes && (
            <>
              <span>·</span>
              <span className="reading-time-badge">
                <Clock size={11} style={{ display: 'inline', marginRight: 2 }} />
                {article.readingTimeMinutes} min read
              </span>
            </>
          )}
        </div>
      </div>
    </article>
  )
}
