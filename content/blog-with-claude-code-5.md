---
title: "Claude Code로 블로그 뚝딱 만들기 (5편: OG 이미지, SEO, Analytics)"
description: "Medium Priority 다 해봐. OG 이미지 자동 생성, JSON-LD, Analytics, Callout, 읽기 진행바까지."
date: "2026-02-04"
tags: ["claude-code", "nextjs", "blog", "seo", "og-image", "Develop"]
---

## 다 해봐

4편에서 roadmap.md 만들어놨다. Medium Priority가 5개 남아있었다.

그래서 이렇게 시켰다:

```
@roadmap.md 진행해
```

"다 해봐"라고 했다.

걔가 5개 태스크 만들더니 순서대로 진행하기 시작했다.

## 1. OG 이미지 자동 생성

SNS 공유할 때 썸네일 이미지. `@vercel/og` 쓰면 Edge Function에서 동적으로 만들 수 있다.

```typescript
// src/app/api/og/route.tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const title = searchParams.get('title') || '뇌 용량 확보용';
  const category = searchParams.get('category') || '';

  return new ImageResponse(
    <div style={{ /* 스타일 */ }}>
      {category && <span>{category}</span>}
      <div>{title}</div>
      <span>뇌 용량 확보용</span>
    </div>,
    { width: 1200, height: 630 }
  );
}
```

메타데이터에 연결하면 끝이다.

```typescript
const ogImageUrl = `${SITE_URL}/api/og?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(category)}`;

return {
  openGraph: {
    images: [{ url: ogImageUrl, width: 1200, height: 630 }],
  },
};
```

이제 `/api/og?title=테스트` 치면 이미지가 나온다.

## 2. JSON-LD 스키마

구글이 글 구조를 이해하게 해주는 마크업이다.

```typescript
// src/components/JsonLd.tsx
export function ArticleJsonLd({ title, description, publishedTime, url, category, tags }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    datePublished: publishedTime,
    author: { '@type': 'Person', name: '서상원' },
    // ...
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
```

글 페이지에 넣으면 된다.

```tsx
<ArticleJsonLd
  title={post.title}
  description={post.description}
  publishedTime={post.date}
  url={url}
  category={category}
  tags={post.tags}
/>
```

## 3. Vercel Analytics

제일 간단했다.

```bash
npm install @vercel/analytics
```

layout.tsx에 한 줄 추가.

```tsx
import { Analytics } from "@vercel/analytics/next";

// body 안에
<Analytics />
```

Vercel 배포하면 대시보드에서 바로 보인다.

## 4. Callout 컴포넌트

문서에서 강조할 때 쓰는 박스. NOTE, WARNING, TIP 같은 거.

```typescript
// src/components/Callout.tsx
type CalloutType = 'note' | 'warning' | 'tip' | 'danger' | 'info';

export default function Callout({ type = 'note', title, children }) {
  const config = calloutConfig[type]; // 타입별 색상, 아이콘
  return (
    <div className={`${config.bgClass} ${config.borderClass}`}>
      <span>{config.icon} {title}</span>
      <div>{children}</div>
    </div>
  );
}
```

MDX에서 이렇게 쓴다:

```mdx
<Callout type="tip" title="팁">
  이런 식으로 쓰면 된다.
</Callout>

<Callout type="warning">
  주의할 점도 적을 수 있다.
</Callout>
```

타입은 5개: `note`, `warning`, `tip`, `danger`, `info`

## 5. 읽기 진행 표시기

스크롤하면 상단에 바가 차오르는 거.

```typescript
// src/components/ReadingProgress.tsx
'use client';

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress((scrollTop / docHeight) * 100);
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1">
      <div style={{ width: `${progress}%` }} />
    </div>
  );
}
```

글 페이지에 넣으면 끝.

## 빌드 확인

다 끝나고 빌드 돌렸다.

```
✓ Compiled successfully
✓ Generating static pages (14/14)
```

문제없다.

## roadmap 업데이트

Claude Code가 알아서 roadmap.md 업데이트했다.

```markdown
## ✅ Done

### 2026-02-04
- [x] OG 이미지 자동 생성
- [x] JSON-LD 스키마
- [x] Vercel Analytics
- [x] Callout 컴포넌트
- [x] 읽기 진행 표시기
```

Medium Priority가 비었다. Low Priority만 남았다.

## 5편 정리

이번에 한 것:
- **OG 이미지** → `@vercel/og`로 동적 생성
- **JSON-LD** → SEO용 구조화 데이터
- **Analytics** → Vercel Analytics 연동
- **Callout** → MDX용 강조 컴포넌트
- **읽기 진행바** → 스크롤 기반 프로그레스

"다 해봐" 한 마디에 5개 기능이 추가됐다.

---

*Low Priority는 댓글(Giscus), 태그 아카이브, Back to Top 버튼 정도. 필요하면 또 "다 해봐" 하면 될 것 같다.*
