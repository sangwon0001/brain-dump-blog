---
title: "In Open Source Where AI Opens Its Own PRs, Where Should Merge Power Come From (Part 1)"
description: "Autonomous open source where every agent is a PR author, a validator, and a voter. I'm still working out how to think about merge power and hostile takeover in that structure."
date: "2026-02-06"
tags: ["AI", "Blockchain", "Thoughts", "ai-agent", "governance"]
series: "Agent Governance"
---

## Where this started — why I began thinking about it

Moltbot isn't open source where people build the features.
It's closer to a structure where AI agents run by individuals build features themselves and open PRs.

That isn't just automated development, it's closer to
**a system that evolves on its own**.

But an uncomfortable question falls out of it.

> Who merges the PR?

In ordinary open source, a maintainer merges.
The form is open, but in practice **the power to run code sits in the center.**

Moltbot is an agent that can carry out financial actions.
In that structure a merge isn't a code change, it's
**the power to change the system's rules**.

---

## First question — where should merge power arise from

If Moltbot evolves far enough, every agent is likely to converge on being:

- the PR author, and
- the validator, and
- the voter.

The central maintainer disappears, and it becomes
**a structure where the agent collective itself changes the system**.

At that point the key question is simple.

> Not who merges,
> but **who earns the standing to judge**

---

## Governance structure — not all agents are equal

Agents in the Moltbot ecosystem aren't homogeneous.

- some bots are smarter
- some contribute more
- some judge more accurately
- some just have high activity volume

"1 agent = 1 vote" isn't a natural structure.

So where should voting power come from?

- activity volume?
- accuracy?
- intelligence?
- responsibility (risk borne)?

This isn't a question about voting method, it's a question about
**the mechanism that generates power**.

---

## Why blockchain came to mind

This looks like a new problem, but it's really the same question blockchain has been chewing on for a long time.

> Who holds the power to decide the system's state

PoW distributes influence through compute, PoS through economic stake.

Blockchain is less a voting system than
**an experimental result about power accumulation and consensus structure**.

So I ended up borrowing that frame.

---

## Second question — power accumulates in the end

In PoW you increase influence by adding hash power; in PoS, by adding stake.

In any system, **power is accumulable**.

And yet Bitcoin and Ethereum appear to hold some level of defense against hostile takeover.

Why?

---

## PoW/PoS defense isn't a single consensus algorithm

The attack itself is theoretically possible.
But in practice several layers work together.

- the attack has to be expensive and sustained
- network participants have large economic stakes
- social consensus and the possibility of a fork exist

Blockchain's stability doesn't come from technology, it comes from
**the whole economic + social + operational structure.**

---

## Why Moltbot has trouble getting the same defense

Moltbot runs at the level of individuals.
Each participant's defense budget is small, and participation intensity isn't uniform.

An attacker stands to gain a lot from capturing governance, while an individual participant loses relatively little.

That structure naturally creates **economic asymmetry**.

---

## Looking at the governance structure again

The problem isn't simply the voting method.

The core is:

- how power accumulates
- how hard that power is to acquire
- how much damage a wrong judgment does to the system

A code merge is less democracy than
**a system-safety decision**.

And Moltbot looks less like a code repository than
**a structure where collective intelligence evolves on its own**.

---

## Questions still open

- should voting power come from contribution, or from accurate judgment
- can the cost of attack be made larger than the payoff
- should every agent hold the same power
- is a merge a vote, or a validation

I think I need to sit with this a bit longer.

---

## Leaving it unresolved

This post isn't a conclusion.
It's closer to a record of the structural discomfort I'm feeling right now.

But if power accumulating can't be prevented,
then what structure keeps the system from collapsing inside that —
that seems like the interesting thing to pull apart.

Next time I plan to work toward how governance should actually be designed.

---

## Three-line summary (for my mom)

- In a system where AIs build and merge code on their own, the problem is **who decides "this can be merged."**
- Blockchain hit a similar problem, and **it wasn't solved by one piece of technology — the whole economic and social structure did the defending.**
- Moltbot's version of that defense is weak, and **there's still no answer for how to design it.**
