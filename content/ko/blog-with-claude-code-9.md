---
title: "Claude Code로 블로그 뚝딱 만들기 (9편: 카테고리 버리고 태그로)"
description: "폴더 기반 카테고리를 밀어버리고 태그 기반으로 전환. 태그 타입 고정, 쿼리 파라미터 컨텍스트, 404까지."
date: "2026-02-06"
tags: ["claude-code", "nextjs", "blog", "Develop"]
series: "블로그 딸깍 해서 만들기"
---

## 카테고리 시스템이 거슬렸다

기존 구조는 이랬다:

```
content/
├── ai/
│   ├── semiconductor-ai-agent.md
│   └── solo-architect-era.md
└── tech/
    ├── blog-with-claude-code-1.md
    └── ...
```

URL도 `/ai/semiconductor-ai-agent`, `/tech/blog-with-claude-code-1` 이런 식. 카테고리별 폴더 + 동적 라우팅 `[category]/[slug]`.

근데 글이 늘어나면서 불편해졌다.

- "이 글 ai에 넣어? tech에 넣어?" — 매번 고민
- 카테고리 페이지(`[category]/page.tsx`)가 태그 페이지(`tags/[tag]/page.tsx`)랑 거의 같은 일을 함
- 한 글이 여러 카테고리에 속할 수 없음

태그가 이미 다 하고 있는 일을 카테고리가 중복으로 하고 있었다. 그냥 밀기로 했다.

## 폴더 구조 플랫하게

```
content/
├── blog-with-claude-code-1.md
├── blog-with-claude-code-2.md
├── semiconductor-ai-agent.md
├── solo-architect-era.md
└── ...
```

하위 폴더 없이 전부 `content/` 바로 아래. slug가 곧 파일명.

### 라우팅 변경

```
Before: /[category]/[slug]  →  /ai/semiconductor-ai-agent
After:  /posts/[slug]       →  /posts/semiconductor-ai-agent
```

`src/app/[category]/[slug]/page.tsx` → `src/app/posts/[slug]/page.tsx`로 이동. 카테고리 페이지 `src/app/[category]/page.tsx`는 삭제.

### mdx.ts 단순화

폴더 재귀 탐색하던 `getFilesRecursively()`가 필요 없어졌다:

```typescript
// Before: 재귀적으로 하위 폴더까지 탐색
function getFilesRecursively(dir: string): string[] {
  const files: string[] = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    if (item.isDirectory()) {
      files.push(...getFilesRecursively(fullPath));
    } else if (item.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

// After: 그냥 readdir
const files = fs.readdirSync(contentDirectory).filter(
  (file) => file.endsWith('.md') || file.endsWith('.mdx')
);
```

`PostMeta`에서 `category` 필드도 제거. 태그가 카테고리 역할을 대신한다.

### 301 리다이렉트

기존 URL이 깨지면 안 되니까 `next.config.ts`에 영구 리다이렉트:

```typescript
async redirects() {
  return [
    { source: '/ai/:slug', destination: '/posts/:slug', permanent: true },
    { source: '/tech/:slug', destination: '/posts/:slug', permanent: true },
    { source: '/ai', destination: '/tags/AI', permanent: true },
    { source: '/tech', destination: '/tags/Tech', permanent: true },
  ];
},
```

`/ai/some-post` → `/posts/some-post`, `/ai` → `/tags/AI`. SEO 점수도 유지.

### 네비게이션

카테고리 목록 대신 큐레이션된 태그를 네비에 노출:

```typescript
// src/config/navigation.ts
export const NAV_TAGS = ['AI', 'Tech', 'Thoughts', 'Blockchain', 'Daily'] as const;
```

Header에서 `NAV_TAGS`를 받아서 상단에 표시. 태그 페이지로 링크.

여기까지가 카테고리 → 태그 전환. 파일 29개 변경, 393줄 추가, 229줄 삭제. 근데 결과물은 오히려 단순해졌다.

## 태그 타입 고정

카테고리를 없앴으니 태그가 더 중요해졌다. 근데 태그가 `string[]`이라 오타 방지가 안 됨. `"nextJS"`랑 `"nextjs"`가 따로 노는 미래가 보인다.

### navigation.ts → tags.ts

`NAV_TAGS`만 있던 `navigation.ts`를 전체 태그 레지스트리로 확장:

```typescript
// src/config/tags.ts
export const BLOG_TAGS = [
  // Nav tags
  'AI', 'Develop', 'Thoughts', 'Blockchain', 'Daily',
  // Content tags
  'Tech', 'claude-code', 'nextjs', 'blog', 'seo', 'theming',
  'persona', 'writing', 'search', 'rss', 'og-image',
  // ...
] as const;

export type BlogTag = (typeof BLOG_TAGS)[number];

export const NAV_TAGS: readonly BlogTag[] = ['AI', 'Develop', 'Thoughts', 'Blockchain', 'Daily'];
```

`as const` + `typeof`로 유니온 타입이 자동 생성. IDE에서 `BlogTag` 치면 등록된 태그만 자동완성.

### 빌드 타임 검증

`PostMeta.tags`를 `string[]` → `BlogTag[]`로 변경. 파싱할 때 검증:

