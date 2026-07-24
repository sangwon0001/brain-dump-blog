---
title: "Whipping Up a Blog with Claude Code (Part 6: Comments, Tags, UX)"
description: "Clearing out Low Priority. Back to Top, print styles, tag archive, and Giscus comments."
date: "2026-02-04"
tags: ["claude-code", "nextjs", "blog", "giscus", "ux", "Develop"]
series: "Whipping Up a Blog with Claude Code"
---

## Quickest ones first

Part 5 finished off Medium Priority. Five Low Priority items were left.

```
@roadmap.md do the quick ones first
```

Claude Code analyzed it and said the Back to Top button was the fastest. Correct.

## 1. Back to Top button

The scroll-to-top button that appears once you've scrolled down.

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
    <button onClick={scrollToTop} aria-label="Back to top">
      ↑
    </button>
  );
}
```

Put it in layout.tsx and it applies to every page.

## 2. Print styles

Hide the unnecessary parts so printing comes out clean.

```css
/* globals.css */
@media print {
  /* things to hide */
  header, footer, nav, button[aria-label="Back to top"],
  .theme-toggle, .search-button, .toc-container {
    display: none !important;
  }

  /* show the URL for external links */
  a[href^="http"]::after {
    content: " (" attr(href) ")";
    font-size: 0.8em;
  }

  /* keep code blocks from splitting across pages */
  pre, img {
    page-break-inside: avoid;
  }
}
```

Just CSS, nothing else.

## 3. Tag archive

A page listing all tags, and a page listing posts per tag.

First, helper functions in mdx.ts.

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

Two pages.

```
/tags          → all tags (tag cloud)
/tags/[tag]    → posts under that tag
```

Tag size varies with how often it's used.

## 4. Giscus comments

A comment system backed by GitHub Discussions. Takes a bit of setup.

### 4.1 GitHub setup

1. repo Settings → Features → enable Discussions
2. Go to https://giscus.app and generate a config
3. Copy repo-id and category-id

### 4.2 Build the component

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
    script.setAttribute('data-repo-id', 'YOUR_REPO_ID');  // from giscus.app
    script.setAttribute('data-category', 'General');
    script.setAttribute('data-category-id', 'YOUR_CATEGORY_ID');  // from giscus.app
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-theme', isDark ? THEME_DARK : THEME_LIGHT);
    // ...

    ref.current.appendChild(script);
  }, []);

  return <div ref={ref} />;
}
```

### 4.3 Dark mode integration

Change the theme and the comments need to follow.

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

A MutationObserver watches the html class and posts a message into the iframe.

### 4.4 Custom theme

Giscus's default theme didn't match the blog, so I made a custom one.

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

Matched to the hot pink accent color. It only applies once deployed.

## Build & deploy

```bash
npm run build  # success
git add . && git commit -m "feat: Add back-to-top, print styles, tags, and comments"
git push origin main
```

Vercel handles the deploy.

## Part 6 summary

What I did this time:
- **Back to Top** → appears after 400px of scroll
- **Print styles** → print optimization via @media print
- **Tag archive** → /tags and /tags/[tag] pages
- **Giscus comments** → dark mode integration + custom theme

Four Low Priority items done. Only the popular-post ranking is left, and that needs an Analytics API integration, so later.

---

*I asked for "the quick ones first" and they really were quick.*
