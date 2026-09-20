---
title: Two meanings of the same field
date: 2026-09-20
summary: The vendor documents what a field is for. The business decides what goes in it. A model that reads only the first of those inherits a bug.
tags: Data modelling, Documentation
draft: true
---

I once wrote the reference documentation for 149 tables of an ERP. It sounds
like transcription work: read the vendor's field descriptions, tidy them up,
publish. It is not, and the reason is the most useful thing I know about
working with somebody else's data model.

The vendor documents what a field is *for*. The business decides what goes
*in* it. Those are two different facts, and they diverge often enough that
every table page I wrote ended up carrying both.

## The definition has two halves

A vendor's field description is a statement of intent, written before anyone
here had touched the system. It is accurate about design and silent about use.
Local practice fills that gap over the years: a spare text field becomes a
customer reference, a status code stops being set after a process change. None
of that is in the manual, because the manual predates the decisions.

So each page carried two blocks. The vendor's description, and a measured note
saying what the column actually holds here, with the date I measured it. Where
they disagreed, the note won.

## The field that looked like an author field

A report request needed to know who had submitted a particular kind of record.
There was a field named for the last person to change the row, fully
populated, holding user IDs. It looked like an answer.

It was not one. Two things turned up once I looked at the values rather than
the name:

- Some of the IDs were service accounts, not people. I sorted those out by
  activity window: a person's edits cluster in office hours over a few years,
  an integration account's land every night at the same minute.
- The field records the last change, not the first, so any later edit by
  anyone overwrites it.

Worse, the system had never retained who submitted the record at all. That
fact was kept somewhere else entirely. So the honest answer was the finding
plus the limitation of the source, which is a better deliverable than a number
that looks confident.

## Write the observed meaning down, dated

For an analytics engineer this is not a documentation nicety, it is a defect
class. **A model that reads a field by its documented meaning inherits a bug
the day local usage diverges from it.** The model still builds, the tests
still pass, and the figure is quietly wrong, because nothing in a warehouse
has an opinion about whether a column means what its name says.

So the observed meaning belongs in the model's own documentation, dated, next
to the vendor's, and the teams downstream should read both. The date is not
decoration: usage changes, and an undated note about a column is a claim with
no expiry on it.

That rule is what I am carrying into dbt-catalog-mcp, a server I am designing
to answer plain-English questions about a dbt project's catalog. It is at
design stage with no code written yet, but this part of the shape is settled:
a note overlay file beside the project, returned labelled alongside the
documented description rather than silently replacing it.

```yaml notes/dim_order.yml
columns:
  changed_by:
    observed: Last editor, not the author. About 8% are service accounts.
    measured_on: 2026-09-14
```

Both readings come back. The consumer decides which one their question needs.

## What it costs

Reading a column twice is slow. You count by value, look at the tail, check
the nulls, check whether the distribution shifts on some date when a process
changed. It can take an afternoon on a table you were expecting to model in an
hour.

That afternoon is the cheapest one in the project. You do not save it by
skipping it. You spend it later, with a stakeholder in the room, explaining
why a number that has been on a dashboard for six months was never measuring
the thing its label promised.

Measure the column before you model it, and write down what you measured and
when.
