---
title: "Whipping Up a Blog with Claude Code (Part 7: Popular Post Rankings and Analytics)"
description: "View tracking and popular-post rankings with Neon + Prisma 7. GA4 and Hotjar in the same pass."
date: "2026-02-04"
tags: ["claude-code", "nextjs", "blog", "prisma", "neon", "analytics", "Develop"]
series: "Whipping Up a Blog with Claude Code"
---

## The last one left

In Part 6 I said "the popular-post ranking needs an Analytics API integration, so later." Later is now.

```
@roadmap.md alright, let's do the last one
```

## How should this work?

The question was where to get the view data from.

| Approach | Pro | Con |
|------|------|------|
| Vercel Analytics | already there | no API (dashboard only) |
| GA4 API | free, accurate | complex setup |
| Umami | open source | needs its own server |
| Roll my own | fully custom | needs a DB |

Vercel Analytics has no API, so you can't pull the data from code. GA4's setup is too involved.

Conclusion: roll my own with **Neon (PostgreSQL) + Prisma**.

Vercel has a Neon integration so connecting is easy. Prisma 7 supports the Neon adapter.

## 1. Neon setup

Vercel dashboard → Storage → Create Database → Neon Postgres

Environment variables get created automatically.

```bash
# .env.local
DATABASE_URL="postgresql://...@...neon.tech/neondb?sslmode=require"
```

## 2. Prisma 7 setup

Prisma 7 changed a bit. You don't put the url in `schema.prisma` directly anymore; you use `prisma.config.ts`.

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}

model PageView {
  id        Int      @id @default(autoincrement())
  slug      String
  ipHash    String   @map("ip_hash")
  viewedAt  DateTime @default(now()) @map("viewed_at")

  @@index([slug])
  @@index([viewedAt])
  @@index([slug, ipHash, viewedAt])
  @@map("page_views")
}
```

The Prisma client uses the Neon adapter.

```typescript
// src/lib/prisma.ts
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'

function createPrismaClient() {
  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()
```

## 3. Views API

Count on post view, dedupe by IP hash.

```typescript
// src/app/api/views/route.ts
export async function POST(request: NextRequest) {
  const { slug } = await request.json()

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
  const ipHash = hashIP(ip)  // SHA256 hash

  // count the same IP at most once per 10 minutes
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000)
  const recentView = await prisma.pageView.findFirst({
    where: { slug, ipHash, viewedAt: { gte: tenMinutesAgo } }
  })

  if (recentView) {
    return NextResponse.json({ success: true, throttled: true })
  }

  await prisma.pageView.create({ data: { slug, ipHash } })
  return NextResponse.json({ success: true })
}
```

The IP is hashed before storage. That covers privacy and gives you throttling.

## 4. Rankings API

Compute the per-period ranking directly in SQL.

```typescript
// src/app/api/rankings/route.ts
export async function GET(request: NextRequest) {
  const period = searchParams.get('period') || 'total'  // daily, weekly, monthly, total
  const periodDate = getPeriodDate(period)

  const rankings = await prisma.pageView.groupBy({
    by: ['slug'],
    _count: { slug: true },
    where: periodDate ? { viewedAt: { gte: periodDate } } : undefined,
    orderBy: { _count: { slug: 'desc' } },
    take: limit
  })

  return NextResponse.json(
    { period, rankings },
    { headers: { 'Cache-Control': 'public, s-maxage=3600' } }  // 1 hour cache
  )
}
```

A one-hour cache keeps the DB load down. It doesn't need to be real-time.

## 5. Components

### ViewCounter

Displays and records the view count on the post page.

```typescript
// src/components/ViewCounter.tsx
export function ViewCounter({ slug }: { slug: string }) {
  const [views, setViews] = useState<number | null>(null)

  useEffect(() => {
    // record the view
    fetch('/api/views', {
      method: 'POST',
      body: JSON.stringify({ slug })
    })

    // fetch the count
    fetch(`/api/views?slug=${slug}`)
      .then(res => res.json())
      .then(data => setViews(data.count))
  }, [slug])

  return <span>{views?.toLocaleString()} views</span>
}
```

### PopularPosts

Shows the popular-post list on the home page.

```typescript
// src/components/PopularPosts.tsx
export function PopularPosts({ postTitles }) {
  const [period, setPeriod] = useState('total')
  const [rankings, setRankings] = useState([])

  useEffect(() => {
    fetch(`/api/rankings?period=${period}&limit=5`)
      .then(res => res.json())
      .then(data => setRankings(data.rankings))
  }, [period])

  return (
    <div>
      <select value={period} onChange={e => setPeriod(e.target.value)}>
        <option value="daily">Today</option>
        <option value="weekly">This week</option>
        <option value="monthly">This month</option>
        <option value="total">All time</option>
      </select>
      <ol>
        {rankings.map((item, i) => (
          <li key={item.slug}>
            {i + 1}. {postTitles[item.slug]?.title} ({item.views} views)
          </li>
        ))}
      </ol>
    </div>
  )
}
```

## 6. GA4 & Hotjar

View counts are hand-rolled, but you still want real analytics.

- **GA4**: traffic analysis, referral paths, event tracking
- **Hotjar**: heatmaps, session recordings, behavior analysis

Both are just script tags.

```typescript
// src/components/Analytics.tsx
export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID
  if (!gaId) return null

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  )
}

export function Hotjar() {
  const hotjarId = process.env.NEXT_PUBLIC_HOTJAR_ID
  if (!hotjarId) return null

  return (
    <Script id="hotjar">
      {`
        (function(h,o,t,j,a,r){
          h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
          h._hjSettings={hjid:${hotjarId},hjsv:6};
          // ...
        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
      `}
    </Script>
  )
}
```

No env var, no render. If you want them off locally, just don't set the variables.

```bash
# .env.local (add to Vercel env vars too)
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
NEXT_PUBLIC_HOTJAR_ID="1234567"
```

## 7. Tables weren't rendering

While writing a post I noticed markdown tables weren't coming out. MDX doesn't support GFM (GitHub Flavored Markdown) by default.

Install `remark-gfm` and add the plugin to MDXRemote.

```bash
npm install remark-gfm
```

```typescript
// src/components/MDXContent.tsx
import remarkGfm from 'remark-gfm';

// ... add table styles to components
table: (props) => (
  <div className="overflow-x-auto my-6">
    <table className="w-full border-collapse" {...props} />
  </div>
),
th: (props) => (
  <th className="px-4 py-3 text-left font-semibold border border-[var(--border-primary)]" {...props} />
),
td: (props) => (
  <td className="px-4 py-3 border border-[var(--border-primary)]" {...props} />
),

// add options to MDXRemote
<MDXRemote
  source={source}
  components={components}
  options={{
    mdxOptions: {
      remarkPlugins: [remarkGfm],
    },
  }}
/>
```

Tables render now.

## Part 7 summary

What I did this time:
- **Neon + Prisma 7** → storing view counts
- **IP hash + 10-minute throttling** → deduping views
- **Per-period rankings** → daily/weekly/monthly/all-time
- **1-hour caching** → less DB load
- **GA4 + Hotjar** → proper analytics
- **remark-gfm** → table rendering

The roadmap is empty now. Everything's done.

---

*I called it "the last one left" and it actually was.*
