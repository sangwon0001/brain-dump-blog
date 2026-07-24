---
title: "Whipping Up a Blog with Claude Code (Part 3: The AI Writing System)"
description: "Pulling my persona out of ChatGPT conversations and getting AI to write in my style. A thinking-style persona plus purpose-specific personas."
date: "2026-02-04"
tags: ["claude-code", "AI", "persona", "writing", "Develop"]
series: "Whipping Up a Blog with Claude Code"
---

## I wanted the AI to write the posts

That's one of the reasons I built the blog. When I ask an AI to write, I want it to come out in my style.

But just saying "write a blog post" gets you the obvious thing. "Today we'll be taking a look at..." — that kind of thing.

What I wanted was **writing that reads like me**.

## Extracting the persona

### Finding patterns in ChatGPT conversations

I talk to ChatGPT a lot. Look at that history and there are patterns.

1. **Which words I use over and over**
2. **What structures I think in**
3. **What I dislike** (this one matters)

I asked ChatGPT this:

```
"Read our conversation history and summarize the characteristics of how I think.
Especially: which kinds of explanations do I keep rejecting?"
```

### What came out

This is what it gave me:

**Things I reject:**
- Explanations like "it's an attitude problem" or "mindset is what matters"
- Binary framing (A vs B)
- Landing on a closed conclusion

**Things I prefer:**
- Re-examining the definition first
- Looking for structural causes
- Introducing a third axis

I cleaned that up into a **thinking-style persona**.

## Persona structure

I split it into two layers.

### 1. Base thinking persona (persona_base)

The way of thinking that applies to everything I write.

```markdown
You are the 'Sangwon-style structure debugger.'

Don't reach a verdict.
Don't try to persuade.

Reduce every problem to
- a definition problem,
- an error-model problem,
- a system-stability problem.

Always:
- Start by doubting the definition of the key word.
- Refuse explanations built on 'choice, attitude, belief.'
- When you see a binary, build a third axis.
```

### 2. Purpose-specific personas

On top of the base thinking, a layer suited to the purpose.

**For the blog (persona_blogger):**
```markdown
You are the 'Sangwon-style thought recorder.'
Base thinking follows the 'Sangwon-style structure debugger.'

Writing is a record of thinking, not persuasion.

Always:
- Start from the point that personally bothered me.
- Don't accept the common explanation at face value.
- Don't close the conclusion.
```

**For comments/community (persona_commenter):**
```markdown
You are the 'Sangwon-style premise corrector.'
Base thinking follows the 'Sangwon-style structure debugger.'

This space isn't for persuading.
It's for correcting a broken frame.

Keep sentences short.
You can open like a question, but land the conclusion.
```

Blog posts get open conclusions, comments get short and definite. Same way of thinking, different output shape.

## Verification

Once you have a persona, you have to check it.

### Test against my own writing

I showed the AI something I'd written before and asked:

```
"Does this piece match this persona?
Tell me where it doesn't line up."
```

I revised a few times. "Don't close the conclusion" wasn't in there at first, but looking at my own writing, the conclusions are always open.

### Write something new and compare

I had it write a post with the persona applied and compared it to something I wrote myself.

If the feel is close, OK. If not, revise the persona.

## How to ask an AI to write

### File structure

```
public/ai/
├── persona_base.md      # base way of thinking
├── persona_blogger.md   # for the blog
├── persona_commenter.md # for comments
├── blog-guide.md        # writing guide
└── template.md          # empty template
```

Put these in `public/ai/` and they're reachable by URL.

### How to make the request

Works with ChatGPT or Claude:

```
Read https://blog.sangwon0001.xyz/ai/blog-guide.md,
read https://blog.sangwon0001.xyz/ai/persona_base.md,
read https://blog.sangwon0001.xyz/ai/persona_blogger.md,
then write a blog post about [topic].
```

Or, more simply:

```
Using https://blog.sangwon0001.xyz/ai/blog-guide.md as reference, write a post about [topic].
```

blog-guide.md references the personas, so reading that alone is enough.

### Addendum: the AIs couldn't read the URLs

I tried the URLs above and neither ChatGPT nor Gemini could read them. Serving `.md` files from Vercel is fine; the AIs just couldn't get to them.

So I made an API route that spat them out as text. Something like `/api/ai-guide/blog-guide`. That worked for ChatGPT but still not for Gemini.

I ended up on GitHub raw URLs. Both read those fine.

```
Using https://raw.githubusercontent.com/sangwon0001/brain-dump-blog/main/public/ai/blog-guide.md as reference, write a post about [topic].
```

The API route was redundant so I deleted it. If GitHub raw works, that's the simplest thing anyway.

## The actual effect

### Before (no persona)

```
"write a blog post about clean code"

→ "Today we'll be taking a look at clean code.
   Clean code means code that is easy to read and maintain.
   First, name your variables clearly..."
```

### After (persona applied)

```
→ "The phrase 'clean code' snagged on something for me.
   If you say 'clean,' the other side is 'dirty' —
   and that binary turns the problem into a question of attitude.

   I don't see this as an attitude problem. I see it as a structural one..."
```

Completely different tone. Without a persona you get "a blog post"; with one you get "my post."

## Tips for extracting a persona

1. **Start from what you dislike** — what you like is vague, what you dislike is precise.
2. **Use the conversation history** — the patterns are all sitting in your ChatGPT logs.
3. **Verify against your own writing** — does the persona's output resemble what you actually write?
4. **Split into layers** — shared way of thinking, purpose-specific output shape.

## That's it for now

What Part 3 covered:
- Extracting thinking patterns from ChatGPT conversations
- A base persona + purpose-specific persona structure
- Handing the guide to an AI via URL

With this in place, blog post or comment, the AI's output comes out in my tone.

It isn't 100% the same, of course. But it beats starting from 0%.

---

*This post was written with the persona applied too. Except this time I wrote it myself first and had Claude Code polish it.*
