---
title: The status column is a snapshot
date: 2026-08-14
summary: Turning a change log into one row per stay in a status, and the reconciliation test that catches a missing interval when no not-null test can.
tags: dbt, Testing
draft: false
---

Someone asks how long tickets sit waiting before anyone picks them up. The tracker has a status column on every issue, and it cannot answer. The column is overwritten in place on every change, so it holds exactly one fact: where the thing is now.

Every question anyone actually asks is about the journey. How long did it wait, how often does it go backwards, did the workflow change help. None of that is in the column. It is in the change log, if the system keeps one and you kept it row for row when you loaded it.

I am working this out in `jira-dbt`, a dbt project over issue data loaded by `jira-data-etl`. The loader runs; the dbt project is at design stage with no models written yet, so what follows is the shape I settled on.

## From a change log to intervals

The loader stores the changelog row for row: one row per change, with the field, the value before, the value after, and a timestamp. That is the only source of truth for how long anything spent anywhere.

Two steps. Unroll the status rows of the change log into one row per entity per continuous stay in a status, then sum those into one row per entity per status. The shape of the intermediate model is a window function over the union of two sources, the creation of the entity and its transitions:

```sql int_status_intervals.sql
select
    entity_id,
    status,
    valid_from,
    lead(valid_from) over (
        partition by entity_id
        order by valid_from, change_id
    ) as valid_to
from (
    select entity_id, first_status as status, created_at as valid_from,
           0 as change_id
    from entities
    union all
    select entity_id, to_status, changed_at, change_id
    from transitions
)
```

The rest is the awkward cases.

## What an event log actually throws at you

Three of them, and the first two are about the ends of the sequence.

- The first interval is not in the log
- The last interval is open
- Two changes can share a timestamp

A change log records exits, so an entity's first row is the change that took it out of its initial state. Creation to that change comes from the entity table, and an entity that never changed needs that row and nothing else. At the other end, `valid_to` is null because the thing is still sitting there: for a resolved entity it closes at the resolution timestamp, which is what the reconciliation below needs, for a live one at run time, and the mart says which.

Ties matter least: the loader does a full refresh every run, and ordering by timestamp then change id makes the sequence deterministic even when events land out of order. One more decision is a modelling choice rather than a data defect: every metric is defined on the tracker's three status categories, To Do, In Progress and Done, never on status names, because workflows differ by project and two names for the same thing are not the same string.

## The test that the parts sum to the whole

Three custom tests go on the intervals. No negative durations. No overlapping intervals for one entity. For anything resolved, the intervals must sum to the created-to-resolved span within a minute.

The first two catch obvious breakage. The third earns its keep. **A reconciliation test is worth more than any number of not-null tests**, because a missing interval is not null anywhere. It is simply absent, and every surviving row looks correct. Nobody notices until someone who knows the process says a figure looks low.

## Reconstructed, not recorded

A status column is maintained for free, which is why every system has one. A history costs storage and care, and it is the only thing that answers a question about duration.

The current state is the answer a system gives away. Everything worth measuring, you have to rebuild.