```typescript
const blogTagSet = new Set<string>(BLOG_TAGS);

function validateTags(tags: string[], slug: string): BlogTag[] {
  return tags.map((tag) => {
    if (!blogTagSet.has(tag)) {
      console.warn(`[mdx] Unknown tag "${tag}" in "${slug}". Register it in src/config/tags.ts`);
    }
    return tag as BlogTag;
  });
}
```

에러를 내진 않고 `console.warn`만 찍는다. 빌드할 때 터미널에서 바로 보이니까 충분. 에러를 내면 글 쓸 때마다 `tags.ts`부터 수정해야 하는데 그건 과하다.

## 쿼리 파라미터로 컨텍스트 전달

`/tags/AI`에서 글 클릭해서 들어가면, "AI 태그에서 왔다"는 컨텍스트가 사라진다. URL이 `/posts/slug`로 바뀌면서 끝.

### 흐름

```
/tags/AI → PostCard(fromTag="AI") → /posts/slug?from=AI → Header에서 AI 활성
```

### PostCard에 fromTag

```tsx
<Link href={`/posts/${post.slug}${fromTag ? `?from=${encodeURIComponent(fromTag)}` : ''}`}>
```

태그 페이지에서만 `fromTag`를 넘기고, 홈에서는 안 넘긴다. 깔끔.

### SSG + useSearchParams 조합

글 페이지는 SSG인데, `useSearchParams()`는 클라이언트 전용. 클라이언트 래퍼로 해결:

```tsx
// src/components/PostPageHeader.tsx
'use client';

export default function PostPageHeader({ posts }: PostPageHeaderProps) {
  const searchParams = useSearchParams();
  const currentTag = searchParams.get('from') ?? undefined;
  return <Header navTags={[...NAV_TAGS]} currentTag={currentTag} posts={posts} />;
}
```

```tsx
// posts/[slug]/page.tsx
<Suspense fallback={<Header navTags={[...NAV_TAGS]} posts={allPosts} />}>
  <PostPageHeader posts={allPosts} />
</Suspense>
```

fallback에 기본 Header를 넣어서 hydration 전에도 레이아웃이 안 깨진다.

### 관련 글도 from 태그 우선

`?from=Thoughts`로 들어왔으면 관련 글도 Thoughts 태그 글을 먼저 보여줘야 맞다.

서버에서 후보 6개를 넉넉히 뽑고, 클라이언트에서 from 태그 기준 재정렬 후 3개만 표시:

```tsx
// src/components/RelatedPostsWithContext.tsx
'use client';

export default function RelatedPostsWithContext({ posts, count = 3 }) {
  const fromTag = useSearchParams().get('from');

  let sorted = posts;
  if (fromTag) {
    sorted = [...posts].sort((a, b) => {
      const aHas = a.tags?.includes(fromTag) ? 1 : 0;
      const bHas = b.tags?.includes(fromTag) ? 1 : 0;
      return bHas - aHas;
    });
  }

  return <RelatedPosts posts={sorted.slice(0, count)} />;
}
```

### 시리즈 필터 버그

이거 하다가 기존 버그를 발견했다. `getRelatedPosts`에서 같은 시리즈 제외 로직:

```typescript
// 버그: undefined !== undefined → false → 시리즈 없는 글끼리 전부 제외됨
.filter((post) => post.series !== currentPost.series)

// 수정: 둘 다 시리즈 없으면 통과
.filter((post) => !post.series || !currentPost.series || post.series !== currentPost.series)
```

`undefined !== undefined`은 `false`다. 시리즈가 없는 단독 글들이 서로의 관련 글에서 전부 빠지고 있었다.

## 404 페이지

기존 404가 Next.js 기본 화면이라 너무 적나라했다. 마스코트 10마리 띄워서 좀 재밌게 만들었다.

`MascotCharacter.tsx`의 SVG(viewBox `0 0 80 80`)를 그대로 가져와서 디자인 일관성 유지. CSS 키프레임으로 각각 다른 궤도로 떠다니게:

```css
@keyframes mascot-float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(var(--dx), var(--dy)) rotate(10deg); }
  50% { transform: translate(calc(var(--dx) * -0.5), calc(var(--dy) * 0.7)) rotate(-5deg); }
  75% { transform: translate(calc(var(--dx) * 0.3), calc(var(--dy) * -0.8)) rotate(8deg); }
}
```

`seededRandom`으로 위치/궤도를 결정해서 새로고침해도 같은 레이아웃. 10초 카운트다운 후 자동 홈 이동.

## 9편 정리

- **카테고리 → 태그 전환** → 폴더 구조 플랫화, `[category]/[slug]` → `/posts/[slug]`
- **301 리다이렉트** → 기존 URL 보존 (`/ai/*` → `/posts/*`)
- **태그 레지스트리** → `as const` + 유니온 타입으로 오타 방지
- **빌드 타임 검증** → 미등록 태그 `console.warn`
- **쿼리 파라미터** → `?from=태그`로 어디서 왔는지 기억
- **관련 글 우선순위** → from 태그 매칭 포스트 우선 노출
- **시리즈 필터 버그 수정** → `undefined !== undefined` 함정
- **404 페이지** → 마스코트 10마리 + 10초 자동 리다이렉트

카테고리를 밀면서 코드가 오히려 줄었다. 복잡했던 게 단순해지는 건 방향이 맞다는 신호인 것 같다.

---

*카테고리 폴더 만들었다가 밀었다가. 결국 처음부터 태그만 쓸 걸.*
