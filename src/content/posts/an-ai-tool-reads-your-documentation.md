---
title: The hard part is finding the right column
date: 2026-09-20
summary: Giving a language model access to a data catalogue takes an afternoon. Getting it to return the column somebody actually asked about is the rest of the work.
tags: AI tooling, Documentation
draft: true
---

I built a Model Context Protocol server to give a language model structured,
read-only access to an ERP schema. The protocol part took an afternoon.
Everything after that was search.

That ratio surprised me at the time. It has stopped surprising me since.

## The plumbing is a decorator and a run() call

The server is Python. Each tool is a function with a decorator on it, and the
process ends with a `run()` call that speaks the protocol over stdio. Six tools,
serving a corpus of 141 tables, 2,936 field definitions and 2,667 field-help
documents.

It ships with a self-test that calls every tool with a known input and checks
the shape of each response, so a broken install fails before a model ever sees
it, and I verified it separately with a throwaway client that did a real stdio
handshake and exercised the error paths. All of that is mechanical, and none of
it is the reason the tool turned out to be useful.

## The question that returned nothing

Someone asks about "order status". The search returned nothing at all.

The column is there. It is documented as "Highest status, customer order". A
substring search for the phrase never matches that string, and neither does any
tidier rephrasing of the question, because the schema is written in the vendor's
word order and nobody asking a question knows the vendor's word order.

The fix was small. Require every term in the query to appear somewhere in the
field's name, description or help text, in any order, instead of matching the
phrase.

```python search.py
terms = query.lower().split()
hits = [f for f in fields if all(t in f.haystack for t in terms)]
```

**The model never sees your schema, it sees whatever your search function
decided to return.** Get that wrong and nothing fails loudly. The model answers
confidently from the closest thing it was handed.

## Descriptions are written for the model

The other thing that took real thought was the tool descriptions, because that
text is the only interface the model has. A description that only says what a
tool does gets called for questions it cannot answer, so each one has to say
when *not* to call it as well as when to.

The same logic applies to safety. This server is read-only by construction: no
tool writes, and no tool runs arbitrary SQL. Read-only by instruction is a
sentence in a prompt, and a sentence can be argued with. A server with no write
tool cannot be talked into writing.

## Scores I do not have yet

I am building a public version of this over dbt artefacts,
[dbt-catalog-mcp](https://github.com/keithwalsh/dbt-catalog-mcp). It is at
design stage, with no code written yet, and its whole point is that retrieval
quality gets measured rather than asserted.

There is a question set where each plain-English question names the model or
column a correct answer has to surface, scored as hit@1, hit@3 and mean
reciprocal rank. A change that does not move those numbers does not get merged.
The results table in the README currently reads TBD in every cell, which is the
honest state of it.

I would rather publish an empty table than a claim. The failure I started with
was invisible: the search ran, returned nothing, and looked like a schema that
did not contain the column. An AI tool is only ever as good as the layer it
reads, and that layer is your documentation.
