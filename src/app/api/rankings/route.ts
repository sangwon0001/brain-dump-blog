import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Period = 'daily' | 'weekly' | 'monthly' | 'total'

function getPeriodDate(period: Period): Date | null {
  const now = new Date()
  switch (period) {
    case 'daily':
      return new Date(now.setHours(0, 0, 0, 0))
    case 'weekly':
      return new Date(now.setDate(now.getDate() - 7))
    case 'monthly':
      return new Date(now.setDate(now.getDate() - 30))
    case 'total':
      return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = (searchParams.get('period') || 'total') as Period
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50)

    const periodDate = getPeriodDate(period)

    const rankings = await prisma.pageView.groupBy({
      by: ['slug'],
      _count: { slug: true },
      where: periodDate ? { viewedAt: { gte: periodDate } } : undefined,
      orderBy: { _count: { slug: 'desc' } },
      take: limit
    })

    const result = rankings.map(r => ({
      slug: r.slug,
      views: r._count.slug
    }))

    return NextResponse.json(
      { period, rankings: result },
      {
        headers: {
          // Cache for 1 hour
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200'
        }
      }
    )
  } catch (error) {
    console.error('Error getting rankings:', error)
    return NextResponse.json({ error: 'Failed to get rankings' }, { status: 500 })
  }
}
