---
title: "Claude Code로 블로그 뚝딱 만들기 (2편: 커스터마이징)"
description: "핫핑크 테마, SEO, 이미지 최적화, 시리즈 자동 감지까지. 살 좀 붙여봤다."
date: "2026-02-04"
tags: ["claude-code", "nextjs", "seo", "theming"]
---

## 1편에서 뼈대 만들었고

[1편](/posts/blog-with-claude-code-1)에서 블로그 기본 구조 만들었다. 이번엔 살을 좀 붙여봤다.

- 테마 커스터마이징 (핫핑크 🩷)
- SEO 최적화
- 이미지 자동 최적화
- 시리즈 목차 & 관련 글 추천

## 테마 커스터마이징

### 핫핑크로 갔다

기본 파란색 테마가 마음에 안 들었다.

```
나: "테마 색 바꾸자. 마음에 안 들어"
Claude: "어떤 스타일 원해요? 그린, 퍼플, 오렌지, 로즈..."
나: "남자는 핫핑크지"
```

그래서 핫핑크가 됐다.

### CSS 변수 구조

Next.js + Tailwind 조합에서 테마는 CSS 변수로 관리하면 편하다.

```css
/* globals.css */
:root {
  /* Light mode */
  --accent-primary: #ff1493;      /* Deep Pink */
  --accent-primary-hover: #db1076;
  --bg-primary: #ffffff;
}

.dark {
  /* Dark mode */
  --accent-primary: #ff69b4;      /* Hot Pink */
  --bg-primary: #120a10;          /* 마젠타 틴트 블랙 */
}
```

컴포넌트에서 `var(--accent-primary)` 쓰면 자동으로 테마 따라간다.

### 다크모드 배경

핫핑크에 그냥 검정 배경은 안 어울렸다.

```
나: "다크모드 배경색도 핫핑크랑 어울리게 해줘"
```

결과: 살짝 마젠타/버건디 톤이 섞인 어두운 색 (`#120a10`)

이런 미세한 색감 조정은 AI가 잘하더라. 색상 코드 일일이 찾아볼 필요 없었다.

## SEO 최적화

블로그면 검색에 걸려야 의미가 있다.

### 한 번에 다 해달라고 했다

```
나: "SEO 작업 들어갈까?"
Claude: "현재 상태 확인해볼게요... sitemap ❌, robots.txt ❌, OG tags ❌"
Claude: "전부 추가할게요"
```

### 추가된 것들

**1. 메타데이터 (OG, Twitter)**

```typescript
// layout.tsx
export const metadata: Metadata = {
  title: {
    default: "뇌 용량 확보용",
    template: `%s | 뇌 용량 확보용`,
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "뇌 용량 확보용",
  },
  twitter: {
    card: "summary_large_image",
  },
};
```

**2. sitemap.xml**

```typescript
// app/sitemap.ts
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  return [
    { url: SITE_URL, priority: 1 },
    ...posts.map((post) => ({
      url: `${SITE_URL}/${post.category}/${post.slug}`,
      lastModified: new Date(post.date),
    })),
  ];
}
```

글 추가하면 자동으로 sitemap에 들어간다.

**3. robots.txt**

```typescript
// app/robots.ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
```

## 이미지 최적화

마크다운에서 `![alt](/images/pic.png)` 쓰면 그냥 `<img>` 태그가 된다. 최적화 안 됨.

### Next.js Image 컴포넌트로 교체

MDX 컴포넌트에서 `img`를 오버라이드했다:

```tsx
// MDXContent.tsx
img: (props) => {
  const { src, alt } = props;
  return (
    <Image
      src={src}
      alt={alt || ''}
      width={0}
      height={0}
      sizes="100vw"
      style={{ width: '100%', height: 'auto' }}
    />
  );
},
```

### 설정

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
};
```

이제 마크다운에서 이미지 쓰면:
- 자동 WebP/AVIF 변환 (용량 70% 감소)
- Lazy loading
- 반응형 사이즈

## 시리즈 목차 & 관련 글

시리즈물 글이 많아지면 네비게이션이 필요하다.

### 시리즈 자동 감지

```
나: "글 간 링크 만들 수 있어? 시리즈물은 자동으로 목차 보여주고"
```

제목에서 "(1편", "(2편" 패턴을 자동으로 감지하게 했다.

```typescript
// mdx.ts
const patterns = [
  /^(.+?)\s*\((\d+)편[:\)]?/,  // "제목 (1편:" or "제목 (1편)"
  /^(.+?)\s+(\d+)편[:\s]/,      // "제목 1편:"
];
```

이렇게 하면:
- 같은 시리즈 글들이 자동으로 그룹화됨
- 글 상단에 시리즈 목차 표시
- 글 하단에 이전/다음 네비게이션

frontmatter에 `series: "시리즈명"` 직접 명시해도 된다.

### 관련 글 추천

태그 기반으로 관련 글도 자동 추천되게 했다.

```typescript
// 태그 매칭 점수 계산
const matchingTags = post.tags.filter((tag) =>
  currentPost.tags.includes(tag)
).length;
```

같은 태그가 많을수록 상위에 노출된다. 같은 시리즈 글은 제외해서 중복 안 되게.

## 기타 자잘한 것들

### Favicon

```
나: "favicon도 뇌 모양으로 가능?"
```

Next.js에서 이모지 favicon 만드는 법:

```tsx
// app/icon.tsx
import { ImageResponse } from 'next/og';

export default function Icon() {
  return new ImageResponse(
    <div style={{ fontSize: 28 }}>🧠</div>,
    { width: 32, height: 32 }
  );
}
```

이게 된다. 이모지가 favicon이 됨.

### 블로그 이름

```
나: "블로그 제목 '뇌 용량 확보용' 이런 느낌으로"
Claude: (몇 가지 제안)
나: "뇌 용량 확보용으로 가자"
```

설명도 맞춰서: "머릿속 비우고 RAM 확보하는 블로그"

## 일단 여기까지

2편에서 한 것들:
- 핫핑크 테마 (다크모드 포함)
- SEO (sitemap, robots, OG tags)
- 이미지 자동 최적화
- 시리즈 목차 & 관련 글 추천

다음 편에서는 AI한테 글 쓰게 하는 시스템 얘기할 듯. 페르소나 뽑아내는 방법이랑 가이드 만드는 거.

---

*이 글도, 1편도, Claude Code한테 "지금까지 한 거 정리해줘"라고 해서 초안 나온 거다.*
