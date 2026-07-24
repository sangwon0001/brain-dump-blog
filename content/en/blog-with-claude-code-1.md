---
title: "Whipping Up a Blog with Claude Code (Part 1: Design)"
description: "These days 90% of my work runs through Claude Code. Figured a blog would fall out of it just as fast, so I built one."
date: "2026-02-04"
tags: ["claude-code", "nextjs", "blog", "AI", "Develop"]
series: "Whipping Up a Blog with Claude Code"
---

## I set out to build one blog

More than 90% of my work goes through Claude Code these days. Writing code, reviewing it, cleaning up docs.

Which led to a thought: **"Couldn't I pull a decent-quality blog out of this pretty quickly?"**

So I built one. Writing it down because there are a few things worth keeping.

## Picking the stack

### Next.js + MDX + Vercel

```
me → Claude Code → Next.js blog → deploy to Vercel
```

Why this combination:
- **Next.js**: SSG support, SEO is fine
- **MDX**: writing in markdown is easy
- **Vercel**: you just deploy

But honestly the biggest reason was **"a structure that me, the AI, and any frontend dev can all follow."** Go complicated and the AI gets confused, and so do I.

### The real reason I went markdown-based

```
content/
├── ai/
│   └── intro-to-llm.md
└── tech/
    └── getting-started-nextjs.md
```

No database, no admin panel. Posts are managed as markdown files.

Because that's already how I write:

1. **Talk it through with ChatGPT or Gemini** → export to markdown once it's settled
2. **Ask Claude Code to just write the post** → it comes out as markdown to begin with

Either way the artifact is a `.md` file. So why not just drop that file into the content folder and be done?

Bolting on a CMS actually makes it worse. You end up copy-pasting the AI's markdown into an editor... an extra step. Annoying.

**AI output → blog post** — markdown was the structure with the shortest pipeline.

## What using Claude Code was actually like

### The more specific the prompt, the better

I started with this:

> "Build me a blog with Next.js"

That alone gets you a basic structure. But this pattern worked better:

```
[current state] + [what I want] + [constraints]
```

Examples:
> "Let's change this blog's theme color. Hot pink. Make the dark mode background match too."

> "Shall we do SEO? sitemap, robots.txt, OG tags, all of it."

### Continuing like a conversation was easier

```
me: "let's change the theme color"
Claude: (changes it)
me: "make the dark mode background match too"
Claude: (fixes dark mode as well)
me: "good, commit it"
Claude: (commits)
```

It holds the context, so I didn't have to re-explain everything.

### I let it ask when it didn't know

```
me: "add a bio too"
Claude: "What information should I put in?"
me: "look it up with the github cli"
Claude: (runs gh api user → pulls the info → writes the bio)
```

## Folder structure

Where it landed:

```
medium-blogging/
├── content/           # blog posts (markdown)
│   ├── ai/
│   └── tech/
├── public/
│   ├── images/        # post images
│   └── ai/            # AI writing guide
├── src/
│   ├── app/           # Next.js App Router
│   ├── components/    # React components
│   └── lib/           # utilities (MDX parsing)
├── CLAUDE.md          # AI assistant guide
└── README.md
```

The key piece is the `content/` folder. Drop a markdown file in there and it automatically becomes a post.

### The CLAUDE.md trick

Put a `CLAUDE.md` file at the project root and Claude Code reads it automatically.

```markdown
# CLAUDE.md

## Commands
npm run dev      # dev server
npm run build    # build

## Adding a new post
Create a file at content/[category]/[slug].md
```

Do this once and you stop re-explaining every time.

## Deploying

Vercel deployment really was simple:

1. Connect the GitHub repo
2. Done

It detects Next.js, builds, and deploys on its own.

```
https://blog.sangwon0001.xyz
```

## That's it for now

This was "putting up the skeleton."

- Basic structure done in a handful of exchanges
- Almost no hand-written code
- Designed around the shortest AI output → blog post pipeline

Next part will probably be about customization:
- Hot pink theme
- SEO optimization
- Automatic image optimization
- Getting the AI to write posts

I'll add more if anything else comes to mind.

---

*The first draft of this post also came from telling Claude Code "summarize what we've done so far and turn it into a blog post."*
