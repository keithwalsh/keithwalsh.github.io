---
title: The job that never ran
date: 2026-09-18
summary: A scheduled job that fails loudly is a bug. A scheduled job that never started is worse, because nothing anywhere is wrong.
tags: Reliability, Testing
draft: true
---

Somebody asked me why a report had not changed since Tuesday. It had run on
Tuesday, and it had run correctly. It had not run since, and nothing in the
platform I work on knew that.

A job that throws an error leaves something behind: a stack trace, a red line
in a log, sometimes a mail nobody reads. A job that never starts leaves
nothing at all. There is no failure to go and find, because there was no run.

## Stale data renders perfectly

A dashboard built on yesterday's numbers does not look broken. Every chart
draws, every total adds up, every join returns rows. The figures are
internally consistent; they are only describing the wrong day.

**A wrong number is a question somebody asks. A stale number is a question
nobody thinks to ask.** The only people who catch it are the ones who know
roughly what today's figure should be, and only once the drift is large enough
to be obvious. On a quiet week, plausible-but-old survives for days.

## Nothing fires for a job that did not start

Most alerting is built around errors, and an error has a prerequisite:
something ran. If that first link is missing, none of the rest engages.
Silence arrives from several directions, all of them undramatic:

- A scheduler that did not fire at all
- A host restarted at the wrong minute
- A job disabled during an incident and never re-enabled

When I went looking, I found scheduled jobs failing silently, and, worse, that
nothing recorded whether a job had run at all. The second finding was the real
one. I could have made every silent failure loud and still had no way to tell
a healthy Thursday from a Thursday on which nothing happened.

## Record every run, then alert on the gap

The fix is unglamorous. Write a row for every run, including the ones that
fail, before doing anything clever about making failures noisier. Once each
run is a row, "no row for today" becomes a condition you can query, and an
absence is suddenly as visible as an error.

Then invert the alert. Do not alert on the error that was thrown; alert on the
expected run that is missing.

```sql expected_runs_missing.sql
-- What should have run today, against what actually did.
select
    s.job_name,
    s.expected_by,
    r.started_at,
    r.status
from job_schedule as s
left join job_run as r
    on r.job_name = s.job_name
   and r.run_date = current_date
where r.started_at is null
   or r.status <> 'success'
```

Freshness is a property of the data, not of the scheduler, so it belongs
alongside the other tests on that data rather than off in a monitoring corner
of its own. If a model already asserts that its keys are unique and its
references resolve, then asserting it was refreshed today is the same kind of
statement, made in the same place.

## The check nobody can act on

I left one ingest pipeline off the dashboard on purpose. Not because it
mattered less, but because the people reading the board had no action to take
if its tile went red. A check nobody can act on is not a safeguard. It is
noise, and noise teaches people to look past the board, including past the
tiles that do mean something.

That was the harder half of the design. Choosing what to monitor is mostly
listing what can break. Choosing what to leave out means admitting that an
honest board with four tiles beats a complete one with fourteen, because only
the first one gets read.

So the question I now ask of anything on a schedule is not "did it fail". It
is "how would I know if it simply never ran".
