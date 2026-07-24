---
title: I Ran an AI Agent Project on ADRs + a Roadmap Instead of a Dashboard
description: Dashboards are in fashion, but separating decisions into ADRs and execution into a Roadmap fit better. A story about the structure I chose for repeatable quality, against a backdrop of SKILL-first design and AI loops.
date: 2026-02-21
tags: ["AI", "ai-agent", "adr", "roadmap", "skill", "workflow"]
---

Looking at AI agent teams lately, running things while building a dashboard is in fashion.
It looks good, it's impressive, it's easy to share inside and outside the team.

I'll grant the advantages.
But looking closer, I wondered what the dashboard is actually managing. Which decisions were made, what needs doing now, how far along things are. Isn't that just ADRs and a Roadmap?

The difference, if any, is running it "through an unnecessarily large number of agents in dashboard form." Each session reads the background context separately, state gets written constantly, and that cost accumulates as tokens. On top of that, agents aren't yet at the point of producing structured judgments worth putting on a dashboard on their own.

So starting a new project this time, instead of building a dashboard first, I decided to codify the approaches that had felt efficient in my own development work and adopt those.

## What is this project

Our startup has several services. This project's goal is to make those services usable by AI agents in practice.

But it isn't "attach an API and click."

Each service is at a different phase, some don't have a fixed spec yet, and if I dumped all the information in and ran it now, something would come out in an hour — but built that way, maintenance becomes garbage. No stability, no private key or secret management, no verification.

So I set the development direction from the start.

**SKILL-first, then MCP-hardening.**

The reason is practical.

- MCP fixes execution in code, so it's strong on completeness and minimizing mistakes. But it eats a lot of context and installation/operation has a difficulty cost.
- SKILL is plain text, so initial adoption and expansion are fast.
- So the default is SKILL, but at minimum I state an `action entry` so the execution path itself is fixed. Which intent calls which executor entrypoint — that routing gets nailed down.
- Then, starting from the sections where SKILL alone falls short on quality, attach MCP to codify execution and raise the level of mistake prevention.

So it isn't `SKILL vs MCP`, it's a design premised on `starting with SKILL and hardening into MCP` as a staged transition.

## How development actually ran

### A small AI loop + a big loop

Since this project is AI agents developing with each other, I ran the loop in two layers.

Small AI loop:
1. Codex produces the first decision draft or outline.
2. Claude gives feedback.
3. Codex incorporates it.

Big loop (with a human):
1. I give final feedback on intent, priority, and risk.
2. When the three parties agree, a PR opens.

I didn't use this only for writing ADRs — implementation followed the same shape. What mattered in the end was less "who's smarter" and more "is there a repeatable structure that reduces the same mistakes."

### SKILLs for development

Write the ADR, implement from the ADR, open the PR. Repeat that process and the agent starts getting dumber. Missing context, drifting format, dropping things that shouldn't drop.

So I turned the development process itself into SKILLs.

- ADR creation: at what scope an ADR is required, what the template is, where it goes
- ADR-based execution: if there's an accepted ADR, go straight to implementation mode; if not, go to ADR-writing mode first
- PR preparation: metadata format, sync checks, which validations to run depending on which files changed

These aren't the project's "output," they're SKILLs for *operating* the project. A minimal set of guardrails keeping the agent from getting dumber through repetition.

## The verification problem for output SKILLs

There was a different-context problem here.

The project's output — the SKILLs that define each service so an AI agent can use it — those are plain text. No compilation, no type checking like code.

And attaching them to multiple services means a lot of variation. On top of that, the product APIs they connect to aren't fixed yet, so there's a standing risk of frequent change.

Summed up, the state is:

- A plain-text SKILL can't be "debugged." A human reading and checking all of it every time hits a limit fast.
- When the API changes, the SKILL and the execution flow drift easily, and catching that by eye is unrealistic.
- The more services, the more this problem multiplies.

So I attached verification not as "perfect control" but as "a minimal survival device."

Right now I manage three things as a set per SKILL.

1. **SKILL definition**: the plain-text file the agent reads and executes
2. **Minimum spec doc**: what this SKILL must contain (action entry, required parameters, error cases, etc.)
3. **Validation script**: code that checks the SKILL automatically against the spec

Roughly like this:

```python
REQUIRED_ACTIONS = ["create-user", "update-profile", "delete-account"]
REQUIRED_FIELDS  = ["action_entry", "parameters", "error_handling"]

def validate(skill_file):
    skill = load_skill(skill_file)
    missing_actions = [a for a in REQUIRED_ACTIONS if a not in skill.actions]
    missing_fields  = [f for f in REQUIRED_FIELDS if f not in skill.metadata]
    exposed_secrets = scan_for_secrets(skill.content)
    return missing_actions, missing_fields, exposed_secrets
```

Because the three always move together, a SKILL change automatically trips the spec check, and a spec change pulls the validation along with it.

At first I only checked missing action entries, required metadata, and secret exposure. But as things progressed the AI started adding suggestions. Cross-checking the intent list against the actual service contract, confirming every marker exists in the test vectors, checking whether a changed file's related sync group got updated too. Accepting those one by one, the validation logic gradually got structured.

The net gain was larger on operational stability than on raw development speed. It wasn't designed up front — it accumulated naturally as I attached what was needed.

## Why I separated ADR and Roadmap

The operating method changed for a similar reason.

At first I tried to line things up as `1 ADR → 1 implementation PR`. One decision, one implementation. Clean.

But in practice ADRs are large and heavy as a decision unit, so they didn't always map 1:1 to an implementation unit. One ADR would produce several implementations, or several ADRs' decisions would overlap in one implementation.

So I split the roles.

- **ADR**: pins down why a decision was made. The domain of rationale.
- **Roadmap**: manages in what order and at what size to execute. The domain of execution.

After the change it felt better. Decisions wobble less, execution got smaller and more pleasant. And PRs stopped getting bundled just because an ADR was heavy.

## To sum up

This project isn't a rejection of dashboards.

It's that in my situation there were things to pin down before a dashboard.

- Decisions in ADRs
- Execution in a Roadmap
- Repeatable quality through SKILL standards and minimal validation

And the next stage goes toward attaching MCP to codify execution and raise completeness.

What mattered in this project was less
"the ability to produce output fast"
and closer to
"the discipline that keeps the output alive."

It's too early to call this a settled answer. But so far at least, it's running in a way that's closer to "repeatable quality" than to "one-click productivity."

I'll write the next part after the project moves further.

Of course, once context windows get vastly larger and even "the 1% of human judgment" becomes genuinely replaceable, the story could change. There was recent news about Fujitsu launching an AI development team service, and that direction presupposes systematized operational tooling — dashboard or otherwise. Right now that's over-structured for a one-man team like mine, but if those services become common, the dashboard approach could become a practical choice.

It just wasn't yet, which is why I picked this approach.

---

**Postscript.**
This post itself went through a funny process.
I first asked Codex to write the blog post. It's a genuinely strong model at code, but whether it's Korean prose specifically or writing in general, it just couldn't follow what I meant. Nineteen rounds of feedback and it kept losing the context.

I gave up and told it, "organize the things I said into conversation.md." That it did well.
Then I handed that conversation file and Codex's draft to Claude Code, and this post fell out in one click.

Looking back, I had no intention of applying the AI loop from the body of this post to blog writing. But Codex drafting, Claude cleaning up, and me giving final feedback was exactly that loop. It ran without being intended.

That different agents are good at different things — I experienced that directly in the writing process too.
