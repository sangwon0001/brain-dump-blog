---
title: "Claude Code로 블로그 뚝딱 만들기 (6편: 댓글, 태그, UX 개선)"
description: "Low Priority 싹 정리. Back to Top, 프린트 스타일, 태그 아카이브, Giscus 댓글까지."
date: "2026-02-04"
tags: ["claude-code", "nextjs", "blog", "giscus", "ux"]
---

## 빨리 끝나는 거 먼저

5편에서 Medium Priority 다 끝냈다. Low Priority가 5개 남았다.

```
@roadmap.md 빨리끝나는거 먼저 하고
```

Claude Code가 분석하더니 Back to Top 버튼이 제일 빠르다고 한다. 맞다.

## 1. Back to Top 버튼

스크롤 내리면 나타나는 위로가기 버튼.

```typescript
// src/components/BackToTop.tsx
'use client';

export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!show) return null;

  return (
    <button onClick={scrollToTop} aria-label="맨 위로 이동">
      ↑
    </button>
  );
}
```

layout.tsx에 넣으면 모든 페이지에 적용된다.

## 2. 프린트 스타일

인쇄할 때 불필요한 요소 숨기고 깔끔하게 나오게.

```css
/* globals.css */
@media print {
  /* 숨길 것들 */
  header, footer, nav, button[aria-label="맨 위로 이동"],
  .theme-toggle, .search-button, .toc-container {
    display: none !important;
  }

  /* 외부 링크는 URL 표시 */
  a[href^="http"]::after {
    content: " (" attr(href) ")";
    font-size: 0.8em;
  }

  /* 코드블록 페이지 넘김 방지 */
  pre, img {
    page-break-inside: avoid;
  }
}
```

CSS만 추가하면 끝이다.

## 3. 태그 아카이브

태그 전체 목록 페이지랑 태그별 글 목록 페이지.

먼저 mdx.ts에 헬퍼 함수 추가.

```typescript
// src/lib/mdx.ts
export function getAllTags(): { tag: string; count: number }[] {
  const posts = getAllPosts();
  const tagCount = new Map<string, number>();

  posts.forEach((post) => {
    (post.tags || []).forEach((tag) => {
      tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
    });
  });

  return Array.from(tagCount.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPosts().filter((post) => post.tags?.includes(tag));
}
```

페이지는 두 개.

```
/tags          → 전체 태그 목록 (태그 클라우드)
/tags/[tag]    → 해당 태그 글 목록
```

태그 사용 빈도에 따라 크기가 다르게 나온다.

## 4. Giscus 댓글

GitHub Discussions 기반 댓글 시스템이다. 설정이 조금 필요하다.

### 4.1 GitHub 설정

1. repo Settings → Features → Discussions 켜기
2. https://giscus.app 가서 설정 생성
3. repo-id, category-id 복사

### 4.2 컴포넌트 만들기

```typescript
// src/components/Comments.tsx
'use client';

export default function Comments() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) return;

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', 'your-username/your-repo');
    script.setAttribute('data-repo-id', 'YOUR_REPO_ID');  // giscus.app에서 확인
    script.setAttribute('data-category', 'General');
    script.setAttribute('data-category-id', 'YOUR_CATEGORY_ID');  // giscus.app에서 확인
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-theme', isDark ? THEME_DARK : THEME_LIGHT);
    // ...

    ref.current.appendChild(script);
  }, []);

  return <div ref={ref} />;
}
```

### 4.3 다크모드 연동

테마 바꾸면 댓글도 같이 바뀌어야 한다.

```typescript
useEffect(() => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        const isDark = document.documentElement.classList.contains('dark');
        const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
        iframe?.contentWindow?.postMessage({
          giscus: { setConfig: { theme: isDark ? THEME_DARK : THEME_LIGHT } }
        }, 'https://giscus.app');
      }
    });
  });

  observer.observe(document.documentElement, { attributes: true });
  return () => observer.disconnect();
}, []);
```

MutationObserver로 html 클래스 변화를 감지해서 iframe에 메시지를 보낸다.

### 4.4 커스텀 테마

Giscus 기본 테마가 블로그랑 안 어울려서 커스텀 테마를 만들었다.

```css
/* public/giscus/theme-light.css */
main {
  --color-canvas-default: #ffffff;
  --color-accent-fg: #ff1493;
  --color-btn-primary-bg: #ff1493;
  /* ... */
}

/* public/giscus/theme-dark.css */
main {
  --color-canvas-default: #120a10;
  --color-accent-fg: #ff69b4;
  --color-btn-primary-bg: #ff69b4;
  /* ... */
}
```

핫핑크 악센트 색상 맞춰서 만들었다. 배포해야 적용된다.

## 빌드 & 배포

```bash
npm run build  # 성공
git add . && git commit -m "feat: Add back-to-top, print styles, tags, and comments"
git push origin main
```

Vercel이 알아서 배포한다.

## 6편 정리

이번에 한 것:
- **Back to Top** → 스크롤 400px 후 표시
- **프린트 스타일** → @media print로 인쇄 최적화
- **태그 아카이브** → /tags, /tags/[tag] 페이지
- **Giscus 댓글** → 다크모드 연동 + 커스텀 테마

Low Priority 4개 완료. 인기글 랭킹만 남았는데 이건 Analytics API 연동이 필요해서 나중에.

---

*"빨리 끝나는 거 먼저" 했더니 진짜 빨리 끝났다.*
