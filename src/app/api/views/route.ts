import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createHash } from 'crypto'

// Hash IP for privacy
function hashIP(ip: string): string {
  return createHash('sha256').update(ip + process.env.DATABASE_URL).digest('hex').slice(0, 16)
}

// POST: Record a page view
export async function POST(request: NextRequest) {
  try {
    const { slug } = await request.json()

    if (!slug) {
      return NextResponse.json({ error: 'slug required' }, { status: 400 })
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') ||
               'unknown'
    const ipHash = hashIP(ip)

    // Throttle: same IP can only count once per 10 minutes per slug
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000)

    const recentView = await prisma.pageView.findFirst({
      where: {
        slug,
        ipHash,
        viewedAt: { gte: tenMinutesAgo }
      }
    })

    if (recentView) {
      return NextResponse.json({ success: true, throttled: true })
    }

    await prisma.pageView.create({
      data: { slug, ipHash }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error recording view:', error)
    return NextResponse.json({ error: 'Failed to record view' }, { status: 500 })
  }
}

// GET: Get view count for a slug
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    if (!slug) {
      return NextResponse.json({ error: 'slug required' }, { status: 400 })
    }

    const count = await prisma.pageView.count({
      where: { slug }
    })

    return NextResponse.json({ slug, count })
  } catch (error) {
    console.error('Error getting view count:', error)
    return NextResponse.json({ error: 'Failed to get view count' }, { status: 500 })
  }
}
