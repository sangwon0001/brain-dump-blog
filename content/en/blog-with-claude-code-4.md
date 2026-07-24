---
title: "Whipping Up a Blog with Claude Code (Part 4: Search, RSS, TOC, Draft)"
description: "Have it find the gaps, turn them into a roadmap, and implement them one by one on its own. Search, RSS, TOC, and Draft."
date: "2026-02-04"
tags: ["claude-code", "nextjs", "blog", "search", "rss", "Develop"]
series: "Whipping Up a Blog with Claude Code"
---

## Go find the gaps yourself

After Part 3 the blog basics were done. But figuring out what else to build was more thinking than I felt like doing.

So I told Claude Code:

```
find some improvements and propose them
```

It analyzed the codebase and produced this list:

**High priority:**
- Search
- RSS feed
- In-post table of contents (TOC)
- Draft support

**Medium priority:**
- Automatic OG image generation
- JSON-LD schema
- Analytics
- Callout component

**Low priority:**
- Comment system
- Tag archive
- Back to Top button

I don't have to think. It analyzes and even assigns priority.

## Managing it as a roadmap

A bare list makes it hard to tell what's finished. So I asked for a kanban style.

```
turn this plan into roadmap.md and manage it like a kanban board
```

This file appeared:

```markdown
## 📋 To Do
### 🔴 High Priority
- [ ] Search
- [ ] RSS feed
- [ ] TOC
- [ ] Draft support

## 🔄 In Progress
(nothing in progress)

## ✅ Done
- [x] Series system
- [x] Related-post suggestions
```

Now whenever it works on something, Claude Code moves it to In Progress on its own, and to Done when it finishes.

## Just work through them

With the roadmap in place I said:

```
work through them one at a time on your own
```

And it started implementing from High Priority in order.

### 1. Search

It's an SSG blog, so client-side search.

```typescript
const filtered = posts.filter((post) => {
  const q = query.toLowerCase();
  return post.title.toLowerCase().includes(q) ||
         post.description.toLowerCase().includes(q) ||
         post.tags?.some((tag) => tag.toLowerCase().includes(q));
});
```

It added a `Cmd+K` shortcut to open it directly.

### 2. RSS feed

Built `/feed.xml` with a Next.js Route Handler.

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

### 3. Table of contents (TOC)

Pull the headings out of the markdown and build a TOC.

```typescript
export function extractToc(content: string): TocItem[] {
  const headingRegex = /^(#{2,4})\s+(.+)$/gm;
  // extract h2, h3, h4 and map to slugs
}
```

Made it collapsible, closed by default.

### 4. Draft support

Put `draft: true` in the frontmatter and it won't show in production.

```yaml
---
title: "작성 중인 글"
draft: true
---
```

In dev mode it gets a DRAFT badge so you can tell it apart.

## When a task finishes

Every time one is done, roadmap.md updates itself.

```markdown
## ✅ Done

### 2026-02-04
- [x] Search
- [x] RSS feed
- [x] TOC
- [x] Draft support
```

It commits on its own too. I asked "did you commit?" and it said no, then did it right away.

## Why this approach works

1. **I don't have to think** — I don't need to spot every improvement myself
2. **It sets priority** — no agonizing over what to do first
3. **Progress is tracked** — just look at roadmap.md
4. **It just proceeds** — "work through them one at a time" is the whole instruction

## Part 4 summary

What I did this time:
- **Had it analyze for improvements** → got a prioritized list
- **Created roadmap.md** → kanban-style management
- **Had it implement on its own** → search, RSS, TOC, Draft done

581 lines added. None of the code was written by me.

---

*If there's anything next, maybe OG images or comments. Though "just work through it" will probably cover that too.*
