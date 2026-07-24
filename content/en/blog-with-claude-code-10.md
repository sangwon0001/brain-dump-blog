---
title: "Whipping Up a Blog with Claude Code (Part 10: Pinning the Persona Update as a Skill)"
description: "This one isn't about writing technique. It's a record of taking something I actually did — realigning my persona — and pinning it down as an automatable skill."
date: "2026-02-16"
tags: ["claude-code", "AI", "persona", "writing", "Develop"]
series: "Whipping Up a Blog with Claude Code"
---

## The starting point was simple

What I threw out first this time was:

> "Let's clean up the persona."

The reason was clear too.
The persona I originally built in ChatGPT was starting to feel thin,
and enough posts had accumulated that it seemed like the right time to update it.

So the problem wasn't "good sentences," it was
**a version update to a persona already in operation**.

## What actually mattered this time

The core of it wasn't a technology choice.

- Python or not
- Which script

Those were secondary.

What actually mattered was
**decomposing something I was already doing into automatable units and turning it into a skill**.

The flow was exactly two steps.

1. Realign the persona
2. Pin that realignment routine down as a skill

The point here isn't "a well-written document," it's building a structure I can run the same way again next time.

## I didn't just throw the whole corpus in either

What I paid the most attention to this time was the analysis target.

Rather than posts the AI heavily shaped into their final form,
I weighted **posts where I did most of the thinking and left the AI with proofreading**.

Because when you extract a persona, the standard should be
"text where my thinking pattern shows up directly,"
not "sentences the AI wrote well."

So the criteria for this update went roughly like this.

- Prefer posts with high density of my own original thinking
- Prefer posts where the AI's role was cleanup/proofreading
- Extract the rhythms that repeat across those patterns as rules

## What changed as a result

After this pass the persona is less a manifesto and more
**a set of operating rules grounded in an accumulated corpus**.

And with it split out as a skill,
the next time I make the same request there's less need to re-negotiate
"how should we organize this" from scratch.

## One piece of trial and error, immediately

It didn't end there — I tested it right away.
I rewrote `personal-ai-agent-and-web.md` with the skill and the first result was far too formulaic.

Headers got chopped up too aggressively, sentences followed the template literally,
and the original piece's breathing room shrank.

So I went back around:

1. Restore the original with `git restore`
2. Amend the skill rules: "the template is a guardrail, not a fixed mold," "rewrites are minimal-intervention"
3. Reapply as sentence-level local edits instead of a full rewrite

Only after that did the result feel natural.
Which confirmed again that a skill isn't something you build once — you tune it against real output.

## Part 10 summary

The core of this part is one thing.

- I didn't change my writing technique,
- I took the persona-update behavior I was already doing
- and pinned it down as a re-runnable skill.
- Then I looked at the actual rewrite output and adjusted the skill rules again.

Filing it here for now.
