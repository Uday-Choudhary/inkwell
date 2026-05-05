import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim()

  if (!q || q.length < 2) {
    return NextResponse.json({ articles: [] })
  }

  try {
    const articles = await prisma.article.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { excerpt: { contains: q, mode: 'insensitive' } },
          { category: { name: { contains: q, mode: 'insensitive' } } },
        ],
      },
      orderBy: { publishedAt: 'desc' },
      take: 20,
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        readingTimeMinutes: true,
        publishedAt: true,
        category: { select: { name: true, slug: true } },
        author: { select: { name: true } },
      },
    })

    return NextResponse.json({ articles })
  } catch (err) {
    console.error('[search]', err)
    return NextResponse.json({ articles: [] }, { status: 500 })
  }
}
