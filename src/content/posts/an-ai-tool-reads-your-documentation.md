---
title: Building an MCP server, the search was the hard part
date: 2026-09-04
summary: Giving a language model access to a data catalogue is the easy part. Getting it to return the column somebody actually asked about is the rest of the work.
tags: Documentation, dbt
draft: false
---

I built a Model Context Protocol server to give a language model structured, read-only access to an ERP schema. The protocol itself was straightforward. Everything after that was search.

That balance surprised me at the time. It has stopped surprising me since.

## Six tools and a decorator

The server is Python. Each tool is a function with a decorator on it, and the process ends with a call that speaks the protocol over stdio. Six tools, serving a corpus of 141 tables, 2,936 field definitions and 2,667 field-help documents.

It ships with a self-test that calls every tool with a known input and checks the shape of each response, so a broken install fails before a model ever sees it. I verified it separately with a throwaway client that did a real stdio handshake and exercised the error paths. All of that is mechanical, and none of it is the reason the tool turned out to be useful.

## The question that returned nothing

I typed "order status" into my own tool and got an empty list back.

My first assumption was that the corpus was incomplete: a table skipped on load, a block of field help that never made it across. It was all there. The column I wanted was sitting in the documentation exactly as the vendor had written it, described as "Highest status, customer order". My three words were in that string, in a different order, with another word between them, and a substring match on the phrase never had a chance.

The fix was small. Require every term in the query to appear somewhere in the field's name, description or help text, in any order, instead of matching the phrase:

```python search.py
terms = query.lower().split()
hits = [f for f in fields if all(t in f.haystack.lower() for t in terms)]
```

**The model never sees your schema. It sees whatever your search function returns.** Search is the product here, and the protocol is transport.

## Descriptions are written for the model

The other thing that took real thought was the tool descriptions, because that text is the only interface the model has. A description that only says what a tool does gets called for questions it cannot answer, so each one has to say when *not* to call it as well as when to.

The same logic applies to safety. This server is read-only by construction: no tool writes. Read-only by instruction is a sentence in a prompt, and a sentence can be argued with. A server with no write tool cannot be talked into writing.

## The layer underneath

What made the server worth having was not the protocol and not the six tools. It was that somebody had already written down what those fields mean, and that the search could reach them through the words a person would use instead of the words a vendor chose. I am designing the public version of the same shape over dbt artefacts, in [dbt-catalog-mcp](https://github.com/keithwalsh/dbt-catalog-mcp), where the retrieval scores are the product rather than a footnote.

The tools were the quick part. The corpus underneath them was the slow one, and none of it was written with a language model in mind. An AI tool is only ever as good as the layer it reads, and that layer is your documentation.
