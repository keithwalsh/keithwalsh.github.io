---
title: The status column is a snapshot
date: 2026-09-11
summary: A current state tells you where something is, not how long it took to get there. Turning a change log into intervals is most of the work, and one test decides whether you can trust them.
tags: Data modelling, Testing
draft: true
---

Most operational tables carry a status column. It is the cheapest fact in the
system, overwritten in place on every change, and it answers exactly one
question: where is this thing now. Every question anyone actually asks is about
the journey. How long did it sit waiting. Where does the time go. How often do
we go backwards.

None of that is in the column. It is in the change log, if the system keeps one,
and if you kept it row for row when you loaded it.

I am working this out in `jira-dbt`, a dbt project over issue data loaded by
`jira-data-etl`. The loader runs. The dbt project is at design stage with no
models written yet, so what follows is the shape I have settled on and why.

## From a change log to intervals

The loader stores the changelog row for row: one row per change, with the field,
the value before, the value after, and a timestamp. That is deliberate. An
issue's current status is a snapshot, and the changelog is the only source of
truth for how long it spent anywhere.

Turning that into something measurable is two steps. Unroll the transitions into
one row per entity per continuous stay in a status, then sum those into one row
per entity per status.

```sql int_status_intervals.sql
select
    entity_id,
    to_status   as status,
    changed_at  as valid_from,
    lead(changed_at) over (
        partition by entity_id
        order by changed_at, change_id
    )           as valid_to
from transitions
```

That is the whole idea. Everything after it is the awkward cases.

## What an event log actually throws at you

- An entity with no events at all. It never left its first state, so it has one
  interval running from creation to now. An inner join drops it silently, so the
  first state has to be supplied and joined from the left.
- The last interval is open. `valid_to` is null because the thing is still
  there, and anything summing hours has to decide what that null means and say
  so.
- Ties and out-of-order arrivals. Two changes can share a timestamp. Ordering by
  timestamp then by change id makes the sequence deterministic, so two builds of
  the same data agree.

One more is a modelling choice rather than a data defect: every metric is
defined on the three status categories, never on status names. Each project
invents its own workflow, and two names that mean the same thing will not be the
same string.

## The test that the parts sum to the whole

Three custom tests sit on the intervals. No negative durations. No overlapping
intervals for one entity. And for anything resolved, the intervals must sum to
the created-to-resolved span within one minute, which is the resolution the
loader stores timestamps at.

The first two catch obvious breakage. The third is the one that earns its keep.
**A reconciliation test is worth more than any number of not-null tests**,
because a missing interval is not null anywhere. It is simply absent, and every
row that survives it still looks correct. Unique passes. Not-null passes. The
mart builds green, the total is quietly too small, and nobody notices until
somebody who knows the process says a figure looks low.

## Reconstructed, not recorded

A status column is maintained for free, which is why every system has one. A
history costs storage and care, and it is the only thing that can answer a
question about duration.

So the rule I work to is short. If a system overwrites a value in place, assume
the number someone eventually asks for is about the overwriting and not about
the value.

The current state is the answer a system gives away. Everything worth measuring,
you have to rebuild.
