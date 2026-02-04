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

- **Blog posts**: Markdown files in `content/[category]/[slug].md`
- **Categories**: Directory names under `content/` become categories
- **Frontmatter**: Required fields: `title`, `description`, `date`. Optional: `tags`, `thumbnail`

```yaml
---
title: "Post Title"
description: "Brief description"
date: "2025-02-04"
tags: ["tag1", "tag2"]
---
```

### Core Files

- `src/lib/mdx.ts` - MDX parsing utilities (getAllPosts, getPostBySlug, getCategories)
- `src/components/MDXContent.tsx` - MDX renderer with Shiki syntax highlighting
- `src/app/globals.css` - CSS variables for theming (`:root` for light, `.dark` for dark mode)

### Routing

- `/` - Home page (recent posts)
- `/[category]` - Category listing
- `/[category]/[slug]` - Individual post

### Theming

All colors use CSS variables defined in `globals.css`. To change theme colors, modify variables in `:root` (light) or `.dark` (dark) blocks. Theme toggle persists to localStorage.

### Adding a New Post

1. Create `content/[category]/[slug].md` with frontmatter
2. Add images to `public/images/[slug]/`
3. Reference images as `/images/[slug]/filename.png`

## AI Writing System

이 블로그는 AI가 글을 작성할 수 있도록 설계되어 있다.

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
https://blog.sangwon0001.xyz/ai/blog-guide.md 읽고,
https://blog.sangwon0001.xyz/ai/persona_base.md 읽고,
https://blog.sangwon0001.xyz/ai/persona_blogger.md 읽고,
[주제]에 대한 블로그 글 써줘.
```

또는 간단히:

```
https://blog.sangwon0001.xyz/ai/blog-guide.md 참고해서 [주제] 글 써줘.
```
