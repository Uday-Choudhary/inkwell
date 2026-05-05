import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    await new Promise((resolve) => setTimeout(resolve, 800))
    const mockUrl = `https://picsum.photos/seed/${file.name}/800/400`
    return NextResponse.json({ url: mockUrl })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
  }
}
