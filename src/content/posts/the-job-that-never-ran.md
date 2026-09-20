---
title: The job that never ran
date: 2026-08-07
summary: A scheduled job that fails loudly is a bug. A scheduled job that never started is worse, because nothing anywhere is wrong.
tags: Reliability, Testing
draft: true
---

I went looking at the scheduled jobs on the platform I work on and found that some had been failing quietly for a while. Then I found the worse thing: nothing anywhere recorded whether they had run at all.

A job that throws an error leaves something behind: a stack trace, a red line in a log, sometimes a mail nobody reads. A job that never starts leaves nothing at all. There is no failure to go and find, because there was no run.

## Stale data renders perfectly

A dashboard built on yesterday's numbers does not look broken. Every chart draws, every total adds up, every join returns rows. The figures are internally consistent; they are only describing the wrong day.

**A wrong number is a question somebody asks. A stale number is a question nobody thinks to ask.** On a quiet week, plausible-but-old survives for days.

## Nothing fires for a job that did not start

Most alerting is built around errors, and an error has a prerequisite: something ran. If that first link is missing, none of the rest engages. Silence arrives from several directions, all of them undramatic:

- A scheduler that did not fire at all
- A host restarted at the wrong minute
- A job disabled during an incident and never re-enabled

The second of my two findings was the real one. I could have made every silent failure loud and still had no way to tell a healthy Thursday from a Thursday on which nothing happened.

## Record every run, then look for the gap

The fix is unglamorous. Write a row for every run, including the ones that fail, before doing anything clever about failures. Once each run is a row, and the schedule itself is a row, "no row for today" becomes a condition you can query, and an absence is as visible as an error.

Then invert the check. The useful question is not whether an error was thrown, it is whether an expected run is missing.

```sql expected_runs_missing.sql
-- Daily jobs whose deadline has passed with no successful run today.
select
    s.job_name,
    s.expected_by
from job_schedule as s
where s.expected_by < current_time
  and not exists (
      select 1
      from job_run as r
      where r.job_name = s.job_name
        and r.run_date = current_date
        and r.status = 'success'
  )
```

Jobs on any other cadence need that cadence carried in the schedule table, and the comparison made against the last expected occurrence rather than against the calendar day.

Freshness is a property of the data, not of the scheduler, so it belongs with the other tests on that data rather than in a monitoring corner of its own. If a model already asserts that its keys are unique and its references resolve, asserting that it was refreshed today belongs in the same place.

## The check nobody can act on

I left one ingest pipeline off the dashboard on purpose, and that was the harder half of the design. A check nobody can act on is noise, and noise teaches people to look past the board, including past the tiles that do mean something.

Choosing what to monitor is mostly listing what can break. Choosing what to leave out means admitting that four tiles people trust beat fourteen they skim.

So the question I now ask of anything on a schedule is not "did it fail". It is "how would I know if it simply never ran".
