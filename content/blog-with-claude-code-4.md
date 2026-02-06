---
title: "Claude Code로 블로그 뚝딱 만들기 (4편: 검색, RSS, 목차, Draft)"
description: "개선점 찾아서 로드맵 만들고, 하나씩 알아서 구현하게 시키기. 검색, RSS, TOC, Draft까지."
date: "2026-02-04"
tags: ["claude-code", "nextjs", "blog", "search", "rss", "Develop"]
---

## 개선점 알아서 찾아라

3편까지 하고 나니까 블로그 기본은 됐다. 근데 뭘 더 해야 할지 내가 다 생각하기 귀찮았다.

그래서 Claude Code한테 이렇게 시켰다:

```
개선점 찾아서 제안해봐
```

걔가 코드베이스 분석하더니 이런 리스트를 뽑아줬다:

**높은 우선순위:**
- 검색 기능
- RSS 피드
- 글 내 목차 (TOC)
- Draft 기능

**중간 우선순위:**
- OG 이미지 자동 생성
- JSON-LD 스키마
- Analytics
- Callout 컴포넌트

**낮은 우선순위:**
- 댓글 시스템
- 태그 아카이브
- Back to Top 버튼

내가 생각 안 해도 된다. 걔가 알아서 분석하고 우선순위까지 매겨준다.

## 로드맵으로 관리하기

리스트만 있으면 뭐가 끝났는지 헷갈린다. 그래서 칸반 스타일로 만들라고 했다.

```
이 플랜을 roadmap.md로 만들고 칸반처럼 만들어서 관리하자
```

이런 파일이 생겼다:

```markdown
## 📋 To Do
### 🔴 High Priority
- [ ] 검색 기능
- [ ] RSS 피드
- [ ] TOC
- [ ] Draft 기능

## 🔄 In Progress
(현재 진행 중인 작업 없음)

## ✅ Done
- [x] 시리즈 시스템
- [x] 관련 글 추천
```

이제 작업할 때마다 Claude Code가 알아서 In Progress로 옮기고, 끝나면 Done으로 옮긴다.

## 하나씩 알아서 진행해

로드맵 만들어놓고 이렇게 시켰다:

```
하나씩 알아서 진행해
```

그랬더니 High Priority부터 순서대로 구현하기 시작했다.

### 1. 검색 기능

SSG 블로그라서 클라이언트 사이드 검색으로 갔다.

```typescript
const filtered = posts.filter((post) => {
  const q = query.toLowerCase();
  return post.title.toLowerCase().includes(q) ||
         post.description.toLowerCase().includes(q) ||
         post.tags?.some((tag) => tag.toLowerCase().includes(q));
});
```

`Cmd+K`로 바로 열리게 단축키도 넣었다.

### 2. RSS 피드

Next.js Route Handler로 `/feed.xml` 만들었다.

```typescript
// src/app/feed.xml/route.ts
export async function GET() {
  const posts = getAllPosts().slice(0, 20);
  const rss = `<?xml version="1.0"?>
    <rss version="2.0">
      <channel>
        ${posts.map(post => `<item>...</item>`).join('')}
      </channel>
    </rss>`;
  return new Response(rss, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
```

### 3. 목차 (TOC)

마크다운에서 헤딩 추출해서 목차 만들었다.

```typescript
export function extractToc(content: string): TocItem[] {
  const headingRegex = /^(#{2,4})\s+(.+)$/gm;
  // h2, h3, h4 추출해서 slug랑 매핑
}
```

접이식 UI로 만들어서 기본은 닫혀있게 했다.

### 4. Draft 기능

frontmatter에 `draft: true` 넣으면 프로덕션에서 안 보인다.

```yaml
---
title: "작성 중인 글"
draft: true
---
```

개발 모드에서는 DRAFT 뱃지가 붙어서 구분된다.

## 작업 완료되면

하나 끝날 때마다 roadmap.md가 자동으로 업데이트된다.

```markdown
## ✅ Done

### 2026-02-04
- [x] 검색 기능
- [x] RSS 피드
- [x] TOC (목차)
- [x] Draft 기능
```

커밋도 알아서 한다. "커밋했니?" 물어보니까 안 했다고 하면서 바로 했다.

## 이 방식의 장점

1. **생각 안 해도 된다** - 개선점을 내가 다 파악할 필요 없다
2. **우선순위를 정해준다** - 뭐부터 해야 할지 고민 안 해도 된다
3. **진행 상황이 추적된다** - roadmap.md 보면 된다
4. **알아서 진행한다** - "하나씩 알아서 진행해" 한 마디면 끝

## 4편 정리

이번에 한 것:
- **개선점 분석 시킴** → 우선순위별 리스트 받음
- **roadmap.md 생성** → 칸반 스타일 관리
- **알아서 구현 시킴** → 검색, RSS, TOC, Draft 완료

581줄 추가됐다. 내가 직접 코드 쓴 건 없다.

---

*다음에 할 게 있다면 OG 이미지나 댓글 정도. 근데 "알아서 진행해" 하면 될 것 같다.*
