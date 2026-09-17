---
title: Adding a second warehouse without breaking the first
date: 2026-05-14
summary: Showing stock from two warehouses instead of one changes almost every page of a webshop. The interesting engineering was in the switch that decides who sees it.
tags: E-commerce, Rollout
draft: true
---

A webshop that serves one country from one warehouse has a comfortable assumption
baked into it: there is a single number called "stock". Open a second warehouse for
that country and the assumption breaks in more places than you would guess.

## Where "one warehouse" is hiding

The product page is the obvious one. It is not the expensive one. The assumption
turns up in:

- Stock columns on listing and search pages
- Downloadable stock and price files customers pull on a schedule
- Backorder messaging, which now has to say *which* warehouse is filling the gap
- Delivery estimates, because the two warehouses are not the same distance away
- Anything that cached a stock figure without recording where it came from

None of these are hard individually. The risk is that they ship at different
times, and a customer who sees two warehouses on the product page but one in the
downloadable file will not conclude that a rollout is in progress. They will
conclude the numbers are wrong.

## The gate is the feature

So the switch came first, before any of the display work.

A single predicate answers: *should this user see two warehouses?* Everything
else calls it. Nothing checks the country directly, nothing checks a config flag
directly, and no page decides for itself.

```php
// One place decides. Every stock surface asks this and nothing else.
if ($this->dualWarehouseEnabledFor($user)) {
    // two columns
}
```

Behind that predicate sits an allowlist, so the rollout goes out in waves —
internal accounts first, then a handful of customers who agreed to be early, then
everyone. If a wave goes badly, the fix is removing accounts from a list rather
than reverting a release that by then has other changes riding on it.

This is not a novel pattern. It is worth writing down anyway, because the pressure
during a rollout is always to put the condition where the bug is, and each time you
do that the number of places that can disagree goes up by one.

## The honest message

One decision turned out to matter more than the technical ones.

When the nearer warehouse is out of stock and the order will be filled from the
further one, the site says so, on the page, before checkout. It costs some
conversions. It costs far fewer than a customer discovering it from a tracking
number a week later, and it removes an entire category of support ticket.

Rollout work is mostly this: choosing which uncomfortable thing to tell people
early, so you are not explaining it late.
