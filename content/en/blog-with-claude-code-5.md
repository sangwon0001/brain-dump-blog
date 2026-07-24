---
title: "Whipping Up a Blog with Claude Code (Part 5: OG Images, SEO, Analytics)"
description: "Do the whole Medium Priority list. Automatic OG images, JSON-LD, Analytics, Callouts, and a reading progress bar."
date: "2026-02-04"
tags: ["claude-code", "nextjs", "blog", "seo", "og-image", "Develop"]
series: "Whipping Up a Blog with Claude Code"
---

## Just do all of it

Part 4 left me with roadmap.md. Five Medium Priority items were still open.

So I said:

```
work through @roadmap.md
```

Meaning: do all of it.

It created five tasks and started working through them in order.

## 1. Automatic OG image generation

The thumbnail that shows up when you share on social. With `@vercel/og` you can generate one dynamically in an Edge Function.

```typescript
// src/app/api/og/route.tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const title = searchParams.get('title') || '뇌 용량 확보용';
  const category = searchParams.get('category') || '';

  return new ImageResponse(
    <div style={{ /* styles */ }}>
      {category && <span>{category}</span>}
      <div>{title}</div>
      <span>뇌 용량 확보용</span>
    </div>,
    { width: 1200, height: 630 }
  );
}
```

Wire it into the metadata and you're done.

```typescript
const ogImageUrl = `${SITE_URL}/api/og?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(category)}`;

return {
  openGraph: {
    images: [{ url: ogImageUrl, width: 1200, height: 630 }],
  },
};
```

Now hitting `/api/og?title=test` returns an image.

## 2. JSON-LD schema

Markup that lets Google understand the structure of a post.

```typescript
// src/components/JsonLd.tsx
export function ArticleJsonLd({ title, description, publishedTime, url, category, tags }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    datePublished: publishedTime,
    author: { '@type': 'Person', name: '서상원' },
    // ...
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
```

Drop it into the post page.

```tsx
<ArticleJsonLd
  title={post.title}
  description={post.description}
  publishedTime={post.date}
  url={url}
  category={category}
  tags={post.tags}
/>
```

## 3. Vercel Analytics

The simplest one.

```bash
npm install @vercel/analytics
```

One line into layout.tsx.

```tsx
import { Analytics } from "@vercel/analytics/next";

// inside body
<Analytics />
```

Deploy to Vercel and it shows up in the dashboard right away.

## 4. Callout component

The box you use to highlight something in docs. NOTE, WARNING, TIP, that kind of thing.

```typescript
// src/components/Callout.tsx
type CalloutType = 'note' | 'warning' | 'tip' | 'danger' | 'info';

export default function Callout({ type = 'note', title, children }) {
  const config = calloutConfig[type]; // per-type color and icon
  return (
    <div className={`${config.bgClass} ${config.borderClass}`}>
      <span>{config.icon} {title}</span>
      <div>{children}</div>
    </div>
  );
}
```

In MDX it looks like this:

```mdx
<Callout type="tip" title="Tip">
  Use it like this.
</Callout>

<Callout type="warning">
  You can note caveats too.
</Callout>
```

Five types: `note`, `warning`, `tip`, `danger`, `info`

## 5. Reading progress indicator

The bar at the top that fills as you scroll.

```typescript
// src/components/ReadingProgress.tsx
'use client';

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress((scrollTop / docHeight) * 100);
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1">
      <div style={{ width: `${progress}%` }} />
    </div>
  );
}
```

Put it on the post page and that's it.

## Build check

Ran the build after everything.

```
✓ Compiled successfully
✓ Generating static pages (14/14)
```

No problems.

## roadmap update

Claude Code updated roadmap.md on its own.

```markdown
## ✅ Done

### 2026-02-04
- [x] Automatic OG image generation
- [x] JSON-LD schema
- [x] Vercel Analytics
- [x] Callout component
- [x] Reading progress indicator
```

Medium Priority is empty. Only Low Priority left.

## Part 5 summary

What I did this time:
- **OG images** → generated dynamically with `@vercel/og`
- **JSON-LD** → structured data for SEO
- **Analytics** → Vercel Analytics wired up
- **Callout** → highlight component for MDX
- **Reading progress bar** → scroll-based progress

Five features from a single "do all of it."

---

*Low Priority is comments (Giscus), a tag archive, and a Back to Top button. If I need them I can probably just say "do all of it" again.*
