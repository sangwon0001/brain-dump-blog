---
title: "Claude Code로 블로그 뚝딱 만들기 (7편: 인기글 랭킹과 Analytics)"
description: "Neon + Prisma 7로 조회수 추적, 인기글 랭킹 구현. GA4, Hotjar까지 한 번에."
date: "2026-02-04"
tags: ["claude-code", "nextjs", "blog", "prisma", "neon", "analytics", "Develop"]
---

## 마지막 남은 것

6편에서 "인기글 랭킹은 Analytics API 연동이 필요해서 나중에"라고 했다. 이제 그 나중이다.

```
@roadmap.md 좋아 이제 마지막 남은거 진행해보자
```

## 어떻게 할까?

조회수 데이터를 어디서 가져올지 고민했다.

| 방법 | 장점 | 단점 |
|------|------|------|
| Vercel Analytics | 이미 있음 | API 없음 (대시보드 전용) |
| GA4 API | 무료, 정확 | 설정 복잡 |
| Umami | 오픈소스 | 별도 서버 필요 |
| 직접 구현 | 완전 커스텀 | DB 필요 |

Vercel Analytics는 API가 없어서 코드에서 데이터를 가져올 수 없다. GA4는 설정이 너무 복잡하다.

결론: **Neon (PostgreSQL) + Prisma**로 직접 구현.

Vercel에 Neon Integration이 있어서 연결이 쉽다. Prisma 7이 Neon adapter를 지원한다.

## 1. Neon 설정

Vercel 대시보드 → Storage → Create Database → Neon Postgres

환경변수 자동 생성된다.

```bash
# .env.local
DATABASE_URL="postgresql://...@...neon.tech/neondb?sslmode=require"
```

## 2. Prisma 7 설정

Prisma 7이 좀 바뀌었다. `schema.prisma`에서 url을 직접 안 쓰고 `prisma.config.ts`를 쓴다.

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

Prisma client는 Neon adapter를 사용한다.

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

## 3. 조회수 API

글 조회할 때 카운트하고, IP 해시로 중복 방지.

```typescript
// src/app/api/views/route.ts
export async function POST(request: NextRequest) {
  const { slug } = await request.json()

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
  const ipHash = hashIP(ip)  // SHA256 해시

  // 같은 IP는 10분에 1번만 카운트
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

IP를 해시해서 저장한다. 개인정보 보호도 되고 throttling도 된다.

## 4. 랭킹 API

기간별 랭킹을 SQL로 바로 계산한다.

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
    { headers: { 'Cache-Control': 'public, s-maxage=3600' } }  // 1시간 캐시
  )
}
```

캐시를 1시간으로 설정해서 DB 부하를 줄인다. 실시간일 필요는 없으니까.

## 5. 컴포넌트

### ViewCounter

글 페이지에서 조회수 표시 + 기록.

```typescript
// src/components/ViewCounter.tsx
export function ViewCounter({ slug }: { slug: string }) {
  const [views, setViews] = useState<number | null>(null)

  useEffect(() => {
    // 조회수 기록
    fetch('/api/views', {
      method: 'POST',
      body: JSON.stringify({ slug })
    })

    // 조회수 가져오기
    fetch(`/api/views?slug=${slug}`)
      .then(res => res.json())
      .then(data => setViews(data.count))
  }, [slug])

  return <span>{views?.toLocaleString()} views</span>
}
```

### PopularPosts

홈 페이지에서 인기글 목록 표시.

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
        <option value="daily">오늘</option>
        <option value="weekly">이번 주</option>
        <option value="monthly">이번 달</option>
        <option value="total">전체</option>
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

조회수는 직접 구현했지만, 제대로 된 Analytics도 필요하다.

- **GA4**: 트래픽 분석, 유입 경로, 이벤트 추적
- **Hotjar**: 히트맵, 세션 녹화, 사용자 행동 분석

둘 다 스크립트 추가만 하면 된다.

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

환경변수가 없으면 렌더링 안 한다. 로컬에서는 비활성화하고 싶으면 환경변수 안 넣으면 된다.

```bash
# .env.local (Vercel 환경변수에도 추가)
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
NEXT_PUBLIC_HOTJAR_ID="1234567"
```

## 7. 테이블 렌더링 안 됨

글 쓰다 보니 마크다운 테이블이 안 나온다. MDX가 기본으로 GFM(GitHub Flavored Markdown)을 지원 안 해서 그렇다.

`remark-gfm` 설치하고 MDXRemote에 플러그인 추가.

```bash
npm install remark-gfm
```

```typescript
// src/components/MDXContent.tsx
import remarkGfm from 'remark-gfm';

// ... components에 table 스타일 추가
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

// MDXRemote에 옵션 추가
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

이제 테이블이 나온다.

## 7편 정리

이번에 한 것:
- **Neon + Prisma 7** → 조회수 저장
- **IP 해시 + 10분 throttling** → 중복 조회 방지
- **기간별 랭킹** → 일간/주간/월간/전체
- **1시간 캐싱** → DB 부하 감소
- **GA4 + Hotjar** → 제대로 된 Analytics
- **remark-gfm** → 테이블 렌더링 지원

이제 roadmap이 비었다. 할 거 다 했다.

---

*"마지막 남은 것"이라더니 진짜 마지막이었다.*
