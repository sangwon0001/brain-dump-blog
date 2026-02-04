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
