import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { ArticleUpdateSchema } from '@/lib/validations'
import { calculateReadingTime, extractExcerpt } from '@/lib/utils'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const article = await prisma.article.findUnique({
    where: { id },
    include: { author: true, category: true, tags: true },
  })

  if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(article)
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const parsed = ArticleUpdateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Validation error', details: parsed.error.issues }, { status: 422 })

  const data = parsed.data

  let updates: any = { ...data }
  // coerce empty strings → undefined so Prisma stores NULL (avoids FK violations)
  if ('categoryId' in updates) updates.categoryId = updates.categoryId || undefined
  if ('coverImage' in updates) updates.coverImage = updates.coverImage || undefined
  if ('ogImage' in updates) updates.ogImage = updates.ogImage || undefined
  if (data.content) {
    updates.readingTimeMinutes = calculateReadingTime(data.content)
    updates.excerpt = data.excerpt || extractExcerpt(data.content)
  }

  try {
    const article = await prisma.article.update({
      where: { id },
      data: updates,
    })
    return NextResponse.json(article)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  try {
    await prisma.article.delete({ where: { id } })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 })
  }
}
