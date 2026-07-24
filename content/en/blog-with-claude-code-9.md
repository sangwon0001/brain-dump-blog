---
title: "Whipping Up a Blog with Claude Code (Part 9: Dropping Categories for Tags)"
description: "Bulldozing folder-based categories and moving to tags. Typed tags, query-parameter context, and a 404 page."
date: "2026-02-06"
tags: ["claude-code", "nextjs", "blog", "Develop"]
series: "Whipping Up a Blog with Claude Code"
---

## The category system bothered me

The old structure was this:

```
content/
├── ai/
│   ├── semiconductor-ai-agent.md
│   └── solo-architect-era.md
└── tech/
    ├── blog-with-claude-code-1.md
    └── ...
```

URLs looked like `/ai/semiconductor-ai-agent`, `/tech/blog-with-claude-code-1`. Per-category folders plus dynamic routing at `[category]/[slug]`.

As posts piled up it got awkward.

- "Does this go in ai or tech?" — every single time
- The category page (`[category]/page.tsx`) did nearly the same job as the tag page (`tags/[tag]/page.tsx`)
- A post couldn't belong to more than one category

Categories were duplicating work tags were already doing. I decided to bulldoze them.

## Flattening the folder structure

```
content/
├── blog-with-claude-code-1.md
├── blog-with-claude-code-2.md
├── semiconductor-ai-agent.md
├── solo-architect-era.md
└── ...
```

No subfolders, everything directly under `content/`. The slug is the filename.

### Routing change

```
Before: /[category]/[slug]  →  /ai/semiconductor-ai-agent
After:  /posts/[slug]       →  /posts/semiconductor-ai-agent
```

`src/app/[category]/[slug]/page.tsx` moved to `src/app/posts/[slug]/page.tsx`. The category page at `src/app/[category]/page.tsx` was deleted.

### Simplifying mdx.ts

The `getFilesRecursively()` that walked subfolders was no longer needed:

```typescript
// Before: recursively walk subfolders
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

// After: just readdir
const files = fs.readdirSync(contentDirectory).filter(
  (file) => file.endsWith('.md') || file.endsWith('.mdx')
);
```

The `category` field came out of `PostMeta` too. Tags take over the category's job.

### 301 redirects

Existing URLs must not break, so permanent redirects in `next.config.ts`:

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

`/ai/some-post` → `/posts/some-post`, `/ai` → `/tags/AI`. SEO equity preserved.

### Navigation

Curated tags in the nav instead of a category list:

```typescript
// src/config/navigation.ts
export const NAV_TAGS = ['AI', 'Tech', 'Thoughts', 'Blockchain', 'Daily'] as const;
```

The Header takes `NAV_TAGS` and shows them at the top, linking to tag pages.

That's the category → tag migration. 29 files changed, 393 lines added, 229 removed. And the result is simpler than before.

## Making tags a fixed type

With categories gone, tags matter more. But tags were `string[]`, so nothing stopped typos. I could see a future where `"nextJS"` and `"nextjs"` drift apart.

### navigation.ts → tags.ts

`navigation.ts`, which only had `NAV_TAGS`, grew into a full tag registry:

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

`as const` + `typeof` generates the union type automatically. Type `BlogTag` in the IDE and only registered tags autocomplete.

### Build-time validation

`PostMeta.tags` went from `string[]` to `BlogTag[]`, validated at parse time:

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

It warns rather than throws. The message shows up in the terminal during a build, which is enough. Throwing would mean editing `tags.ts` before every post, and that's too much.

## Passing context through a query parameter

Click a post from `/tags/AI` and the "I came from the AI tag" context vanishes. The URL becomes `/posts/slug` and that's that.

### The flow

```
/tags/AI → PostCard(fromTag="AI") → /posts/slug?from=AI → AI active in the Header
```

### fromTag on PostCard

```tsx
<Link href={`/posts/${post.slug}${fromTag ? `?from=${encodeURIComponent(fromTag)}` : ''}`}>
```

Only the tag page passes `fromTag`; the home page doesn't. Clean.

### SSG + useSearchParams

The post page is SSG, but `useSearchParams()` is client-only. A client wrapper solves it:

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

With the default Header as the fallback, the layout doesn't break before hydration.

### Related posts respect the from tag too

If you arrived with `?from=Thoughts`, the related posts should surface Thoughts-tagged posts first.

The server pulls a generous six candidates, and the client re-sorts by the from tag and shows three:

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

### A series filter bug

Doing this turned up an existing bug. The same-series exclusion in `getRelatedPosts`:

```typescript
// bug: undefined !== undefined → false → every series-less post gets excluded
.filter((post) => post.series !== currentPost.series)

// fix: pass when neither has a series
.filter((post) => !post.series || !currentPost.series || post.series !== currentPost.series)
```

`undefined !== undefined` is `false`. Standalone posts with no series were dropping out of each other's related lists entirely.

## 404 page

The old 404 was Next.js's default screen, which was a bit bare. I made it more fun by floating ten mascots around.

I reused the SVG from `MascotCharacter.tsx` (viewBox `0 0 80 80`) as-is to keep the design consistent. CSS keyframes give each one a different orbit:

```css
@keyframes mascot-float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(var(--dx), var(--dy)) rotate(10deg); }
  50% { transform: translate(calc(var(--dx) * -0.5), calc(var(--dy) * 0.7)) rotate(-5deg); }
  75% { transform: translate(calc(var(--dx) * 0.3), calc(var(--dy) * -0.8)) rotate(8deg); }
}
```

Positions and orbits come from `seededRandom`, so a refresh gives the same layout. After a 10-second countdown it goes home automatically.

## Part 9 summary

- **Categories → tags** → flattened folders, `[category]/[slug]` → `/posts/[slug]`
- **301 redirects** → old URLs preserved (`/ai/*` → `/posts/*`)
- **Tag registry** → `as const` + union type to prevent typos
- **Build-time validation** → `console.warn` on unregistered tags
- **Query parameter** → `?from=tag` remembers where you came from
- **Related-post priority** → posts matching the from tag surface first
- **Series filter bug fix** → the `undefined !== undefined` trap
- **404 page** → ten mascots + 10-second auto redirect

Bulldozing categories actually shrank the code. When something complicated becomes simple, that usually means the direction is right.

---

*Made category folders, then bulldozed them. Should have just used tags from the start.*
