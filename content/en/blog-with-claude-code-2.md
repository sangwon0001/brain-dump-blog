---
title: "Whipping Up a Blog with Claude Code (Part 2: Customizing)"
description: "Hot pink theme, SEO, image optimization, automatic series detection. Put some meat on the bones."
date: "2026-02-04"
tags: ["claude-code", "nextjs", "seo", "theming", "Develop"]
series: "Whipping Up a Blog with Claude Code"
---

## Part 1 put up the skeleton

[Part 1](/en/posts/blog-with-claude-code-1) built the basic structure. This time I put some meat on it.

- Theme customization (hot pink 🩷)
- SEO optimization
- Automatic image optimization
- Series table of contents & related-post suggestions

## Theme customization

### Went with hot pink

I didn't like the default blue theme.

```
me: "let's change the theme color. I don't like it"
Claude: "What style do you want? Green, purple, orange, rose..."
me: "real men go hot pink"
```

So hot pink it became.

### CSS variable structure

With Next.js + Tailwind, managing the theme through CSS variables is the easy path.

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
  --bg-primary: #120a10;          /* magenta-tinted black */
}
```

Use `var(--accent-primary)` in a component and it follows the theme automatically.

### Dark mode background

Plain black under hot pink didn't work.

```
me: "make the dark mode background go with the hot pink too"
```

Result: a dark shade with a hint of magenta/burgundy in it (`#120a10`)

The AI is good at this kind of fine color adjustment. I never had to go hunting for color codes.

## SEO optimization

A blog only means something if search can find it.

### I asked for all of it in one go

```
me: "shall we do SEO?"
Claude: "Let me check the current state... sitemap ❌, robots.txt ❌, OG tags ❌"
Claude: "I'll add all of them"
```

### What got added

**1. Metadata (OG, Twitter)**

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

Add a post and it lands in the sitemap automatically.

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

## Image optimization

Write `![alt](/images/pic.png)` in markdown and you get a plain `<img>` tag. No optimization.

### Swapping in the Next.js Image component

I overrode `img` in the MDX components:

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

### Config

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
};
```

Now images written in markdown get:
- Automatic WebP/AVIF conversion (70% smaller)
- Lazy loading
- Responsive sizes

## Series table of contents & related posts

Once you have a lot of multi-part posts, you need navigation.

### Automatic series detection

```
me: "can you link between posts? and show a table of contents automatically for series"
```

I made it detect the "(Part 1", "(Part 2" pattern from the title.

```typescript
// mdx.ts
const patterns = [
  /^(.+?)\s*\((\d+)편[:\)]?/,  // "Title (1편:" or "Title (1편)"
  /^(.+?)\s+(\d+)편[:\s]/,      // "Title 1편:"
];
```

With that:
- Posts in the same series get grouped automatically
- A series table of contents appears at the top of the post
- Previous/next navigation appears at the bottom

You can also state `series: "Series name"` in the frontmatter directly.

### Related-post suggestions

Related posts are recommended automatically based on tags.

```typescript
// tag match score
const matchingTags = post.tags.filter((tag) =>
  currentPost.tags.includes(tag)
).length;
```

The more tags overlap, the higher it ranks. Posts in the same series are excluded so nothing shows up twice.

## Various small things

### Favicon

```
me: "can the favicon be a brain too?"
```

How to make an emoji favicon in Next.js:

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

This works. The emoji becomes the favicon.

### The blog's name

```
me: "blog title, something like 'storage for brain capacity'"
Claude: (a few suggestions)
me: "let's go with 뇌 용량 확보용"
```

And a matching description: "A blog for flushing my head and freeing up RAM."

## That's it for now

What Part 2 covered:
- Hot pink theme (dark mode included)
- SEO (sitemap, robots, OG tags)
- Automatic image optimization
- Series table of contents & related posts

Next part will probably be about the system for getting the AI to write posts. Extracting a persona and building a guide.

---

*This post, and Part 1, both started as drafts from telling Claude Code "summarize what we've done so far."*
