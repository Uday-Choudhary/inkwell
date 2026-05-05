import ArticleEditor from '@/components/ArticleEditor'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const article = await prisma.article.findUnique({
    where: { id },
  })

  if (!article) notFound()

  return <ArticleEditor initialData={article} isEdit />
}
