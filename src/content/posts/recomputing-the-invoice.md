---
title: Checking an invoice by recomputing it
date: 2026-08-21
summary: How I checked billing by recalculating it from the agreement instead of reading the charge back, and why reproducing the original inputs is the hard part.
tags: Testing, Data modelling
draft: false
---

For four years a large part of my work was billing data, and the recurring request was some version of "can you check this invoice". What was usually wanted was a spot check: take the three lines somebody had noticed and confirm the charge.

A spot check only ever settles the thing that prompted it. It says nothing about the rest of the invoice, where the errors nobody has complained about are sitting. So I built a tool that recalculated client invoices from the agreements themselves, in Python and SQL, and reconciled them line by line against what had been charged. Separate checks for invoice errors and refund calculations cut the manual effort on that review by over half.

## Recomputing against the wrong inputs

A recomputation is worth only as much as the inputs you feed it, and inputs do not sit still. A record gets corrected three weeks after the fact. A rate is backdated to the start of the quarter. All of that is legitimate, and none of it announces itself in a total.

Recompute against today's inputs and half the differences you find are your own. You produce a list of discrepancies, spend a day on them, and most turn out to be the system being more right now than it was then.

So the recomputation has to ask for the data as it stood then: effective-dated rates, the version of a record that was live at the time, and the run timestamp stored with the result. Without that, the same check run a month later disagrees with itself, and nobody believes either answer.

## What a recomputation needs

Three things, and none of them is the arithmetic.

- The terms as data, not as prose
- The inputs as they stood then, not as they stand now
- A tolerance

An agreement that lives in a PDF cannot be executed, so somebody has to turn its bands, minimums and exceptions into rows, and that translation is where most of the argument about what the contract says comes out. The tolerance is duller and just as necessary: two correct calculations can differ by a rounding rule, and a reconciliation that flags every cent stops being read.

## The difference is the output

**A total that disagrees is not a finding. The line that disagrees, and the rule it took, is.** A report saying the two totals differ by a few hundred euro gives nobody a next step. A report saying these forty lines differ, and here is the rule each one took, is a morning's work for one person.

```sql invoice_line_diff.sql
select
    coalesce(b.line_id, r.line_id) as line_id,
    b.charged_amount,
    r.recomputed_amount,
    r.rule_applied,
    b.charged_amount - r.recomputed_amount as difference
from billed_lines as b
full outer join recomputed_lines as r on r.line_id = b.line_id
where b.line_id is null
   or r.line_id is null
   or abs(b.charged_amount - r.recomputed_amount) > 0.01
order by abs(b.charged_amount - r.recomputed_amount) desc nulls first
```

The rows with a null on one side read first: a charge with no rule behind it, or a rule with no charge.

## From an audit to a control

Once the recomputation exists it stops being an audit. Run it before the invoice goes out rather than after a customer questions it, and a wrong line costs a corrected row instead of a credit note.

A check that runs every cycle carries one obligation an audit does not. It has to say why a line differs. A recurring list of unexplained differences gets read carefully twice, skimmed for a month, then filtered into a folder, and by then it is worse than no check, because everyone believes it is being read.

The shape generalises to anything where one system records what should have happened and another records what did: schedules against actuals, entitlements against usage. The only question is whether you run it before a customer runs it for you.
