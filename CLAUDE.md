# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production (SSG)
npm run lint     # Run ESLint
```

## Architecture

This is a Next.js 16 (App Router) MDX blog with SSG (Static Site Generation).

### Content System

- **Blog posts**: Markdown files in `content/[slug].md` (flat structure, no subdirectories)
- **Navigation**: Tag-based (curated tags in `src/config/navigation.ts`)
- **Frontmatter**: Required fields: `title`, `description`, `date`. Optional: `tags`, `thumbnail`, `series`

```yaml
---
title: "Post Title"
description: "Brief description"
date: "2025-02-04"
tags: ["tag1", "tag2"]
series: "시리즈명"  # optional, auto-detected from title pattern
---
```

### Series System

시리즈 글은 자동으로 감지되거나 명시할 수 있다.

**자동 감지 패턴:**
- `제목 (1편: 부제)` → 시리즈명: "제목", 순서: 1
- `제목 (2편)` → 시리즈명: "제목", 순서: 2
- `제목 1편:` → 시리즈명: "제목", 순서: 1

**명시적 지정:**
```yaml
series: "Claude Code로 블로그 만들기"
```

시리즈 글에는 자동으로:
- 상단에 시리즈 목차 표시
- 하단에 이전/다음 네비게이션

### Related Posts

태그 기반으로 관련 글이 자동 추천된다. 같은 시리즈 글은 제외.

### Core Files

- `src/lib/mdx.ts` - MDX parsing, series detection, related posts
- `src/config/navigation.ts` - Curated nav tags (AI, Tech, Thoughts, Blockchain, Daily)
- `src/components/MDXContent.tsx` - MDX renderer with Shiki syntax highlighting
- `src/components/SeriesNav.tsx` - Series table of contents
- `src/components/RelatedPosts.tsx` - Related posts by tags
- `src/app/globals.css` - CSS variables for theming

### Routing

- `/` - Home page (recent posts, nav tags)
- `/posts/[slug]` - Individual post (with series nav & related posts)
- `/tags` - All tags listing
- `/tags/[tag]` - Posts filtered by tag
- Old URLs (`/ai/*`, `/tech/*`) redirect via 301 in `next.config.ts`

### Theming

All colors use CSS variables defined in `globals.css`. To change theme colors, modify variables in `:root` (light) or `.dark` (dark) blocks. Theme toggle persists to localStorage.

### Adding a New Post

1. Create `content/[slug].md` with frontmatter
2. Add images to `public/images/[slug]/`
3. Reference images as `/images/[slug]/filename.png`
4. Series posts: use `(N편:` pattern in title or add `series` field

## AI Writing System

이 블로그는 AI가 글을 작성할 수 있도록 설계되어 있다.

### 페르소나 구조

**2-Layer 시스템:**
1. `persona_base.md` - 기본 사고방식 (모든 글에 공통)
2. 용도별 페르소나 - 출력 형태만 다름

### 페르소나 파일들 (public/ai/)

| 파일 | 역할 |
|------|------|
| `persona_base.md` | 기본 사고방식 (서상원식 구조 디버거) |
| `persona_blogger.md` | 블로그 글 작성용 (사고 기록자) |
| `persona_commenter.md` | 댓글/논평용 (논점 교정자) |
| `blog-guide.md` | 전체 작성 가이드 |
| `template.md` | 빈 템플릿 |

### 글 유형

| 유형 | 설명 | 예시 |
|-----|------|------|
| **기술 정리형** | 써보고 정리해서 dump | 튜토리얼, 사용기, 팁 |
| **사고 정리형** | 구조적 분석 후 정리 dump | 개념 분석, 프레임 제안 |

### 사고방식 (글쓰는 과정에서 활용)

- **정의부터 의심** - 핵심 단어 재검토
- **구조로 환원** - 태도/선택 설명 거부
- **제3의 축** - 이분법 탈피

### 결론 스타일

```
❌ "~해야 한다", "~가 핵심이다" (단정)
✅ "~것 같다", "~라고 보고 있다" (열린 결론)
✅ "일단 이렇게 정리해둔다" (dump 느낌)
```

### 표현 예시

```
"정리해둘 게 있어서 적어둔다."
"내가 느낀 건 좀 달랐다."
"이런 관점으로 보는 게 나한텐 맞았다."
"일단 여기까지. 나중에 더 생각나면 추가."
```

### AI에게 글 요청 시

다른 AI에게 이 블로그 글을 요청할 때:

```
https://raw.githubusercontent.com/sangwon0001/brain-dump-blog/main/public/ai/blog-guide.md 읽고,
https://raw.githubusercontent.com/sangwon0001/brain-dump-blog/main/public/ai/persona_base.md 읽고,
https://raw.githubusercontent.com/sangwon0001/brain-dump-blog/main/public/ai/persona_blogger.md 읽고,
[주제]에 대한 블로그 글 써줘.
```

또는 간단히:

```
https://raw.githubusercontent.com/sangwon0001/brain-dump-blog/main/public/ai/blog-guide.md 참고해서 [주제] 글 써줘.
```
