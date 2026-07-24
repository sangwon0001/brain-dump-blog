---
title: "I Thought I Was a Galápagos of One"
description: "Between coder and architect in the AI era. The MoltBot creator's line about shipping code he hasn't read made me slap the table."
date: "2026-02-05"
tags: ["AI", "Tech", "Thoughts", "아키텍트", "1인개발", "시스템설계"]
---

# I thought I was a Galápagos of one

Working on projects lately, I kept wondering whether I was digging too deep on my own — turning into a Galápagos species.

Then today I happened across **["MoltBot's creator: I ship code I haven't read"](https://news.hada.io/topic?id=26222)** and slapped the table. This developer, who codes at home for fun, says **he ships AI-written code without bothering to read it**. He doesn't spend energy on tedious implementation review; he pours all of it into **system design**. And thanks to that, working alone, he's producing output at something like big-tech pace.

**"So it isn't just me thinking this way."**

On the back of that odd sense of kinship, let me write up the conversation I had with Yum over dinner today.

> **"Coder, architect, C-level. Which of these gets replaced by AI?"**

The way I see it, **coders are being replaced because it's now possible (capability), and C-level is hard to replace because of accountability.** So what about the **architect** stuck in between? That's where it gets interesting.

## An era where the friction coefficient of implementation is zero

Practicing architecture used to be expensive. Design it, convince your teammates, implement it, get feedback... one cycle takes months, years. Even a senior architect — how many times could they have run that cycle in a career?

But doing it now is different. The AI agent handles implementation, so you throw a design at it and it becomes code immediately. **The friction coefficient of implementation converges to zero.** You can run a "high-density simulation" where you tear down and rebuild the architecture dozens of times a day. The rate at which experience accumulates is on a different scale.

## The architect who ships code they haven't read

Like the MoltBot creator said, even **"reading and reviewing the code"** may now be a luxury. Plenty of **vibe coders** who only get things roughly working will flood in, and the more that happens, the more valuable the people who ignore implementation detail and command **the large structure** become — or so I suspect.

Because implementation gets easy, you can stop worrying about the miscellany (environment setup, library conflicts) and immerse yourself in **pure logic and structure**. I call this **streamlined development** — there's a feeling of your intent landing in the product without distortion.

## Blocking my own spear with my own shield

There's a trap here though. "I design, the AI writes" → that's a fast lane into **confirmation bias**. There's no colleague next to you saying "this isn't right, is it?" The AI says everything is fine.

So I run an actual **agentic team**.

- the one that implements
- the one that tears down my design (devil's advocate)
- the one that calculates whether it makes money

Assembling a team like that used to cost real money. Now I build my own **one-person legion** out of personas I designed. Modern business is, I think, a fight over how well you systematize this **destructive self-verification**.

## The Rosetta Stone moment

There was a moment where I felt this really works. Designing a protocol, I hit the problem: **"how do I compare user data across different models?"** Technically the vector spaces differ, so they genuinely aren't compatible.

At an old company the dev team and the business team would have sat down and fought for weeks over "impossible" versus "make it happen." Instead, ten minutes of back-and-forth with an AI architect produced: **"measure the distance between different anchors and map through that."** Call it the Rosetta Stone strategy.

Technical constraints and business requirements fused on the spot. That, I think, is the solo architect's real weapon.

## In the end it's the question

AI seems to be better at coding now. Let's admit what should be admitted. What we turn into instead is the person asking **"what should we build?", "does this make business sense?", "what's the risk?"**

The AI produces the answers, I produce the questions.

**It feels like the age of deliberate solo architects, walking the tightrope between self-actualization and business, is arriving.**

Filing it here for now.
