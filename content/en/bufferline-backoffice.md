---
title: "Singapore One-Person Company Accounting: I Decided to Just Build It"
description: "Instead of a $60/month accounting service, I built a CLI-based back office and handed it to an AI agent. Took three days."
date: "2026-03-25"
tags: ["AI", "Tech", "accounting", "singapore", "cli", "ai-agent"]
---

## What set this off

I set up a one-person company in Singapore.

Incorporating isn't hard. The problem is what comes after. Every month you issue invoices, run payroll (including CPF/SDL calculations), organize expenses, reconcile bank transactions, and prepare the material to hand your accountant at month end.

There are services for this. Xero, QuickBooks, that sort of thing. But the pricing is a bit much.

- With an accountant: $60+ per person per month
- SaaS alone: $20–30/month
- And few services properly support Singapore's particular tax rules (the SDL cap, CPF rates by age band, GST tax codes per line item)

Paying $60 a month for accounting on a one-person company didn't sit right.

---

## So I changed direction

Looking at where AI agents are going, it converges on this: **build good tools and the agent will use them**.

MCP was an option. But once installed, MCP has to load every tool description into context each agent session. The more tools, the larger the context consumption. There's talk on Claude's side about cutting MCP context with a "tools of tools" pattern, but I'd call that experimental for now.

A CLI, by contrast, is already structured I/O, self-documents through `--help`, has error codes, and runs straight from a shell. From the agent's point of view, the CLI itself is a skill. And if I need it later I can wrap the CLI in MCP. CLI → MCP is easy; the reverse is a pain.

So I thought:

**Build a CLI-based back office, attach it to Claude Code or Codex as a skill — doesn't that make a personal accountant agent?**

Airwallex provides a good API, and Singapore's tax rules are public information, so they're implementable in code. Invoice PDFs, payslips, bank reconciliation — I just need to produce clean evidence to hand the accountant.

---

## What I focused on while designing

### CLI-first, AI-native

Every capability follows the `acct <domain> <action>` pattern.

```bash
acct invoice create --client "ABC Corp" --currency SGD
acct invoice add-item $INV_ID --desc "Consulting" --qty 1 --rate 5000 --tax-code SR
acct invoice issue $INV_ID
acct payroll run --employee $EMP --month 2026-03
```

It's a tool a human can type, but the point is that it's an interface an agent can execute. Idempotent commands, explicit state transitions, structured errors (409 = invalid transition). The agent has to be able to look at the result and decide what to do next.

### Evidence-first

Every financial action leaves evidence. Invoice → PDF, payroll → payslip PDF, loan → agreement/statement/settlement-confirmation PDFs.

A Singapore company is obligated to retain five years of evidence for IRAS audits. Records without evidence aren't accepted in an audit. So I laid out the export pack structure from the start.

```
export-2026-03/
  manifest.json          # validation status, SHA256 checksums
  invoices/              # CSV + PDF
  payroll/               # CSV + payslip PDFs
  expenses/              # CSV + receipts
  payments/              # CSV
```

Hand the accountant this one ZIP and you're done.

### State machine

Invoices go `draft → issued → paid`, payroll goes `draft → reviewed → finalized → paid`. Invalid transitions get rejected server-side with a 409.

That's human-error prevention, but it matters more when an agent is using it. It structurally blocks the agent from "issuing an already-issued invoice."

---

## What works right now

Quite a lot.

- **Invoices**: per-line-item GST tax codes (SR 9%/ZR/ES/NT), PayNow QR codes (SGQR spec), multiple payment methods, recurring invoices
- **Payroll**: automatic CPF/SDL calculation (by citizen/PR/EP/SP/WP and age band), pro-rating, payslip PDFs
- **Expenses/payments**: receipt attachment, multi-document allocation, crypto payment support
- **Bank reconciliation**: CSV upload → automatic matching against existing records
- **Loan ledger**: director/shareholder loans, interest calculation, three document types (agreement/statement/settlement confirmation)
- **Compliance todos**: ten Singapore tax calendar templates (SDL/CPF 14-day payment, quarterly GST, etc.)
- **Month-end export pack**: everything out in one ZIP

Backend ~11,000 lines, 378 unit tests + 78 E2E. The Singapore tax rules alone are covered by 72 unit tests.

---

## What it looks like running

Send a command to Claude from mobile, the agent runs the CLI and returns the output.

![Dispatching a command to the agent from mobile via Claude|50%](/images/bufferline-backoffice/mobile-dispatch.png)

A generated invoice PDF. Per-line-item GST tax codes and the breakdown go in automatically.

![Example generated invoice PDF|50%](/images/bufferline-backoffice/invoice-sample.png)

Payslips generate automatically too, with CPF/SDL calculations included.

![Example payslip PDF|50%](/images/bufferline-backoffice/payslip-sample.png)

---

## I open-sourced it

I put it up as open source. No idea whether anyone will use it lol.

There can't be many developers running a one-person company in Singapore, but if someone's in a similar situation it seemed right to make it usable.

Though I think this project's meaning lies somewhere other than the open source itself.

---

## The real point: friction coefficient zero

What I felt building this is that it's a pretty good case study as **an experiment in replacing simple repetitive work with AI without breaking consistency**.

Accounting is repetitive but has to be exact. One wrong number and you get caught in an audit. So I forced state transitions through a state machine, made retries safe with idempotent commands, and generated evidence automatically. The direction is structurally reducing the paths where an agent can make a mistake.

And one more thing.

**It took three days, even while doing other work in parallel.**

That's the point worth thinking about. "I can just build it when I need it" shows what the implementation friction coefficient looks like right now.

Building a system like this used to mean blocking out weeks. Now, if you deliver the design intent and constraints accurately to Claude Code and Codex, the implementation comes out fast. Tax calculation logic, PDF templates, 146 API endpoints, tests — no need to hand-write any of it.

The design still has to be human, of course. "Which state transitions do we allow," "at what point is evidence generated," "where are the paths an agent could get it wrong" — those judgments have to come from someone who knows the domain. But once you make those judgments, implementation is close to automatic.

---

## To sum up

- Started because Singapore one-person-company accounting costs annoyed me
- Designed CLI-first so it attaches directly as an AI agent skill
- Held consistency with a state machine + idempotency + automatic evidence generation
- Built in three days while doing other work

Stripe integration and on-chain payment verification aren't done yet. I'll add them if I need them while using it.

That's it for now. I'll probably add a follow-up after running it for a few months.
