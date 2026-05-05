import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import Groq from 'groq-sdk'
import { AIMetaSchema } from '@/lib/validations'
import { generateSlug } from '@/lib/utils'

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'AI not configured' }, { status: 500 })

  const body = await request.json()
  const parsed = AIMetaSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Validation error', details: parsed.error.issues }, { status: 422 })

  const { title, excerpt } = parsed.data

  const groq = new Groq({ apiKey })

  const prompt = `You are an SEO expert. Given the following article title and excerpt, generate a highly engaging, SEO-optimized meta description (under 160 characters) and a short URL slug (lowercase, hyphens instead of spaces, no special characters).

Article Title: "${title}"
Excerpt: "${excerpt || 'No excerpt provided.'}"

Return the response in the following JSON format ONLY, nothing else:
{
  "metaDescription": "your generated description here",
  "slug": "your-generated-slug"
}
`

  try {
    const response = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [{ role: 'user', content: prompt }],
    })

    const text = response.choices[0]?.message?.content || ''
    
    let result: { metaDescription?: string; slug?: string } | null = null
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]) as { metaDescription?: string; slug?: string }
    }

    if (result && result.metaDescription) {
        return NextResponse.json({
            metaDescription: result.metaDescription.substring(0, 160),
            slug: result.slug ? generateSlug(result.slug) : generateSlug(title)
        })
    }
    
    return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 })

  } catch (error) {
    console.error('AI error:', error)
    return NextResponse.json({ error: 'AI generation failed' }, { status: 500 })
  }
}
