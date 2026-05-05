import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { ArticleCreateSchema } from '@/lib/validations'
import { generateSlug, calculateReadingTime, extractExcerpt } from '@/lib/utils'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const session = await auth()
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const publishedOnly = !session && searchParams.get('published') !== 'false'

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where: publishedOnly ? { published: true } : {},
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: { author: { select: { id: true, name: true, avatar: true } }, category: true },
    }),
    prisma.article.count({ where: publishedOnly ? { published: true } : {} }),
  ])

  return NextResponse.json({ articles, total, page, totalPages: Math.ceil(total / limit) })
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const userEmail = session.user?.email
    if (!userEmail) {
      console.error('POST /api/articles: session has no email', JSON.stringify(session))
      return NextResponse.json({ error: 'Session email missing — please log out and log in again' }, { status: 400 })
    }

    const body = await request.json()
    const parsed = ArticleCreateSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Validation error', details: parsed.error.issues }, { status: 422 })

    const data = parsed.data

    // Ensure slug uniqueness
    let slug = data.slug || generateSlug(data.title)
    const existing = await prisma.article.findUnique({ where: { slug } })
    if (existing) slug = `${slug}-${Date.now()}`

    const readingTime = calculateReadingTime(data.content)
    const excerpt = data.excerpt || extractExcerpt(data.content)

    // Find Author linked to the logged-in user's email
    const author = await prisma.author.findUnique({ where: { email: userEmail } })
    if (!author) {
      console.error(`POST /api/articles: no Author found for email "${userEmail}"`)
      return NextResponse.json({ error: `No author profile for ${userEmail}. Please contact admin.` }, { status: 400 })
    }

    const article = await prisma.article.create({
      data: {
        ...data,
        authorId: author.id,
        slug,
        excerpt,
        readingTimeMinutes: readingTime,
        publishedAt: data.published ? new Date() : null,
      },
    })

    return NextResponse.json(article, { status: 201 })
  } catch (error: any) {
    console.error('POST /api/articles unexpected error:', error)
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 })
  }
}
