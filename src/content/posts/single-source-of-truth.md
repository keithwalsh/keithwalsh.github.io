---
title: Three different dates for the same job
date: 2026-09-17
summary: This site stored my work history twice. Both copies rendered, neither was authoritative, and they disagreed about when I changed roles.
tags: TypeScript, Data modelling
draft: true
---

I was updating this site and found it was telling two different stories about my
own career. The About page said one of my roles ran from June 2017. The Projects
page, two clicks away, said June 2018.

Neither page was wrong, exactly. They were reading different files.

## How it happened

The site keeps its content as JSON rather than hardcoding it into components. That
part is fine. The problem was that two pages needed overlapping slices of the same
information, and the shape each page wanted was slightly different:

- The About timeline wanted a date range, a location, and a company description.
- The Projects page wanted a role, a period, achievements, and a technology list.

So there were two files. `professionalJourney.json` and
`professionalProjects.json`. Each had a full copy of the role history. Each was
edited by hand, at different times, and drifted apart on three separate date
ranges before anyone read both pages in the same sitting.

## Why nothing caught it

This is a TypeScript codebase with strict mode on. Every file typechecks. That is
exactly the point: **a type system verifies shape, not agreement.** Both files were
valid. They just disagreed about reality, and nothing in the toolchain has an
opinion about reality.

There is no test that could reasonably have caught it either. You would have to
write an assertion that two content files agree about facts neither of them owns.
At that point you have built a worse version of the actual fix.

## The fix

Delete one file. Give the surviving one the fields the second page needed, and
derive that page from it:

```tsx professional-projects-page.tsx
// Roles live in professionalJourney.json so the About timeline and this page
// can never disagree about dates.
{journey.positions.map((position) => (
  <ProjectCard
    key={`${position.company}-${position.dateRange}`}
    title={position.title}
    subtitle={`${position.company}, ${position.location} · ${position.dateRange}`}
    points={position.details}
    technologies={position.technologies}
  />
))}
```

The two pages still look different. They render different components, in different
layouts, with different emphasis. They are just no longer allowed to disagree about
when I started a job, because there is only one place that fact is written down.

## The part worth keeping

The instinct that created the bug was a good one — don't force two pages to share a
shape that fits neither. The mistake was fixing that with a second copy of the data
instead of a second view over it.

When two files describe the same real-world thing, the question is not whether
they're both correct today. It's which one you'd believe when they stop agreeing.
If you can't answer that immediately, you don't have two files. You have one file
and one time bomb.
