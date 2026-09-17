---
title: Six places a price can come from
date: 2026-07-22
summary: "Why was I charged this?" is one of the hardest questions an e-commerce system can answer, because the price is not stored anywhere — it is the result of an ordered search.
tags: E-commerce, Debugging
draft: true
---

A customer service agent forwards a complaint: the website showed one price, the
invoice charged another. Somebody needs to work out which one was right.

The instinct is to go and look up the price. That instinct is wrong, and
understanding why is most of the job.

## The price is a search result

On the platform I work on, a price is not a value sitting in a column. It is
whatever the first matching rule produces, searched in a fixed order:

1. A price list negotiated for that specific customer
2. The general price list for their currency and region
3. An active promotion, usually created from a quote
4. A clearance price, if the line is being run down
5. A cost factor applied to the account
6. An uplift applied on top

Each layer can be absent. Each has its own validity dates. The first one that hits
wins, and the rest are never consulted. So "the price" for a SKU is meaningless on
its own — you can only ask for the price *for this customer, on this date*.

## Why this makes debugging hard

Two things fall out of an ordered fallback, and they cause most of the confusion.

**The answer changes with time, not just with input.** A promotion that expired
last Tuesday means the same customer and the same SKU legitimately produce
different prices before and after Tuesday. Reproducing the complaint means
reproducing the date, which is not usually in the complaint.

**A missing rule looks identical to a wrong rule.** If a customer expected a
negotiated discount and did not get it, layer one either did not exist, did not
cover that SKU, or had lapsed. From the invoice, all three look the same: a price
that came from layer two.

## What actually works

Stop trying to find the price. Replay the search instead.

The useful tool is not a lookup, it is a trace — for a given account, SKU and date,
show every layer in order, whether it matched, and why it was skipped. The output
is boring: five lines saying "no match" and one saying "matched". But it converts
an argument into a fact, and it does so without anyone needing to hold the
resolution order in their head.

That last part matters more than it sounds. The order is documented, but nobody
recalls it correctly under pressure from a customer waiting on a reply. A tool that
prints the order every time is also a tool that teaches it.

## The general shape

Any system where the answer is "the first rule that matches" has this property:
the thing users ask about is not a thing you store. Permissions work this way.
Routing works this way. Tax rules work this way.

If you find yourself supporting one, build the trace before you build the
explanation. You will write the explanation far fewer times.
