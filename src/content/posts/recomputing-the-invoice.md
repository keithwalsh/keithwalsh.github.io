---
title: Checking an invoice by recomputing it
date: 2026-08-21
summary: A spot check finds the error somebody already suspects. Recomputing the whole thing from the terms finds the ones nobody reported.
tags: Testing, Reliability
draft: true
---

For four years I worked on billing data, and the recurring request was some
version of "can you check this invoice". What was usually wanted was a spot
check: take the three lines somebody had noticed and confirm the charge.

A spot check only ever settles the thing that prompted it. It says nothing about
the other four thousand lines, which is exactly where the errors nobody has
complained about are sitting.

## Looking at a number is not checking it

Reading a charge back off the system confirms that it is the number the system
produced. It does not confirm that it is the number the terms require, because
the same code produced both the charge and the thing you are reading.

The only independent check is to derive the amount again from the agreement. At
Pitney Bowes I built a rerate tool in Python and SQL over Snowflake that
recalculated client invoices across multiple pricing structures and data
sources, and automated checks that detected invoice errors and validated refund
calculations, cutting manual effort by over 50%. The saved effort was the
smaller half of it. What changed was which errors we found.

## What a recomputation needs

Three things, and the arithmetic is the easy one:

- **The terms as data, not as prose.** An agreement that lives in a PDF cannot
  be executed. Somebody has to turn its bands, minimums and exceptions into
  rows.
- **The same inputs the original calculation saw.** This is the hard part,
  because inputs change after the fact. A record gets corrected, a rate is
  backdated, a classification is revised. Recompute today against today's
  inputs and half the differences you find are your own.
- **A tolerance.** Two correct calculations of the same amount can differ by a
  rounding rule, and a reconciliation that flags every cent of that stops being
  read.

## The difference is the output

**The interesting output is not the total, it is the difference and its
explanation.** A report saying the two totals disagree by a few hundred euro
gives nobody a next step. A report saying these forty lines differ, and here is
the rule each one took, is a morning's work for one person.

```sql invoice_line_diff.sql
select
    b.line_id,
    b.charged_amount,
    r.recomputed_amount,
    r.rule_applied,
    b.charged_amount - r.recomputed_amount as difference
from billed_lines as b
join recomputed_lines as r using (line_id)
where abs(b.charged_amount - r.recomputed_amount) > 0.01
order by abs(b.charged_amount - r.recomputed_amount) desc
```

The `rule_applied` column is the one people use. Leave it out and you have told
somebody there is a problem while keeping the part of the job you had already
done.

## From an audit to a control

Once the recomputation exists it stops being an audit. You can run it before the
invoice goes out rather than after a customer questions it, and that changes
what a wrong line costs: a corrected row instead of a credit note and a
conversation about what else might be wrong.

A check that runs every cycle carries one obligation an audit does not. It has
to say why a line differs. A recurring list of unexplained differences gets read
carefully twice, skimmed for a month, then filtered into a folder, and by then
it is worse than no check, because everyone believes it is being read.

The shape generalises to anything where one system records what should have
happened and another records what did: schedules against actuals, forecasts
against deliveries, entitlements against usage. Wherever you hold both, you can
already recompute one from the other. The only question is whether you do it
before somebody else does.
