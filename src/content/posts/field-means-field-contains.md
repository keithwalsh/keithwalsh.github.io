---
title: Two meanings of the same field
date: 2026-08-28
summary: What I learned writing the reference documentation for 149 ERP tables, and why every page had to carry the observed contents of a field as well as the documented purpose.
tags: Data modelling, Documentation
draft: false
---

I wrote the reference documentation for 149 tables of an ERP. It sounds like transcription work: read the vendor's field descriptions, tidy them up, publish. It is not, and the reason is the most useful thing I know about somebody else's data model.

The vendor documents what a field is *for*. The business decides what goes *in* it. Those are two different facts, and they diverge often enough that the pages I wrote had to carry both.

## The definition has two halves

A vendor's field description is a statement of intent, written before anyone here touched the system. It is accurate about design and silent about use. Local practice fills the gap over the years: a spare text field becomes a customer reference, a status code stops being set after a process change. None of that reaches the manual, which predates the decisions.

So each page had room for two blocks. The vendor's description, and, where I had measured local usage and it differed, a note saying what the column actually holds, with the date I measured it. Where they disagreed, the note won.

## The field that looked like an author field

A report request needed to know who had submitted a particular kind of record. There was a field named for the last person to change the row, fully populated, holding user IDs. It looked like an answer.

It was not one. Two things turned up once I read the values instead of the name:

- Some of the IDs were service accounts, not people
- The field records the last change, not the first

Telling a person from an integration account was a matter of activity window: a person's edits cluster in working hours, an integration account's arrive on a schedule. The second point is the one with no workaround. Any later edit by anyone overwrites the value, so the column answers a question about the most recent editor no matter what anyone wants it to mean.

The system had never retained who submitted the record at all. That fact lived in another system entirely, so the honest answer was the finding plus the limitation of the source, which beats a number that looks confident.

## Write the observed meaning down, dated

For an analytics engineer that gap is a defect class. **A model that reads a field by its documented meaning inherits a bug the day local usage diverges from it.** Nothing in the model is wrong. The mistake was made years earlier by whoever started using the column for something else, and the model carries it forward faithfully.

So the observed meaning belongs in the model's documentation, dated, next to the vendor's, and downstream teams should read both. Usage changes, so an undated note is a claim with no expiry. The shape I keep coming back to is a note file beside the model:

```yaml notes/dim_order.yaml
columns:
  changed_by:
    observed: Last editor, not the author. Some IDs are service accounts.
    measured_on: 2026-03-14
```

## What it costs

Reading a column twice is slow. You count by value, look at the tail, check the nulls, check whether the distribution shifts on some date a process changed. It takes an afternoon on a table you meant to model in an hour, and it is the cheapest afternoon in the project.

You do not save it by skipping it. You spend it later, with a stakeholder in the room, explaining why a number that sat on a dashboard for six months never measured what its label promised.

Measure the column before you model it, and write down what you measured and when.
