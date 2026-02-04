---
title: "Claude Code로 블로그 뚝딱 만들기 (4편: 검색, RSS, 목차, Draft)"
description: "블로그에 필요한 기능들 하나씩 추가하기. 검색 모달, RSS 피드, 자동 목차, Draft 시스템까지."
date: "2025-02-04"
tags: ["claude-code", "nextjs", "blog", "search", "rss"]
---

## 기능이 부족하다

3편까지 하고 나니까 블로그 기본은 됐다. 근데 쓰다 보니 불편한 게 보인다.

- 글 찾기가 불편하다
- RSS가 없다
- 긴 글은 목차가 필요하다
- 작성 중인 글 관리가 안 된다

그래서 이번엔 이 네 가지를 추가했다.

## 검색 기능

### 왜 필요한가

글이 10개만 넘어도 스크롤해서 찾기 귀찮다. 그리고 뭔가 있는 블로그처럼 보이려면 검색은 있어야 한다.

### 구현 방식

SSG 블로그라서 서버 검색은 안 된다. 클라이언트 사이드로 갔다.

```typescript
// 검색 로직 - 그냥 includes로 충분하다
const filtered = posts.filter((post) => {
  const q = query.toLowerCase();
  const titleMatch = post.title.toLowerCase().includes(q);
  const descMatch = post.description.toLowerCase().includes(q);
  const tagMatch = post.tags?.some((tag) => tag.toLowerCase().includes(q));
  return titleMatch || descMatch || tagMatch;
});
```

fuse.js 같은 라이브러리 쓸까 했는데, 글이 수백 개 아니면 그냥 `includes`로 충분하다.

### 단축키

`Cmd+K` (Mac) / `Ctrl+K` (Windows)로 바로 열리게 했다.

```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setIsSearchOpen(true);
    }
  };
  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, []);
```

키보드 네비게이션도 넣었다. ↑↓로 이동, Enter로 선택, ESC로 닫기.

## RSS 피드

### 왜 필요한가

RSS 리더 쓰는 사람들이 있다. 그리고 SEO에도 도움이 된다고 한다.

### 구현

Next.js App Router에서는 Route Handler로 만든다.

```typescript
// src/app/feed.xml/route.ts
export async function GET() {
  const posts = getAllPosts().slice(0, 20);

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>블로그 제목</title>
    ${posts.map(post => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>`).join('')}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
```

`/feed.xml`로 접근하면 RSS가 나온다. 브라우저에서 RSS 피드 자동 감지하게 메타데이터도 추가했다.

## 목차 (TOC)

### 왜 필요한가

글이 길어지면 헤딩이 많아진다. 목차 없으면 스크롤 지옥이다.

### 구현

마크다운에서 헤딩을 추출하는 함수를 만들었다.

```typescript
export function extractToc(content: string): TocItem[] {
  const headingRegex = /^(#{2,4})\s+(.+)$/gm;
  const toc: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    toc.push({
      level: match[1].length,  // ## = 2, ### = 3
      text: match[2].trim(),
      slug: slugify(match[2]),
    });
  }
  return toc;
}
```

헤딩에 id를 넣어서 클릭하면 해당 위치로 스크롤되게 했다.

```typescript
h2: (props) => {
  const id = slugify(extractText(props.children));
  return <h2 id={id} className="scroll-mt-20" {...props} />;
},
```

`scroll-mt-20`은 헤더에 가리지 않게 여유를 주는 거다.

### UI

접이식으로 만들었다. 기본은 닫혀있고, 클릭하면 펼쳐진다. 항상 펼쳐져 있으면 글 시작 전에 너무 길어 보인다.

## Draft 기능

### 왜 필요한가

글 쓰다가 중간에 저장하고 싶다. 근데 배포되면 안 된다.

### 구현

frontmatter에 `draft: true` 넣으면 된다.

```yaml
---
title: "작성 중인 글"
draft: true
---
```

빌드할 때 draft 글은 제외한다.

```typescript
const isDev = process.env.NODE_ENV === 'development';

// 프로덕션에서는 draft 제외
const filteredPosts = isDev ? posts : posts.filter((post) => !post.draft);
```

개발 모드에서는 DRAFT 뱃지가 붙어서 구분된다.

## 작업 관리

이번에 roadmap.md도 만들었다. 칸반 스타일로.

```markdown
## 📋 To Do
- [ ] OG 이미지 자동 생성
- [ ] Analytics

## 🔄 In Progress
(현재 진행 중인 작업 없음)

## ✅ Done
- [x] 검색 기능 (2025-02-04)
- [x] RSS 피드 (2025-02-04)
```

Claude Code한테 "roadmap 업데이트해" 하면 알아서 이동시켜준다.

## 4편 정리

오늘 추가한 것들:
- **검색**: Cmd/Ctrl+K, 클라이언트 사이드
- **RSS**: `/feed.xml`, Route Handler
- **TOC**: 헤딩 자동 추출, 접이식 UI
- **Draft**: frontmatter로 관리, dev에서만 표시

블로그 기능은 이 정도면 충분한 것 같다.

다음에 할 게 있다면 OG 이미지 자동 생성이나 댓글 정도? 근데 당장 급하진 않다.

---

*Claude Code한테 "개선점 찾아서 알아서 진행해" 했더니 4개 기능을 한 번에 만들어줬다. 581줄 추가.*
